/**
 * Cinema asset budget. Build-breaking.
 *
 * These numbers are the entire reason the feature is allowed to exist. They do
 * not move to accommodate a nicer-looking act.
 */

import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ACTS, BUDGET, CINEMA_DIR, actSlug, kb, mb, readManifest } from './lib/cinema.mts';

const failures: string[] = [];
const notes: string[] = [];

const manifest = await readManifest();

if (manifest.acts.length !== ACTS.length) {
  failures.push(
    `manifest lists ${manifest.acts.length} acts, expected ${ACTS.length}. Run gen-placeholders or ingest-act.`,
  );
}

let totalDesktop = 0;
let totalMobile = 0;
let totalPosters = 0;
let placeholders = 0;

for (const config of ACTS) {
  const entry = manifest.acts.find((a) => a.act === config.id);
  const slug = actSlug(config.id);

  if (!entry) {
    failures.push(`${slug}: missing from the manifest`);
    continue;
  }

  if (entry.placeholder) placeholders += 1;

  if (entry.frameCount !== config.frames) {
    failures.push(
      `${slug}: manifest says ${entry.frameCount} frames, the act is configured for ${config.frames}`,
    );
  }

  // Every frame the component may ask for must actually exist on disk.
  for (const variant of ['desktop', 'mobile'] as const) {
    const dir = join(CINEMA_DIR, slug, variant);
    if (!existsSync(dir)) {
      failures.push(`${slug}: ${variant} directory is missing`);
      continue;
    }
    const files = (await readdir(dir)).filter((f) => f.endsWith('.avif'));
    if (files.length !== entry.frameCount) {
      failures.push(
        `${slug}: ${variant} has ${files.length} frames, the manifest claims ${entry.frameCount}`,
      );
    }
  }

  if (!existsSync(join(CINEMA_DIR, slug, 'poster.avif'))) {
    failures.push(`${slug}: poster.avif is missing. The poster is the loading state.`);
  }

  totalDesktop += entry.desktop.bytes;
  totalMobile += entry.mobile.bytes;
  totalPosters += entry.posterBytes;

  if (entry.desktop.bytes > BUDGET.perActDesktop) {
    failures.push(
      `${slug}: desktop sequence ${mb(entry.desktop.bytes)} exceeds ${mb(BUDGET.perActDesktop)}. Reduce frame count before reducing quality.`,
    );
  }
  if (entry.mobile.bytes > BUDGET.perActMobile) {
    failures.push(
      `${slug}: mobile sequence ${kb(entry.mobile.bytes)} exceeds ${kb(BUDGET.perActMobile)}`,
    );
  }

  const avg = entry.desktop.bytes / Math.max(1, entry.frameCount);
  if (avg > BUDGET.avgFrameBytes) {
    failures.push(
      `${slug}: average frame ${kb(avg)} exceeds ${kb(BUDGET.avgFrameBytes)}`,
    );
  }

  if (entry.meanLuminance > BUDGET.meanLuminanceCeiling) {
    failures.push(
      `${slug}: mean luminance ${entry.meanLuminance.toFixed(3)} exceeds ${BUDGET.meanLuminanceCeiling}. ` +
        'Regrade the footage rather than thickening the scrim.',
    );
  }

  notes.push(
    `  ${slug}  ${String(entry.frameCount).padStart(2)}f  ` +
      `desktop ${kb(entry.desktop.bytes).padStart(9)} (avg ${kb(avg).padStart(7)})  ` +
      `mobile ${kb(entry.mobile.bytes).padStart(9)}  ` +
      `lum ${entry.meanLuminance.toFixed(3)}` +
      (entry.placeholder ? '  [placeholder]' : ''),
  );
}

// Above the fold: Act I's poster plus the first eight frames it preloads.
const act1 = manifest.acts.find((a) => a.act === 1);
if (act1) {
  let aboveFold = act1.posterBytes;
  for (let i = 0; i < 8; i += 1) {
    const path = join(CINEMA_DIR, 'act01', 'desktop', `${String(i).padStart(4, '0')}.avif`);
    if (existsSync(path)) aboveFold += (await stat(path)).size;
  }
  notes.push(`  above the fold (act01 poster + 8 frames)  ${kb(aboveFold)}`);
  if (aboveFold > BUDGET.aboveTheFold) {
    failures.push(
      `above the fold ${kb(aboveFold)} exceeds ${kb(BUDGET.aboveTheFold)}. This is the LCP budget.`,
    );
  }
}

notes.push(
  `  total  desktop ${mb(totalDesktop)} / ${mb(BUDGET.totalDesktop)}  ` +
    `mobile ${mb(totalMobile)} / ${mb(BUDGET.totalMobile)}  ` +
    `posters ${kb(totalPosters)} / ${kb(BUDGET.postersTotal)}`,
);

if (totalDesktop > BUDGET.totalDesktop) {
  failures.push(`total desktop ${mb(totalDesktop)} exceeds ${mb(BUDGET.totalDesktop)}`);
}
if (totalMobile > BUDGET.totalMobile) {
  failures.push(`total mobile ${mb(totalMobile)} exceeds ${mb(BUDGET.totalMobile)}`);
}
if (totalPosters > BUDGET.postersTotal) {
  failures.push(`posters ${kb(totalPosters)} exceed ${kb(BUDGET.postersTotal)}`);
}

for (const note of notes) console.log(note);

if (placeholders > 0) {
  console.log(
    `\n  note: ${placeholders} of ${ACTS.length} acts are placeholders. Placeholder frames are` +
      '\n  flat vector art and compress roughly two orders of magnitude smaller than graded' +
      '\n  footage. These totals only become meaningful once real acts are ingested.',
  );
}

if (failures.length > 0) {
  console.error('\ncheck-cinema-budget: FAILED');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('\ncheck-cinema-budget: ok');
