'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useRenderTier } from '@/lib/useRenderTier';
import { StateSpaceStill } from './StateSpaceStill';

/**
 * Capability gate for Scene A.
 *
 * The still is always in the markup: it paints with the page, carries the LCP,
 * and is the whole scene on tier 3. `three` is behind a dynamic import that is
 * requested only after the browser is idle and only when the tier check passes,
 * so it is absent from the initial bundle and never competes with first paint.
 */

const StateSpaceScene = dynamic(() => import('./StateSpaceScene'), { ssr: false });

export function StateSpace({ className = '' }: { className?: string }) {
  const { tier } = useRenderTier();
  const [armed, setArmed] = useState(false);
  const progress = useRef(0);

  // Wait for idle before pulling three onto the wire.
  useEffect(() => {
    if (tier === null || tier === 3) return;

    let cancelled = false;
    const arm = () => {
      if (!cancelled) setArmed(true);
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(arm, { timeout: 2500 })
      : window.setTimeout(arm, 1200);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && typeof idle === 'number') {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle as number);
      }
    };
  }, [tier]);

  // Scroll progress for the camera push. Read in rAF, written to a ref, so no
  // React render is tied to scroll and no text ever moves with parallax.
  useEffect(() => {
    if (!armed) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const height = window.innerHeight || 1;
      progress.current = Math.min(1, Math.max(0, window.scrollY / height));
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
    // The cloud sits to the right of the measure so the headline never has to
    // compete with it. On narrow screens it spans the hero and the scrim carries
    // the contrast instead.
    <div
      className={`pointer-events-none absolute inset-y-0 right-0 left-0 lg:left-[34%] ${className}`}
      aria-hidden="true"
    >
      <StateSpaceStill
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          live ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {live ? (
        <div className="absolute inset-0">
          <StateSpaceScene tier={tier === 2 ? 2 : 1} progress={progress} />
        </div>
      ) : null}

      {/* Scrim. The cloud is the argument, but the headline has to be readable
          against it: body text on this ground must clear 4.5:1. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, var(--void) 0%, rgba(5,7,11,0.72) 26%, rgba(5,7,11,0.18) 58%, rgba(5,7,11,0) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(180deg, transparent, var(--void))' }}
      />
    </div>
  );
}
