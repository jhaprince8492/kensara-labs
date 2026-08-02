import manifestJson from '@/public/cinema/manifest.json';
import type { ActId } from './acts';

/**
 * The manifest is written by the ingest script and read at build time. It is
 * the single source of truth for how many frames actually exist, what they
 * weigh, and how bright they are, so the component never assumes and the
 * budget check never guesses.
 */

export interface ActVariant {
  path: string;
  bytes: number;
  width: number;
}

export interface ActManifest {
  act: number;
  frameCount: number;
  poster: string;
  posterBytes: number;
  desktop: ActVariant;
  mobile: ActVariant;
  /** Mean luminance across all frames, 0 to 1. Must sit in the lower third. */
  meanLuminance: number;
  /** Peak luminance measured inside the text column region. */
  textColumnPeakLuminance: number;
  scrim: number[];
  /** True while this act is a procedurally generated stand-in. */
  placeholder: boolean;
}

export interface CinemaManifest {
  version: number;
  generatedAt: string;
  acts: ActManifest[];
}

export const manifest = manifestJson as CinemaManifest;

export function actManifest(id: ActId): ActManifest | undefined {
  return manifest.acts.find((entry) => entry.act === id);
}

/** Zero-padded frame URL for a given variant. */
export function frameUrl(entry: ActManifest, variant: 'desktop' | 'mobile', index: number) {
  return `${entry[variant].path}/${String(index).padStart(4, '0')}.avif`;
}
