'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { GATE_SCENARIOS } from '@/lib/scenes/gate';
import { useSceneArmed } from '@/lib/useSceneArmed';
import { VerdictChip } from '@/components/primitives/VerdictChip';
import { GateStill } from './GateStill';

const GateScene = dynamic(() => import('./GateScene'), { ssr: false });

/**
 * Scene B, mounted. The readout under the corridor names the action, the pack
 * and the deciding rule for whichever scenario is on screen, so the motion is
 * never decorative: it is always showing a specific decision.
 */
export function Gate({ className = '' }: { className?: string }) {
  const { tier, live, ref } = useSceneArmed();
  const [index, setIndex] = useState(0);

  const onScenario = useCallback((next: number) => setIndex(next), []);
  const scenario = GATE_SCENARIOS[index] ?? GATE_SCENARIOS[0]!;

  return (
    <figure className={className}>
      <div ref={ref} className="relative border border-hairline bg-slate-900">
        <GateStill
          className={`w-full transition-opacity duration-500 ${live ? 'opacity-0' : 'opacity-100'}`}
        />
        {live ? (
          <div className="absolute inset-0" aria-hidden="true">
            <GateScene tier={tier === 2 ? 2 : 1} onScenario={onScenario} />
          </div>
        ) : null}
      </div>

      {live ? (
        <figcaption className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline pt-4">
          <VerdictChip verdict={scenario.outcome} />
          <span className="mono text-14 text-ink-100">{scenario.action}</span>
          <span className="mono text-14 text-ink-500">{scenario.pack}</span>
          <span className="mono text-14 text-ink-500">{scenario.rule}</span>
          <span className="mono ml-auto text-14 text-ink-500">{scenario.latency}</span>
          <span className="mono w-full text-12 text-ink-500">{scenario.note}</span>
        </figcaption>
      ) : (
        <figcaption className="mt-4 border-t border-hairline pt-4">
          <span className="mono text-12 text-ink-500">
            three seeded scenarios · the corridor has no path that misses the plane
          </span>
        </figcaption>
      )}
    </figure>
  );
}
