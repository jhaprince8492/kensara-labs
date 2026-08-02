'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { actConfig, scrimGradient, type ActId } from '@/lib/cinema/acts';
import { acquireAct, releaseAct, type ActLoader } from '@/lib/cinema/frameLoader';
import { actManifest } from '@/lib/cinema/manifest';
import { useCinemaTier } from '@/lib/useRenderTier';

/**
 * One act of the film, behind one existing section.
 *
 * The section's content is passed through untouched as `children`. This
 * component adds three layers and changes nothing else: a canvas at z-0, a
 * graded scrim at z-1, and the existing content at z-2. Copy, markup and the
 * section's own reveal animations are exactly as they were.
 *
 * The canvas is `pointer-events: none`, so every link, button and form control
 * in the section keeps working. It is sticky and pulled behind the content with
 * a negative margin, which pins the film for the section's duration without a
 * scroll-jacking library and without affecting layout.
 */

/** How long the scrub takes to catch the scroll, in seconds. Instant feels
 *  cheap; past a second feels broken. */
const SCRUB_SECONDS = 0.6;
/** Poster holds until the sequence is this far buffered. */
const REVEAL_AT = 0.6;

export interface CinematicActProps {
  act: ActId;
  /** Section progress mapped into a frame range. */
  scrubRange?: [number, number];
  /** Overrides the act's tuned intensity. */
  intensity?: number;
  /** Overrides the act's screen-reader description. Act I passes the existing
   *  Scene A copy, which describes the same image and is reused verbatim. */
  label?: string;
  children: ReactNode;
}

export function CinematicAct({
  act,
  scrubRange = [0, 1],
  intensity,
  label,
  children,
}: CinematicActProps) {
  const config = actConfig(act);
  const entry = actManifest(act);
  const tier = useCinemaTier();

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);

  const filmOpacity = intensity ?? config.intensity;

  // The canvas mounts only on a tier that will actually paint it. On
  // CINEMA_STILL nothing is fetched and no canvas exists in the DOM at all.
  const wantsCanvas =
    entry !== undefined &&
    (tier === 'CINEMA_FULL' || (tier === 'CINEMA_LIGHT' && config.light));

  // Arm when the section is near. Acts I to IV get a longer runway.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || !wantsCanvas) return;

    const runway = act <= 4 ? '150%' : '100%';
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setInView(true);
      },
      { rootMargin: `${runway} 0px ${runway} 0px` },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [act, wantsCanvas]);

  useEffect(() => {
    if (!wantsCanvas || !inView || !entry) return;

    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const variant: 'desktop' | 'mobile' = window.innerWidth < 768 ? 'mobile' : 'desktop';
    const step = tier === 'CINEMA_LIGHT' ? 2 : 1;
    const loader: ActLoader = acquireAct(act, entry, variant, step);

    const stopProgress = loader.onProgress((buffered) => {
      if (buffered >= REVEAL_AT) setRevealed(true);
    });

    // --- scrub state --------------------------------------------------------
    // Declared before `size()` is defined, because `size()` resets `lastIndex`
    // and is called during setup. Declaring it lower down puts it in the
    // temporal dead zone at that call and throws.
    let target = 0;
    let smooth = 0;
    let lastIndex = -1;
    let frame = 0;
    let lastTime = performance.now();
    let running = true;

    // --- sizing -------------------------------------------------------------
    let width = 0;
    let height = 0;
    let resizeTimer = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      lastIndex = -1; // force a repaint at the new size
    };

    // Debounced, and never bound to `resize` directly: mobile browsers fire it
    // on every address-bar movement.
    const observer = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(size, 120);
    });
    observer.observe(canvas);
    size();

    // --- scrub --------------------------------------------------------------
    const measure = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const scrolled = window.scrollY;
      const top = rect.top + scrolled;

      // `enter` is clamped at zero so a section sitting at the top of the
      // document starts its act at frame zero rather than halfway through: you
      // cannot scroll above the fold to give the hero its run-up.
      const enter = Math.max(0, top - vh);
      const exit = top + rect.height;
      const span = Math.max(1, exit - enter);

      const raw = (scrolled - enter) / span;
      const clamped = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      const [from, to] = scrubRange;
      target = from + clamped * (to - from);
    };

    /** Manual cover fit. CSS object-fit does not apply to canvas content. */
    const drawCover = (bitmap: ImageBitmap) => {
      const scale = Math.max(width / bitmap.width, height / bitmap.height);
      const dw = bitmap.width * scale;
      const dh = bitmap.height * scale;
      context.drawImage(bitmap, (width - dw) / 2, (height - dh) / 2, dw, dh);
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      measure();
      // Critically damped follow. Same weight as a 0.6s scrub, without pulling
      // a scroll library into the bundle for one easing curve.
      smooth += (target - smooth) * (1 - Math.exp(-dt / (SCRUB_SECONDS / 3)));

      const index = Math.min(
        entry.frameCount - 1,
        Math.max(0, Math.round(smooth * (entry.frameCount - 1))),
      );

      // Repainting an identical frame at 120Hz is the single biggest cause of
      // jank in this pattern. Skip the draw when nothing changed.
      if (index !== lastIndex) {
        const bitmap = loader.frameAt(index);
        if (bitmap) {
          try {
            drawCover(bitmap);
            lastIndex = index;
          } catch {
            // A bitmap closed by eviction between lookup and draw throws
            // InvalidStateError. The poster is still underneath, so the right
            // response is to skip this frame, not to take the page down.
          }
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      observer.disconnect();
      stopProgress();
      releaseAct(act);
    };
  }, [act, entry, inView, scrubRange, tier, wantsCanvas]);

  return (
    <div ref={rootRef} className="relative isolate">
      {/* the film: sticky, pulled behind the content, never interactive */}
      <div
        className="film-layer pointer-events-none sticky top-0 z-0 overflow-hidden"
        role="img"
        aria-label={label ?? config.label}
      >
        {entry ? (
          <>
            {/* The poster is the loading state. There is no spinner anywhere. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.poster}
              alt=""
              aria-hidden="true"
              fetchPriority={act === 1 ? 'high' : 'auto'}
              loading={act === 1 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: filmOpacity }}
            />
            {wantsCanvas ? (
              <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full transition-opacity duration-500"
                style={{ opacity: revealed ? filmOpacity : 0 }}
              />
            ) : null}
          </>
        ) : null}

        {/* graded scrim: the darkest band sits under the text column */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: scrimGradient(config.scrim) }}
        />
      </div>

      {/* the existing section, unchanged */}
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
