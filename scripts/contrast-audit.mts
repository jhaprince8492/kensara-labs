/**
 * Measured legibility. Build-breaking.
 *
 * Film behind text is where good sites become unreadable, and the failure is
 * always discovered by a reader rather than by the team. So it is measured: for
 * each act, twelve frames at even intervals, composited exactly as the browser
 * composites them (film at the act's intensity over the void, then the graded
 * scrim), sampled inside the region where body copy actually sits, and asserted
 * against both text tokens.
 *
 * When an act fails, darken the film, never the text. Heavy scrim makes the
 * film look like a mistake; light text on a bright frame is unreadable.
 */

import { join } from 'node:path';
import sharp from 'sharp';
import { ACTS, CINEMA_DIR, actSlug, frameName, readManifest } from './lib/cinema.mts';

const VOID = { r: 5, g: 7, b: 11 };
const INK_100 = { r: 232, g: 236, b: 242 };
const INK_400 = { r: 138, g: 152, b: 172 };
const MINIMUM = 4.5;
const SAMPLES = 12;

/** The band of the sticky viewport where body copy sits: the measure column,
 *  vertically between the two heaviest scrim stops. */
const TEXT_REGION = { left: 0, top: 0.38, width: 0.62, height: 0.34 };

function channelLuminance(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(rgb: { r: number; g: number; b: number }): number {
  return (
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b)
  );
}

function contrast(a: number, b: number): number {
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}

function over(
  top: { r: number; g: number; b: number },
  bottom: { r: number; g: number; b: number },
  alpha: number,
) {
  return {
    r: top.r * alpha + bottom.r * (1 - alpha),
    g: top.g * alpha + bottom.g * (1 - alpha),
    b: top.b * alpha + bottom.b * (1 - alpha),
  };
}

const manifest = await readManifest();
const failures: string[] = [];

console.log('contrast audit · body copy over film, per act\n');
console.log('  act    worst ink-100   worst ink-400   verdict');

for (const config of ACTS) {
  const entry = manifest.acts.find((a) => a.act === config.id);
  const slug = actSlug(config.id);
  if (!entry) {
    failures.push(`${slug}: not in the manifest`);
    continue;
  }

  // The scrim alpha inside the text band is the heavier of the two middle
  // stops, which is what actually sits over the measure column.
  const scrimAlpha = Math.max(config.scrim[1], config.scrim[2]);

  let worst100 = Infinity;
  let worst400 = Infinity;
  let worstFrame = 0;

  for (let s = 0; s < SAMPLES; s += 1) {
    const index = Math.round((s / (SAMPLES - 1)) * (entry.frameCount - 1));
    const file = join(CINEMA_DIR, slug, 'desktop', frameName(index));

    const image = sharp(file);
    const meta = await image.metadata();
    const width = meta.width ?? 1;
    const height = meta.height ?? 1;

    const region = {
      left: Math.round(TEXT_REGION.left * width),
      top: Math.round(TEXT_REGION.top * height),
      width: Math.max(1, Math.round(TEXT_REGION.width * width)),
      height: Math.max(1, Math.round(TEXT_REGION.height * height)),
    };

    const stats = await sharp(file).extract(region).stats();
    // Worst case is the brightest part of the region, not its mean: a bright
    // filament crossing one line of type is exactly the failure to catch.
    const frameRgb = {
      r: stats.channels[0]?.max ?? 0,
      g: stats.channels[1]?.max ?? 0,
      b: stats.channels[2]?.max ?? 0,
    };

    // Composite in the browser's order: film at intensity over void, scrim over that.
    const withIntensity = over(frameRgb, VOID, config.intensity);
    const withScrim = over(VOID, withIntensity, scrimAlpha);
    const backdrop = luminance(withScrim);

    const c100 = contrast(luminance(INK_100), backdrop);
    const c400 = contrast(luminance(INK_400), backdrop);

    if (c400 < worst400) {
      worst400 = c400;
      worstFrame = index;
    }
    worst100 = Math.min(worst100, c100);
  }

  const pass = worst400 >= MINIMUM && worst100 >= MINIMUM;
  console.log(
    `  ${slug}   ${worst100.toFixed(2).padStart(8)}:1   ${worst400.toFixed(2).padStart(8)}:1   ` +
      `${pass ? 'pass' : `FAIL at frame ${worstFrame}`}`,
  );

  if (!pass) {
    failures.push(
      `${slug}: body copy falls to ${worst400.toFixed(2)}:1 at frame ${worstFrame} ` +
        `(minimum ${MINIMUM}). Darken or regrade the act; do not lighten the text.`,
    );
  }
}

if (failures.length > 0) {
  console.error('\ncontrast-audit: FAILED');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('\ncontrast-audit: ok');
