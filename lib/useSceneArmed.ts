'use client';

import { useEffect, useRef, useState } from 'react';
import { useRenderTier, type RenderTier } from './useRenderTier';

export interface SceneArmed {
  tier: RenderTier | null;
  /** True once the live scene may mount: capable tier, in view, browser idle. */
  live: boolean;
  /** Attach to the scene container so it only arms when it is on screen. */
  ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * Shared capability gate for the three scenes.
 *
 * `three` is behind a dynamic import in each scene, and this hook decides when
 * that import is allowed to happen: never on tier 3, never before the element
 * is near the viewport, and never before the browser is idle. The composed
 * still is in the markup the whole time, so nothing here is on the path to
 * first paint.
 */
export function useSceneArmed(): SceneArmed {
  const { tier } = useRenderTier();
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || tier === null || tier === 3) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [tier]);

  useEffect(() => {
    if (!inView) return;

    let cancelled = false;
    const arm = () => {
      if (!cancelled) setIdle(true);
    };

    const handle = window.requestIdleCallback
      ? window.requestIdleCallback(arm, { timeout: 2000 })
      : window.setTimeout(arm, 900);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && typeof handle === 'number') {
        window.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle as number);
      }
    };
  }, [inView]);

  return { tier, live: idle && tier !== null && tier !== 3, ref };
}
