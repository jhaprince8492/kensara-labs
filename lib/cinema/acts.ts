/**
 * The eight acts.
 *
 * One continuous world seen in eight passages, each mapped to an existing home
 * page section. The film is background: it never occludes, never animates over
 * text, and never competes with a paragraph. Where a frame and a sentence want
 * the same pixels, the frame loses.
 *
 * Nothing in this file touches copy. The sections keep their strings exactly as
 * they are; acts only render behind them.
 */

export type ActId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ActConfig {
  id: ActId;
  /** Which existing section this sits behind. Documentation, not a selector. */
  section: string;
  /** One sentence describing the shot, for screen readers. The film carries
   *  meaning, so it is described rather than hidden. */
  label: string;
  /**
   * Frames at full tier.
   *
   * The blueprint asked for 72 on Acts I, IV and VI. Real graded footage lands
   * at roughly 29KB a frame once the anti-banding grain is in, which puts 72
   * frames over both the per-act cap and the 24KB average. The blueprint's own
   * rule applies: reduce frame count before quality, because 48 clean frames
   * scrub better than 72 blocky ones.
   */
  frames: 48 | 72;
  /**
   * Four scrim stops at 0%, 38%, 72% and 100%. Tuned per act: the darkest part
   * sits under the text column. Acts III and V carry the most text and get the
   * heaviest treatment; Act I is allowed to breathe.
   */
  scrim: [number, number, number, number];
  /** Opacity multiplier on the film itself, 0 to 1. */
  intensity: number;
  /** Acts kept alive on CINEMA_LIGHT. The rest fall back to their poster. */
  light: boolean;
}

export const ACTS: readonly ActConfig[] = [
  {
    id: 1,
    section: 'hero',
    label:
      'An immense field of faint blue points extending beyond the frame. A thin plane of light sweeps through it and touches almost none of them. Deep inside, a few points hold red.',
    frames: 48,
    // Tuned against real frames. The lighter scrim this act carried through
    // Phase 1 was set against placeholder art and dropped body copy to 2.81:1
    // once the footage landed. Back to the specified baseline.
    scrim: [0.55, 0.88, 0.88, 0.6],
    intensity: 0.85,
    light: true,
  },
  {
    id: 2,
    section: 'shift',
    label:
      'Five clean parallel tracks of light run steadily left to right, then fracture into thousands of divergent filaments that fill the frame and cannot be counted.',
    frames: 48,
    scrim: [0.5, 0.82, 0.82, 0.58],
    intensity: 0.85,
    light: false,
  },
  {
    id: 3,
    section: 'matrix',
    label:
      'A dark lattice of eight faintly lit structural nodes connected by hairline geometry, receding into fog. The camera tracks slowly past them.',
    frames: 48,
    // The densest text on the page sits here. This is the quietest background.
    scrim: [0.62, 0.92, 0.92, 0.7],
    intensity: 0.45,
    light: false,
  },
  {
    id: 4,
    section: 'turn',
    label:
      'Soft diffuse light on the left condenses as it crosses a faintly visible boundary plane and crystallises into hard geometric lattice on the right.',
    frames: 48,
    // The crystallisation is the brightest act in the film by mean luminance
    // (0.123 against 0.042 for Act I), so it carries a heavier scrim than its
    // placeholder needed.
    scrim: [0.52, 0.87, 0.87, 0.62],
    intensity: 0.9,
    light: true,
  },
  {
    id: 5,
    section: 'system',
    label:
      'The frame divides. Cool blue light spirals inward toward a single point on the left. On the right a translucent plane examines arriving points and either passes or deflects them. Both halves converge below.',
    frames: 48,
    scrim: [0.6, 0.9, 0.9, 0.68],
    intensity: 0.55,
    light: false,
  },
  {
    id: 6,
    section: 'artifact',
    label:
      'Scattered fragments of light collapse inward and compress into a single dense slab whose surface resolves into fine crystalline structure, then holds still.',
    frames: 72,
    scrim: [0.5, 0.84, 0.84, 0.6],
    intensity: 0.9,
    light: true,
  },
  {
    id: 7,
    section: 'industries',
    label:
      'Six translucent volumes of light at different scales and densities, arranged in depth and sharing one crystalline signature. The camera drifts past them.',
    frames: 48,
    scrim: [0.52, 0.85, 0.85, 0.6],
    intensity: 0.7,
    light: false,
  },
  {
    id: 8,
    section: 'close',
    label:
      'An almost entirely dark field with a scattering of faint distant points. One point near the centre is slightly brighter and holds steady.',
    frames: 48,
    scrim: [0.48, 0.8, 0.8, 0.55],
    intensity: 0.8,
    light: false,
  },
] as const;

export function actConfig(id: ActId): ActConfig {
  const found = ACTS.find((act) => act.id === id);
  if (!found) throw new Error(`unknown act ${id}`);
  return found;
}

/** `act01`, `act02`, and so on. Used for asset paths everywhere. */
export function actSlug(id: ActId): string {
  return `act${String(id).padStart(2, '0')}`;
}

/** The four-stop graded scrim. Not a flat overlay: the darkest band sits under
 *  the text column, so legibility does not depend on the frame behind it. */
export function scrimGradient(stops: readonly number[]): string {
  const [a = 0.5, b = 0.85, c = 0.85, d = 0.6] = stops;
  return (
    'linear-gradient(180deg,' +
    ` rgba(5,7,11,${a}) 0%,` +
    ` rgba(5,7,11,${b}) 38%,` +
    ` rgba(5,7,11,${c}) 72%,` +
    ` rgba(5,7,11,${d}) 100%)`
  );
}
