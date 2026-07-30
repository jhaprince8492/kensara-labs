'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CORE_IDS, NODE_COUNT } from '@/lib/scenes/proofGraph';
import { useSceneArmed } from '@/lib/useSceneArmed';
import { ProofGraphStill } from './ProofGraphStill';

const ProofGraphScene = dynamic(() => import('./ProofGraphScene'), { ssr: false });

const DURATION_MS = 2400;

/**
 * Scene C, mounted.
 *
 * The sequence plays once on its own when the graph comes into view, and then
 * only on request. It is the most persuasive three seconds on the site, and a
 * thing that replays every time you scroll past stops being persuasive by the
 * third viewing.
 */
export function ProofGraph({
  className = '',
  label = 'proof graph',
}: {
  className?: string;
  label?: string;
}) {
  const { tier, live, ref } = useSceneArmed();
  const progress = useRef(0);
  const raf = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [settled, setSettled] = useState(false);
  const played = useRef(false);

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    setPlaying(true);
    setSettled(false);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      progress.current = t;
      if (t < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        setPlaying(false);
        setSettled(true);
      }
    };

    raf.current = requestAnimationFrame(step);
  }, []);

  // Fire once, on arrival.
  useEffect(() => {
    if (!live || played.current) return;
    played.current = true;
    const id = window.setTimeout(run, 260);
    return () => window.clearTimeout(id);
  }, [live, run]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <figure className={className}>
      <div ref={ref} className="relative border border-hairline bg-slate-900">
        <ProofGraphStill
          className={`w-full transition-opacity duration-500 ${live ? 'opacity-0' : 'opacity-100'}`}
        />
        {live ? (
          <div className="absolute inset-0" aria-hidden="true">
            <ProofGraphScene tier={tier === 2 ? 2 : 1} progress={progress} />
          </div>
        ) : null}
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <span className="mono text-14 text-ink-500">
          {settled || !live ? (
            <>
              unsat core{' '}
              <span className="text-proof-ink">
                {CORE_IDS.length} of {NODE_COUNT}
              </span>
              <span className="text-ink-500"> · {CORE_IDS.join(' · ')}</span>
            </>
          ) : (
            <>rule base · {NODE_COUNT} nodes</>
          )}
        </span>

        {live ? (
          <button
            type="button"
            onClick={run}
            disabled={playing}
            className="mono border border-hairline px-3 py-1.5 text-12 text-ink-500 transition-colors duration-[120ms] hover:border-proof hover:text-proof-ink disabled:opacity-40"
          >
            {playing ? 'proving…' : 'Run the minimisation again'}
          </button>
        ) : null}
      </figcaption>

      <p className="sr-only">
        {label}: {NODE_COUNT} rule and fact nodes. When the proof runs, the whole graph
        dims and only the four rules of the unsat core stay illuminated:{' '}
        {CORE_IDS.join(', ')}. Those four rules are the derivation.
      </p>
    </figure>
  );
}
