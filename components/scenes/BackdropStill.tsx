import { generateStates, project } from '@/lib/scenes/stateSpace';

/**
 * Tier 3 backdrop: no WebGL, reduced motion, save-data, or a crawler.
 *
 * The same composition at rest, drawn at build time from the same seeded
 * generator: the state cloud on the left of frame, the assembled solid on the
 * right. Roughly 16KB of markup and zero JavaScript, so the copy above it is
 * never waiting on a canvas that is not coming.
 */

const WIDTH = 1200;
const HEIGHT = 800;
const STILL_POINTS = 1400;

function buildCloud() {
  const points = generateStates(STILL_POINTS);
  const dim: string[] = [];
  const lit: string[] = [];
  const red: string[] = [];

  for (const point of points) {
    const { x, y } = project(point, WIDTH, HEIGHT);
    if (x < -20 || x > WIDTH + 20 || y < -20 || y > HEIGHT + 20) continue;
    const d = `M${Math.round(x * 0.62)} ${Math.round(y)}h0`;
    if (point.refuted) red.push(d);
    else if (point.sampled) lit.push(d);
    else dim.push(d);
  }

  return { dim: dim.join(''), lit: lit.join(''), red: red.join('') };
}

/** The assembled solid, as a hairline icosahedral wireframe. */
function buildSolid(cx: number, cy: number, r: number) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw: [number, number, number][] = [];
  for (const s of [-1, 1]) {
    for (const t of [-1, 1]) {
      raw.push([0, s, t * phi], [s, t * phi, 0], [t * phi, 0, s]);
    }
  }

  // Fixed rotation so the silhouette reads as a solid rather than a flat ring.
  const ry = 0.6;
  const rx = 0.34;
  const projected = raw.map(([x, y, z]) => {
    const x1 = x * Math.cos(ry) + z * Math.sin(ry);
    const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
    const y1 = y * Math.cos(rx) - z1 * Math.sin(rx);
    const scale = r / Math.sqrt(1 + phi * phi);
    return [cx + x1 * scale, cy + y1 * scale] as [number, number];
  });

  const edges: string[] = [];
  const edgeLength = 2 / Math.sqrt(1 + phi * phi);
  for (let i = 0; i < raw.length; i += 1) {
    for (let j = i + 1; j < raw.length; j += 1) {
      const a = raw[i]!;
      const b = raw[j]!;
      const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (Math.abs(d - 2) > 0.01 * 2 && Math.abs(d / Math.sqrt(1 + phi * phi) - edgeLength) > 0.01) {
        continue;
      }
      const pa = projected[i]!;
      const pb = projected[j]!;
      edges.push(`M${pa[0].toFixed(1)} ${pa[1].toFixed(1)}L${pb[0].toFixed(1)} ${pb[1].toFixed(1)}`);
    }
  }

  return { edges: edges.join(''), vertices: projected };
}

const CLOUD = buildCloud();
const SOLID = buildSolid(WIDTH * 0.74, HEIGHT * 0.5, 210);

export function BackdropStill({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <path d={CLOUD.dim} stroke="var(--proof)" strokeWidth="1.8" strokeOpacity="0.14" strokeLinecap="round" fill="none" />
      <path d={CLOUD.lit} stroke="var(--proof)" strokeWidth="2.4" strokeOpacity="0.7" strokeLinecap="round" fill="none" />
      <path d={CLOUD.red} stroke="var(--refute)" strokeWidth="3.2" strokeOpacity="0.9" strokeLinecap="round" fill="none" />

      <path d={SOLID.edges} stroke="var(--hairline)" strokeWidth="1.1" fill="none" />
      {SOLID.vertices.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="var(--ink-600)" />
      ))}
    </svg>
  );
}
