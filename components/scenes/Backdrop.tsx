'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useRenderTier } from '@/lib/useRenderTier';
import { BackdropStill } from './BackdropStill';

const BackdropScene = dynamic(() => import('./BackdropScene'), { ssr: false });

/**
 * The fixed page backdrop.
 *
 * The still is always in the markup, paints with the page and is the whole
 * backdrop on tier 3. `three` is behind a dynamic import requested only once
 * the browser is idle and only when the capability check passes, so it stays
 * out of the initial bundle and never competes with first paint.
 *
 * Scroll is read in a rAF and written to a ref. No React render is tied to
 * scroll position, and nothing in the content layer moves with it: the rule
 * against parallax on text still holds, because the text does not move at all.
 */
export function Backdrop() {
  const { tier } = useRenderTier();
  const [armed, setArmed] = useState(false);
  /** Fraction of the whole document. Drives the shard assembly. */
  const scroll = useRef(0);
  /** Fraction of the first viewport. Drives the hero camera push. */
  const hero = useRef(0);

  useEffect(() => {
    if (tier === null || tier === 3) return;

    let cancelled = false;
    const arm = () => {
      if (!cancelled) setArmed(true);
    };

    const handle = window.requestIdleCallback
      ? window.requestIdleCallback(arm, { timeout: 2500 })
      : window.setTimeout(arm, 1200);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && typeof handle === 'number') {
        window.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle as number);
      }
    };
  }, [tier]);

  useEffect(() => {
    if (!armed) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const doc = document.documentElement;
      const viewport = window.innerHeight || 1;
      const range = doc.scrollHeight - viewport;
      scroll.current = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      hero.current = Math.min(1, Math.max(0, window.scrollY / viewport));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [armed]);

  const live = armed && tier !== null && tier !== 3;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <BackdropStill
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          live ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {live ? (
        <div className="absolute inset-0">
          <BackdropScene tier={tier === 2 ? 2 : 1} scroll={scroll} hero={hero} />
        </div>
      ) : null}

      {/* Legibility, in two layers rather than one flat veil.
          The measure sits in the left half, so that band stays near solid and
          the right falls to a partial veil rather than clearing entirely.
          Left-aligned copy in the right column, the matrix header and the
          engine panels among it, sits directly over that zone, and body text
          clearing 4.5:1 is a functional requirement rather than a preference.
          The metal reads through it because the environment map gives it
          specular range, not because the ground was made transparent. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, var(--void) 0%, rgba(5,7,11,0.95) 34%, rgba(5,7,11,0.78) 55%, rgba(5,7,11,0.6) 78%, rgba(5,7,11,0.52) 100%)',
        }}
      />
      {/* Vignette. Holds the eye centre-right and stops the star bed reaching
          the corners, where it reads as noise. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 105% at 68% 48%, transparent 0%, transparent 40%, rgba(5,7,11,0.55) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{ background: 'linear-gradient(180deg, var(--void), transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{ background: 'linear-gradient(0deg, var(--void), transparent)' }}
      />
    </div>
  );
}
