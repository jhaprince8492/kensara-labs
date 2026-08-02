'use client';

import type { ActId } from './acts';
import { frameUrl, type ActManifest } from './manifest';

/**
 * Frame fetching and decoding.
 *
 * Two decisions carry this file.
 *
 * Frames are decoded with `createImageBitmap`, which does the work off the main
 * thread and hands back something the canvas can draw without a further decode.
 * Decoding an <img> during a scroll frame is the difference between a scrub
 * that feels like a transport control and one that feels broken.
 *
 * Frames are fetched sparse-first: every eighth, then every fourth, then the
 * rest. A quarter-buffered act can already be scrubbed across its whole length
 * at reduced temporal resolution, so the film resolves in place rather than
 * filling in from the left.
 *
 * At most three acts stay decoded. The furthest from the reader is evicted and
 * its bitmaps are closed, because ImageBitmap holds real memory and a page that
 * grows without bound on a corporate laptop is the failure this whole feature
 * has to avoid.
 */

const MAX_DECODED_ACTS = 3;

export interface ActLoader {
  readonly act: ActId;
  /** The nearest decoded frame at or before `index`, or null if none yet. */
  frameAt(index: number): ImageBitmap | null;
  /** 0 to 1. */
  readonly buffered: number;
  onProgress(listener: (buffered: number) => void): () => void;
  dispose(): void;
}

/** Sparse-first ordering: uniform coverage early, detail later. */
function fetchOrder(count: number): number[] {
  const seen = new Set<number>();
  const order: number[] = [];

  for (const stride of [8, 4, 2, 1]) {
    for (let i = 0; i < count; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }

  // The last frame matters: it is what the reader parks on leaving the section.
  if (!seen.has(count - 1) && count > 0) order.push(count - 1);
  return order;
}

function createLoader(
  act: ActId,
  entry: ActManifest,
  variant: 'desktop' | 'mobile',
  /** Fetch every nth frame only. CINEMA_LIGHT halves the work. */
  step: number,
): ActLoader {
  const bitmaps = new Map<number, ImageBitmap>();
  const controller = new AbortController();
  const listeners = new Set<(buffered: number) => void>();

  const wanted = fetchOrder(entry.frameCount).filter((index) => index % step === 0);
  let loaded = 0;
  let disposed = false;

  const emit = () => {
    const value = wanted.length === 0 ? 1 : loaded / wanted.length;
    for (const listener of listeners) listener(value);
  };

  const run = async () => {
    // Small concurrency: enough to saturate a 4g connection, few enough that a
    // throttled one still gets early frames rather than eight stalled requests.
    const queue = [...wanted];
    const workers = Array.from({ length: 4 }, async () => {
      while (queue.length > 0 && !disposed) {
        const index = queue.shift();
        if (index === undefined) return;
        try {
          const response = await fetch(frameUrl(entry, variant, index), {
            signal: controller.signal,
            cache: 'force-cache',
          });
          if (!response.ok) continue;
          const bitmap = await createImageBitmap(await response.blob());
          if (disposed) {
            bitmap.close();
            return;
          }
          bitmaps.set(index, bitmap);
        } catch {
          // An aborted or failed frame is not fatal: the scrub falls back to
          // the nearest neighbour and the poster is still underneath.
        } finally {
          loaded += 1;
          emit();
        }
      }
    });

    await Promise.all(workers);
  };

  void run();

  return {
    act,
    frameAt(index: number) {
      const exact = bitmaps.get(index);
      if (exact) return exact;

      // Walk outward for the nearest decoded neighbour so a partially
      // buffered act still scrubs across its whole length.
      for (let radius = 1; radius <= entry.frameCount; radius += 1) {
        const before = bitmaps.get(index - radius);
        if (before) return before;
        const after = bitmaps.get(index + radius);
        if (after) return after;
      }
      return null;
    },
    get buffered() {
      return wanted.length === 0 ? 1 : loaded / wanted.length;
    },
    onProgress(listener) {
      listeners.add(listener);
      listener(this.buffered);
      return () => listeners.delete(listener);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      controller.abort();
      for (const bitmap of bitmaps.values()) bitmap.close();
      bitmaps.clear();
      listeners.clear();
    },
  };
}

// --- the pool ---------------------------------------------------------------

const pool = new Map<ActId, { loader: ActLoader; refs: number }>();
/** Most recently requested first. Used to decide what to evict. */
let recency: ActId[] = [];

function evictBeyondLimit() {
  const evictable = recency.filter((id) => (pool.get(id)?.refs ?? 0) === 0);
  const keep = new Set(recency.slice(0, MAX_DECODED_ACTS));

  for (const id of evictable) {
    if (keep.has(id)) continue;
    const held = pool.get(id);
    if (!held) continue;
    held.loader.dispose();
    pool.delete(id);
    recency = recency.filter((entry) => entry !== id);
  }
}

export function acquireAct(
  act: ActId,
  entry: ActManifest,
  variant: 'desktop' | 'mobile',
  step: number,
): ActLoader {
  recency = [act, ...recency.filter((id) => id !== act)];

  const held = pool.get(act);
  if (held) {
    held.refs += 1;
    evictBeyondLimit();
    return held.loader;
  }

  const loader = createLoader(act, entry, variant, step);
  pool.set(act, { loader, refs: 1 });
  evictBeyondLimit();
  return loader;
}

export function releaseAct(act: ActId) {
  const held = pool.get(act);
  if (!held) return;
  held.refs = Math.max(0, held.refs - 1);
  evictBeyondLimit();
}
