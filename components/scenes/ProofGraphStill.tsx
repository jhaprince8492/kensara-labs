import { CORE_IDS, NODE_COUNT, buildGraph } from '@/lib/scenes/proofGraph';

/**
 * Scene C, composed frame. 412 rules dimmed to hairline; the 4-rule unsat core
 * illuminated. This is the state the live scene lands on, so the still is the
 * end of the sequence rather than a different picture.
 */

const WIDTH = 900;
const HEIGHT = 560;

const GRAPH = buildGraph(WIDTH, HEIGHT);

const BASE_EDGES = GRAPH.edges
  .filter((edge) => !edge.core)
  .map((edge) => {
    const a = GRAPH.nodes[edge.a];
    const b = GRAPH.nodes[edge.b];
    if (!a || !b) return '';
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  })
  .join('');

const CORE_EDGES = GRAPH.edges
  .filter((edge) => edge.core)
  .map((edge) => {
    const a = GRAPH.nodes[edge.a];
    const b = GRAPH.nodes[edge.b];
    if (!a || !b) return '';
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  })
  .join('');

const BASE_NODES = GRAPH.nodes
  .filter((node) => !node.core)
  .map((node) => `M${node.x.toFixed(1)} ${node.y.toFixed(1)}h0`)
  .join('');

export function ProofGraphStill({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      role="img"
      aria-label={`A graph of ${NODE_COUNT} rule and fact nodes, dimmed to a hairline grey. Four nodes near the centre, ${CORE_IDS.join(', ')}, are illuminated together with the edges between them: the minimal set of rules responsible for the verdict.`}
    >
      <path d={BASE_EDGES} stroke="var(--hairline)" strokeWidth="0.6" fill="none" />
      <path
        d={BASE_NODES}
        stroke="var(--ink-500)"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      <path d={CORE_EDGES} stroke="var(--proof)" strokeWidth="1.4" strokeOpacity="0.85" fill="none" />
      {GRAPH.nodes
        .filter((node) => node.core)
        .map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={node.r + 5} fill="var(--proof)" fillOpacity="0.12" />
            <circle cx={node.x} cy={node.y} r={node.r} fill="var(--proof)" />
            <text
              x={node.x + 10}
              y={node.y + 4}
              fill="var(--proof)"
              fontSize="11"
              fontFamily="var(--font-mono)"
            >
              {node.id}
            </text>
          </g>
        ))}
    </svg>
  );
}
