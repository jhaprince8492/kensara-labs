/**
 * Scene C · The Proof Graph.
 *
 * A rule and fact base of 412 nodes, and the 4-node unsat core that was
 * actually responsible for the verdict. Seeded, so the still frame and the live
 * scene are the same graph.
 *
 * The minimisation is the argument: the proof is not the whole rule base, it is
 * the minimal set that was actually responsible, which is also, conveniently,
 * the explanation.
 */

export const NODE_COUNT = 412;
/** Matches the unsat core recorded in the assurance object. */
export const CORE_IDS = ['R-0087', 'R-0141', 'R-0302', 'R-0398'] as const;

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  /** Depth. The still ignores it; the live scene rotates the graph around it. */
  z: number;
  r: number;
  core: boolean;
}

export interface GraphEdge {
  a: number;
  b: number;
  core: boolean;
}

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildGraph(width = 900, height = 560) {
  const next = rng(0x2f6b);
  const nodes: GraphNode[] = [];

  const cx = width / 2;
  const cy = height / 2;

  for (let i = 0; i < NODE_COUNT; i += 1) {
    // Rings with jitter read as a relaxed force layout without running one.
    const ring = 0.18 + Math.pow(next(), 0.62) * 0.82;
    const angle = next() * Math.PI * 2;
    const jitter = (next() - 0.5) * 0.09;

    nodes.push({
      id: `R-${String(Math.floor(next() * 9000) + 100).padStart(4, '0')}`,
      x: cx + Math.cos(angle) * (ring + jitter) * width * 0.44,
      y: cy + Math.sin(angle) * (ring + jitter) * height * 0.44,
      z: (next() - 0.5) * (ring + jitter) * height * 0.7,
      r: 1.6 + next() * 1.4,
      core: false,
    });
  }

  // The core sits near the centre: four nodes the solver kept.
  const coreIndices = [7, 118, 241, 356];
  coreIndices.forEach((index, slot) => {
    const node = nodes[index];
    if (!node) return;
    const angle = (slot / coreIndices.length) * Math.PI * 2 + 0.4;
    node.x = cx + Math.cos(angle) * width * 0.085;
    node.y = cy + Math.sin(angle) * height * 0.11;
    node.z = Math.cos(angle * 1.7) * height * 0.05;
    node.r = 4.2;
    node.core = true;
    node.id = CORE_IDS[slot] ?? node.id;
  });

  // Edges: each node links to a couple of nearby nodes.
  const edges: GraphEdge[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i];
    if (!a) continue;
    const links = 1 + Math.floor(next() * 2);
    for (let k = 0; k < links; k += 1) {
      const j = (i + 1 + Math.floor(next() * 26)) % nodes.length;
      const b = nodes[j];
      if (!b || j === i) continue;
      edges.push({ a: i, b: j, core: a.core && b.core });
    }
  }

  // The core is fully connected, so the minimal proof reads as one shape.
  for (let i = 0; i < coreIndices.length; i += 1) {
    for (let j = i + 1; j < coreIndices.length; j += 1) {
      const a = coreIndices[i];
      const b = coreIndices[j];
      if (a === undefined || b === undefined) continue;
      edges.push({ a, b, core: true });
    }
  }

  return { nodes, edges };
}
