import { generateStates, project } from '@/lib/scenes/stateSpace';

/**
 * Tier 3 frame for Scene A: no WebGL, reduced motion, save-data, or a crawler.
 *
 * Same composition as the live scene, drawn from the same seeded generator, at
 * roughly 14KB of markup. It is emitted at build time, so tier 3 visitors run
 * no JavaScript for the hero at all.
 */

const WIDTH = 1200;
const HEIGHT = 800;
const STILL_POINTS = 1600;

function buildPaths() {
  const points = generateStates(STILL_POINTS);
  const dim: string[] = [];
  const sampled: string[] = [];
  const refuted: string[] = [];

  for (const point of points) {
    const { x, y } = project(point, WIDTH, HEIGHT);
    if (x < -20 || x > WIDTH + 20 || y < -20 || y > HEIGHT + 20) continue;
    const d = `M${Math.round(x)} ${Math.round(y)}h0`;
    if (point.refuted) refuted.push(d);
    else if (point.sampled) sampled.push(d);
    else dim.push(d);
  }

  return { dim: dim.join(''), sampled: sampled.join(''), refuted: refuted.join('') };
}

const PATHS = buildPaths();

export function StateSpaceStill({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="scanRay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--proof)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--proof)" stopOpacity="0.5" />
          <stop offset="55%" stopColor="var(--proof)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--proof)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="coreFade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--void)" stopOpacity="0" />
          <stop offset="78%" stopColor="var(--void)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--void)" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      {/* the cloud: most states resolve calm blue, at low opacity */}
      <path
        d={PATHS.dim}
        stroke="var(--proof)"
        strokeWidth="1.8"
        strokeOpacity="0.15"
        strokeLinecap="round"
        fill="none"
      />

      {/* the ray, mid-sweep */}
      <rect
        x={WIDTH * 0.5 - 1}
        y="0"
        width="2"
        height={HEIGHT}
        fill="url(#scanRay)"
      />

      {/* the states the sweep actually touched */}
      <path
        d={PATHS.sampled}
        stroke="var(--proof)"
        strokeWidth="2.4"
        strokeOpacity="0.75"
        strokeLinecap="round"
        fill="none"
      />

      {/* deep inside, unreachable by sampling, found by the solver */}
      <path
        d={PATHS.refuted}
        stroke="var(--refute)"
        strokeWidth="3.4"
        strokeOpacity="0.95"
        strokeLinecap="round"
        fill="none"
      />

      <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#coreFade)" />
    </svg>
  );
}
