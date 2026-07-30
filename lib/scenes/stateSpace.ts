/**
 * Scene A · The State Space.
 *
 * One generator, shared by the live WebGL scene and the static composed frame,
 * so the two are the same picture rather than two drawings of the same idea.
 * Seeded: every visitor sees the same cloud, and the still matches the live
 * scene point for point.
 *
 * The gap between what the ray touches and what exists is the argument. It is
 * never stated in words anywhere on the page.
 */

export const TOTAL_STATES = 14412;
export const SAMPLED_STATES = 128;
/** Points that a solver found and a sampled test suite cannot reach. */
export const REFUTED_STATES = 9;

export interface StatePoint {
  x: number;
  y: number;
  z: number;
  /** Distance from the cloud centre, 0 at the core. */
  depth: number;
  refuted: boolean;
  sampled: boolean;
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

/**
 * `count` points in a drifting cloud. Tier 2 asks for the same composition at
 * lower density, so a smaller count draws the same shape rather than a
 * different one: the sampling is stratified over the same seeded sequence.
 */
export function generateStates(count: number): StatePoint[] {
  const next = rng(0x51a7e);
  const points: StatePoint[] = [];
  const stride = Math.max(1, Math.floor(TOTAL_STATES / count));

  for (let i = 0; i < TOTAL_STATES; i += 1) {
    // Uniform-ish direction, radius biased outward so the cloud has a shell
    // and a core rather than reading as a fog.
    const u = next() * 2 - 1;
    const theta = next() * Math.PI * 2;
    const r = 0.42 + Math.pow(next(), 0.55) * 0.58;
    const s = Math.sqrt(1 - u * u);

    const keep = i % stride === 0 && points.length < count;
    if (!keep) continue;

    const x = Math.cos(theta) * s * r;
    const y = u * r * 0.72;
    const z = Math.sin(theta) * s * r;

    points.push({
      x,
      y,
      z,
      depth: r,
      // The refuted states sit deep inside, where a sampled sweep does not go.
      refuted: r < 0.56 && points.length % 97 === 13,
      // Touched by the scanning ray at its composed position.
      sampled: false,
    });
  }

  // Mark exactly REFUTED_STATES points, deterministically, deepest first.
  const deep = points
    .map((p, index) => ({ index, depth: p.depth }))
    .sort((a, b) => a.depth - b.depth)
    .slice(0, REFUTED_STATES);
  for (const p of points) p.refuted = false;
  for (const { index } of deep) {
    const point = points[index];
    if (point) point.refuted = true;
  }

  // Mark exactly SAMPLED_STATES points as touched by the ray: those nearest the
  // sweep plane at its composed angle. Scaled with count so the still and the
  // live scene highlight the same proportion of the cloud.
  // Kept close to the true proportion. The sparsity is the argument, so
  // inflating it here would be arguing the opposite case.
  const quota = Math.max(12, Math.round((SAMPLED_STATES / TOTAL_STATES) * points.length * 2.5));
  const nearRay = points
    .map((p, index) => ({ index, d: Math.abs(p.z * 0.86 + p.y * 0.2) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, quota);
  for (const { index } of nearRay) {
    const point = points[index];
    if (point && !point.refuted) point.sampled = true;
  }

  return points;
}

/** Perspective projection into a 1200 x 800 frame, for the static still. */
export function project(
  point: StatePoint,
  width = 1200,
  height = 800,
): { x: number; y: number; scale: number } {
  const distance = 2.6;
  const scale = distance / (distance - point.z * 0.9);
  return {
    x: width / 2 + point.x * width * 0.34 * scale,
    y: height / 2 + point.y * height * 0.42 * scale,
    scale,
  };
}
