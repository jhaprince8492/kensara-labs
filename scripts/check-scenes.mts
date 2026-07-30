/**
 * Scene generator assertions.
 *
 * The scenes are seeded, so their output is checkable without a GPU. This
 * catches the failures a typecheck cannot see: non-finite coordinates, a core
 * that is not the core the assurance object claims, a sampled set that quietly
 * overstates how much of the state space a test suite reaches, and any drift
 * between two builds of the same seeded graph.
 */

import { CORE_IDS, NODE_COUNT, buildGraph } from '../lib/scenes/proofGraph.ts';
import { REFUTED_STATES, SAMPLED_STATES, TOTAL_STATES, generateStates } from '../lib/scenes/stateSpace.ts';
import { GATE_SCENARIOS, SCENARIO_SECONDS } from '../lib/scenes/gate.ts';

const problems: string[] = [];
const finite = (n: number) => Number.isFinite(n);

// --- Scene C · the proof graph ---------------------------------------------

const graph = buildGraph(900, 560);

if (graph.nodes.length !== NODE_COUNT) problems.push(`node count is ${graph.nodes.length}`);

const core = graph.nodes.filter((n) => n.core);
if (core.map((n) => n.id).join(',') !== CORE_IDS.join(',')) {
  problems.push(`core ids are ${core.map((n) => n.id).join(',')}, expected ${CORE_IDS.join(',')}`);
}

for (const node of graph.nodes) {
  if (!finite(node.x) || !finite(node.y) || !finite(node.z)) {
    problems.push(`non-finite coordinate on node ${node.id}`);
    break;
  }
}

for (const edge of graph.edges) {
  if (!graph.nodes[edge.a] || !graph.nodes[edge.b]) {
    problems.push('an edge references a node that does not exist');
    break;
  }
}

const coreEdges = graph.edges.filter((e) => e.core).length;
if (coreEdges < 6) problems.push(`core is not fully connected: ${coreEdges} edges`);

if (JSON.stringify(buildGraph(900, 560).nodes) !== JSON.stringify(graph.nodes)) {
  problems.push('the graph is not deterministic between builds');
}

// --- Scene A · the state space ---------------------------------------------

const truth = SAMPLED_STATES / TOTAL_STATES;

for (const count of [1600, 3000, TOTAL_STATES]) {
  const points = generateStates(count);

  if (points.length !== count) problems.push(`state count ${points.length} at requested ${count}`);

  const refuted = points.filter((p) => p.refuted).length;
  if (refuted !== REFUTED_STATES) problems.push(`refuted ${refuted} at count ${count}`);

  const share = points.filter((p) => p.sampled).length / points.length;
  if (share > truth * 4) {
    problems.push(
      `sampled share ${(share * 100).toFixed(2)}% overstates the true ${(truth * 100).toFixed(2)}%`,
    );
  }

  if (points.some((p) => !finite(p.x) || !finite(p.y) || !finite(p.z))) {
    problems.push(`non-finite coordinate at count ${count}`);
  }
}

// --- Scene B · the gate ------------------------------------------------------

if (GATE_SCENARIOS.length !== 3) problems.push('expected three seeded scenarios');
if (!GATE_SCENARIOS.some((s) => s.outcome === 'REVIEW')) problems.push('no hold-lane scenario');
if (!GATE_SCENARIOS.some((s) => s.outcome === 'ALLOW')) problems.push('no permitted scenario');

for (let t = 0; t < SCENARIO_SECONDS * 4; t += 0.37) {
  const index = Math.floor(t / SCENARIO_SECONDS) % GATE_SCENARIOS.length;
  if (!GATE_SCENARIOS[index]) {
    problems.push(`scenario index ${index} is out of range at t=${t.toFixed(2)}`);
    break;
  }
}

// --- report ------------------------------------------------------------------

if (problems.length > 0) {
  console.error('check-scenes: FAILED');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log('  proof graph  ' + `${graph.nodes.length} nodes · ${graph.edges.length} edges · core ${CORE_IDS.join(' ')}`);
console.log('  state space  ' + `${SAMPLED_STATES} of ${TOTAL_STATES} sampled · ${REFUTED_STATES} refuted`);
console.log('  gate         ' + `${GATE_SCENARIOS.length} scenarios · ${SCENARIO_SECONDS}s each`);
console.log('\ncheck-scenes: ok');
