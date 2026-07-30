'use client';

import { useState } from 'react';
import { Eyebrow } from '@/components/primitives/Eyebrow';

export interface PipelineStage {
  /** Numbering is used here and only here: these stages are genuinely ordered. */
  name: string;
  does: string;
  emits: string;
  /** One worked line from a real example. */
  worked: string;
}

export function PipelineStrip({
  stages,
  accent = 'proof',
}: {
  stages: readonly PipelineStage[];
  accent?: 'proof' | 'gate';
}) {
  const [open, setOpen] = useState<number | null>(0);
  const accentClass = accent === 'proof' ? 'text-proof-ink' : 'text-gate';

  return (
    <ol className="border-t border-hairline">
      {stages.map((stage, index) => {
        const expanded = open === index;
        return (
          <li key={stage.name} className="border-b border-hairline">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : index)}
                aria-expanded={expanded}
                className="group flex w-full items-baseline gap-5 py-4 text-left transition-colors duration-[120ms]"
              >
                <span className={`mono shrink-0 text-14 ${accentClass}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-17 text-ink-100 group-hover:text-ink-100">
                  {stage.name}
                </span>
                <span className="mono shrink-0 text-12 text-ink-500">
                  {expanded ? '–' : '+'}
                </span>
              </button>
            </h3>

            {expanded ? (
              <div className="grid gap-5 pb-6 pl-10 md:grid-cols-3">
                <div>
                  <Eyebrow>WHAT IT DOES</Eyebrow>
                  <p className="mt-2 text-14 text-ink-400">{stage.does}</p>
                </div>
                <div>
                  <Eyebrow>WHAT IT EMITS</Eyebrow>
                  <p className="mono mt-2 text-14 text-ink-400">{stage.emits}</p>
                </div>
                <div>
                  <Eyebrow>WORKED LINE</Eyebrow>
                  <p className="mono mt-2 text-14 text-ink-100">{stage.worked}</p>
                </div>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
