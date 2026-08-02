'use client';

import { useEffect, useState } from 'react';

export type RenderTier = 1 | 2 | 3;

export interface RenderTierState {
  /** null until the capability check has run on the client. */
  tier: RenderTier | null;
  reducedMotion: boolean;
}

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|headlesschrome|lighthouse|pagespeed|gtmetrix/i;

function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

function hasWebGL1(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl') ??
        (canvas.getContext('experimental-webgl') as RenderingContext | null),
    );
  } catch {
    return false;
  }
}

function saveDataEnabled(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike })
    .connection;
  return connection?.saveData === true;
}

function detect(reducedMotion: boolean): RenderTier {
  // Tier 3 conditions are disqualifying: nothing below them earns a canvas.
  if (reducedMotion) return 3;
  if (saveDataEnabled()) return 3;
  if (BOT_PATTERN.test(navigator.userAgent)) return 3;

  const webgl2 = hasWebGL2();
  if (!webgl2 && !hasWebGL1()) return 3;

  const cores = navigator.hardwareConcurrency ?? 2;
  if (!webgl2) return 2;
  if (cores < 4) return 2;

  return 1;
}

/**
 * Capability tier for the 3D scenes.
 *
 *   TIER 1  WebGL2, 4+ logical cores, no save-data, no reduced-motion
 *           full scene, 60fps, DPR capped at 1.5
 *   TIER 2  WebGL1 only, or fewer than 4 cores, or battery saver
 *           reduced geometry, no post-processing, 30fps cap
 *   TIER 3  no WebGL, reduced-motion, save-data, or a crawler
 *           the pre-rendered still, same composition, copy unchanged
 *
 * Returns `null` for tier during server render and the first client paint, so
 * nothing WebGL-shaped is ever requested before the check has run.
 */
export function useRenderTier(): RenderTierState {
  const [state, setState] = useState<RenderTierState>({
    tier: null,
    reducedMotion: false,
  });

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    const apply = () => {
      const reducedMotion = query.matches;
      setState({ tier: detect(reducedMotion), reducedMotion });
    };

    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return state;
}

// ---------------------------------------------------------------------------
// Cinema tiers
// ---------------------------------------------------------------------------

export type CinemaTier = 'CINEMA_FULL' | 'CINEMA_LIGHT' | 'CINEMA_STILL';

function hasCanvas2D(): boolean {
  try {
    return Boolean(document.createElement('canvas').getContext('2d'));
  } catch {
    return false;
  }
}

function detectCinema(reducedMotion: boolean): CinemaTier {
  // Disqualifying conditions first. CINEMA_STILL is a first-class experience,
  // not a degraded one: identical copy, identical layout, composed posters.
  if (reducedMotion) return 'CINEMA_STILL';
  if (saveDataEnabled()) return 'CINEMA_STILL';
  if (BOT_PATTERN.test(navigator.userAgent)) return 'CINEMA_STILL';
  if (typeof createImageBitmap !== 'function') return 'CINEMA_STILL';
  if (!hasCanvas2D()) return 'CINEMA_STILL';

  const cores = navigator.hardwareConcurrency ?? 2;
  if (cores < 2) return 'CINEMA_STILL';

  const connection = (navigator as Navigator & { connection?: NetworkInformationLike })
    .connection;
  const effective = connection?.effectiveType;
  if (effective === 'slow-2g' || effective === '2g') return 'CINEMA_STILL';
  if (effective === '3g') return 'CINEMA_LIGHT';

  if (cores < 4) return 'CINEMA_LIGHT';

  return 'CINEMA_FULL';
}

/**
 * Cinema tier, decided once on mount and never revisited.
 *
 * A layout that reflows because the connection improved mid-read is worse than
 * either state, so this deliberately does not subscribe to connection changes.
 * Returns null until the check has run, so nothing canvas-shaped is requested
 * during server render or first paint.
 */
export function useCinemaTier(): CinemaTier | null {
  const [tier, setTier] = useState<CinemaTier | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTier(detectCinema(reduced));
    // Deliberately no listener: the tier is fixed for the session.
  }, []);

  return tier;
}

/** Reduced-motion alone, for components that have no 3D but do have reveals. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return reduced;
}
