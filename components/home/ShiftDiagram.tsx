import { home } from '@/content/copy/home';

/**
 * Enumerable to sampled, read left to right: a fixed chain of five steps, and
 * then the point at which the paths stop being a list and start being a space.
 * The branches draw in on reveal; under reduced motion they are simply drawn.
 */
export function ShiftDiagram() {
  const { diagram } = home.shift;

  return (
    <figure className="border border-hairline bg-slate-900 p-5">
      <svg viewBox="0 0 520 300" className="w-full" role="img" aria-label={diagram.alt}>
        <g stroke="var(--hairline)" strokeWidth="1" fill="none">
          <line x1="24" y1="150" x2="212" y2="150" />
        </g>

        {/* deterministic: five enumerable steps */}
        {[24, 71, 118, 165, 212].map((x) => (
          <rect
            key={x}
            x={x - 7}
            y={143}
            width="14"
            height="14"
            fill="var(--slate-800)"
            stroke="var(--ink-500)"
            strokeWidth="1"
          />
        ))}

        {/* agentic: the same process, branching past enumeration */}
        <g
          className="branches"
          stroke="var(--proof)"
          strokeWidth="1"
          strokeOpacity="0.55"
          fill="none"
        >
          {buildBranches().map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        <g fill="var(--proof)" fillOpacity="0.7">
          {buildLeaves().map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" />
          ))}
        </g>

        <line
          x1="212"
          y1="30"
          x2="212"
          y2="270"
          stroke="var(--hairline)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      </svg>

      <figcaption className="mt-4">
        <div className="flex flex-wrap justify-between gap-3">
          <span className="eyebrow">{diagram.leftLabel}</span>
          <span className="eyebrow">{diagram.rightLabel}</span>
        </div>
        {/* The clearest sentence in the section, so it is not set at 12px. */}
        <p className="mt-4 border-t border-hairline pt-4 text-17 text-ink-100">
          {diagram.caption}
        </p>
      </figcaption>
    </figure>
  );
}

/** Deterministic binary fan-out from the last enumerable step. */
function buildBranches(): string[] {
  const paths: string[] = [];
  const levels = 4;
  let frontier: [number, number][] = [[212, 150]];

  for (let level = 0; level < levels; level += 1) {
    const dx = 76;
    const spread = 60 / (level + 1);
    const next: [number, number][] = [];

    for (const [x, y] of frontier) {
      for (const sign of [-1, 1]) {
        const nx = x + dx;
        const ny = y + sign * spread;
        paths.push(`M${x} ${y}C${x + dx / 2} ${y} ${x + dx / 2} ${ny} ${nx} ${ny}`);
        next.push([nx, ny]);
      }
    }
    frontier = next.slice(0, 16);
  }

  return paths;
}

function buildLeaves(): [number, number][] {
  const leaves: [number, number][] = [];
  let frontier: [number, number][] = [[212, 150]];

  for (let level = 0; level < 4; level += 1) {
    const spread = 60 / (level + 1);
    const next: [number, number][] = [];
    for (const [x, y] of frontier) {
      for (const sign of [-1, 1]) next.push([x + 76, y + sign * spread]);
    }
    frontier = next.slice(0, 16);
  }

  for (const point of frontier) leaves.push(point);
  return leaves;
}
