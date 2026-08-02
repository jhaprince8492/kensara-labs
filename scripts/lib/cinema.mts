/**
 * Shared cinema constants and helpers.
 *
 * The budgets here are build-breaking. They are not negotiated down to make the
 * film look better: a verification company shipping a page that stutters has
 * disproved itself in the first three seconds.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { ACTS, actSlug, type ActId } from '../../lib/cinema/acts.ts';

export { ACTS, actSlug };
export type { ActId };

export const CINEMA_DIR = join(process.cwd(), 'public', 'cinema');
export const MANIFEST_PATH = join(CINEMA_DIR, 'manifest.json');

export const BUDGET = {
  /** Source footage is 1280x720. Upscaling to 1600 buys nothing and costs
   *  bytes, so desktop frames are native width. */
  desktopWidth: 1280,
  mobileWidth: 900,
  /** Average bytes per frame, desktop. */
  avgFrameBytes: 24 * 1024,
  perActDesktop: 1.3 * 1024 * 1024,
  perActMobile: 600 * 1024,
  totalDesktop: 7 * 1024 * 1024,
  totalMobile: 3.2 * 1024 * 1024,
  postersTotal: 320 * 1024,
  /** Act I poster plus its first eight frames. */
  aboveTheFold: 420 * 1024,
  /** The film must sit in the lower third of the luminance range. */
  meanLuminanceCeiling: 0.34,
} as const;

export interface ActVariantRecord {
  path: string;
  bytes: number;
  width: number;
}

export interface ActRecord {
  act: number;
  frameCount: number;
  poster: string;
  posterBytes: number;
  desktop: ActVariantRecord;
  mobile: ActVariantRecord;
  meanLuminance: number;
  textColumnPeakLuminance: number;
  scrim: number[];
  placeholder: boolean;
}

export interface Manifest {
  version: number;
  generatedAt: string;
  acts: ActRecord[];
}

export function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

export function mb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

/**
 * Mean relative luminance of a buffer, 0 to 1, and the peak luminance inside
 * the text column. The text column is the left 62% of the frame on desktop,
 * which is where the measure sits on every section of the home page.
 */
export async function measureLuminance(input: Buffer | string) {
  const image = sharp(input);
  const meta = await image.metadata();
  const width = meta.width ?? 1;

  const full = await sharp(input).greyscale().stats();
  const mean = (full.channels[0]?.mean ?? 0) / 255;

  const columnWidth = Math.max(1, Math.round(width * 0.62));
  const column = await sharp(input)
    .extract({ left: 0, top: 0, width: columnWidth, height: meta.height ?? 1 })
    .greyscale()
    .stats();
  const peak = (column.channels[0]?.max ?? 0) / 255;

  return { mean, peak };
}

export async function readManifest(): Promise<Manifest> {
  if (!existsSync(MANIFEST_PATH)) {
    return { version: 1, generatedAt: new Date(0).toISOString(), acts: [] };
  }
  return JSON.parse(await readFile(MANIFEST_PATH, 'utf8')) as Manifest;
}

/** Merge one act into the manifest without disturbing the others. */
export async function upsertAct(record: ActRecord): Promise<Manifest> {
  const current = await readManifest();
  const acts = current.acts.filter((entry) => entry.act !== record.act);
  acts.push(record);
  acts.sort((a, b) => a.act - b.act);

  const next: Manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    acts,
  };

  await mkdir(CINEMA_DIR, { recursive: true });
  await writeFile(MANIFEST_PATH, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return next;
}

export function frameName(index: number): string {
  return `${String(index).padStart(4, '0')}.avif`;
}
