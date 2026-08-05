'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_DESIGN,
  PROPERTIES,
  check,
  formatState,
  type Design,
  type PropertyId,
  type SandboxResult,
} from '@/lib/sandbox/machine';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { VerdictChip } from '@/components/primitives/VerdictChip';

/**
 * The Formus half of the sandbox.
 *
 * A real exhaustive check, not a recording. The visitor changes the design,
 * picks a requirement, and the whole reachable state space is enumerated in
 * the browser. Where the property fails, the counter-example is the shortest
 * sequence of events that gets there, computed rather than authored.
 */

const TOGGLES: { key: keyof Design; label: string; detail: string }[] = [
  {
    key: 'sensorsRecover',
    label: 'A failed sensor can come back online',
    detail: 'transient faults clear on their own',
  },
  {
    key: 'recoveryFromLockout',
    label: 'Lockout has an exit',
    detail: 'the controller can leave lockout once both sensors are healthy',
  },
  {
    key: 'lockoutRequiresBoth',
    label: 'Lockout needs both sensors down',
    detail: 'off means a single sensor failure is enough to lock out',
  },
];

const STATUS_TONE = {
  IMPLEMENTED: 'text-proof-ink',
  VIOLATED: 'text-refute',
  VACUOUS: 'text-hold',
} as const;

export function FormusSandbox() {
  const [design, setDesign] = useState<Design>(DEFAULT_DESIGN);
  const [property, setProperty] = useState<PropertyId>('recoverable');
  const [result, setResult] = useState<SandboxResult | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const first = useRef(true);

  const run = useCallback(
    (nextDesign: Design, nextProperty: PropertyId, announce: boolean) => {
      const outcome = check(nextProperty, nextDesign);
      setResult(outcome);
      if (announce) {
        setAnnouncement(
          `${outcome.status}. ${outcome.reason}. ${outcome.statesExplored} states explored, ${outcome.mutation.killed} of ${outcome.mutation.total} seeded faults caught.`,
        );
      }
    },
    [],
  );

  // Land on a result rather than an empty panel.
  useEffect(() => {
    if (!first.current) return;
    first.current = false;
    run(DEFAULT_DESIGN, 'recoverable', false);
  }, [run]);

  const update = (next: Partial<Design>) => {
    const merged = { ...design, ...next };
    setDesign(merged);
    run(merged, property, true);
  };

  const changeProperty = (next: PropertyId) => {
    setProperty(next);
    run(design, next, true);
  };

  const spec = PROPERTIES.find((p) => p.id === property) ?? PROPERTIES[0]!;

  return (
    <div className="border border-hairline bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <Eyebrow as="span">FORMUS · EXHAUSTIVE CHECK · IN THIS BROWSER</Eyebrow>
        <span className="mono text-12 text-ink-500">controller model · 3 design decisions</span>
      </div>

      <div className="grid gap-px bg-hairline lg:grid-cols-[minmax(0,26rem)_1fr]">
        {/* ------------------------------------------------ the design */}
        <div className="space-y-6 bg-slate-900 p-5 sm:p-7">
          <fieldset>
            <legend className="eyebrow mb-3">THE REQUIREMENT</legend>
            <div className="space-y-px border border-hairline bg-hairline">
              {PROPERTIES.map((option) => {
                const checked = option.id === property;
                return (
                  <label
                    key={option.id}
                    className={`block cursor-pointer p-3 transition-colors duration-[120ms] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-2px] has-[:focus-visible]:outline-proof ${
                      checked ? 'bg-slate-800' : 'bg-slate-900 hover:bg-slate-800/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sandbox-property"
                      value={option.id}
                      checked={checked}
                      onChange={() => changeProperty(option.id)}
                      className="sr-only"
                    />
                    <span className="mono block text-12 text-ink-500">{option.ref}</span>
                    <span
                      className={`mt-1.5 block text-14 ${checked ? 'text-ink-100' : 'text-ink-400'}`}
                    >
                      {option.requirement}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-3">THE DESIGN</legend>
            <div className="space-y-px border border-hairline bg-hairline">
              {TOGGLES.map((toggle) => {
                const on = design[toggle.key];
                return (
                  <label
                    key={toggle.key}
                    className="flex cursor-pointer items-start gap-3 bg-slate-900 p-3 transition-colors duration-[120ms] hover:bg-slate-800/60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-2px] has-[:focus-visible]:outline-proof"
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => update({ [toggle.key]: !on } as Partial<Design>)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`mono mt-0.5 shrink-0 border px-1.5 py-0.5 text-12 ${
                        on
                          ? 'border-proof/50 bg-proof/10 text-proof-ink'
                          : 'border-hairline text-ink-500'
                      }`}
                    >
                      {on ? 'ON ' : 'OFF'}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-14 text-ink-100">{toggle.label}</span>
                      <span className="mono mt-1 block text-12 text-ink-500">{toggle.detail}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <p className="mono text-12 text-ink-500">
            every change re-checks the whole reachable space · no sampling
          </p>
        </div>

        {/* ------------------------------------------------ the result */}
        <div className="bg-slate-900 p-5 sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Eyebrow as="span">RESULT</Eyebrow>
            {result ? (
              <span className="mono text-12 text-ink-500">
                {result.statesExplored} of {result.statesExplored} reachable states ·{' '}
                {result.transitions} transitions · {result.elapsedMs}ms
              </span>
            ) : null}
          </div>

          {result ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <VerdictChip verdict={result.status} />
                <span className="mono text-14 text-ink-400">{spec.ref}</span>
              </div>

              <p className={`measure text-17 ${STATUS_TONE[result.status]}`}>{result.reason}</p>

              <div>
                <p className="eyebrow mb-2">CHECKED</p>
                <p className="mono text-14 text-ink-100">{spec.formal}</p>
              </div>

              {result.trace.length > 0 ? (
                <div>
                  <p className="eyebrow mb-2">
                    SHORTEST SEQUENCE THAT GETS THERE · {result.trace.length - 1} EVENTS
                  </p>
                  <ol className="border-t border-hairline">
                    {result.trace.map((state, i) => (
                      <li
                        key={`${i}-${state.mode}-${state.a}-${state.b}`}
                        className="flex gap-4 border-b border-hairline py-2"
                      >
                        <span className="mono shrink-0 text-12 text-ink-500">
                          {String(i).padStart(2, '0')}
                        </span>
                        <span
                          className={`mono text-12 whitespace-pre ${
                            i === result.trace.length - 1 ? 'text-refute' : 'text-ink-400'
                          }`}
                        >
                          {formatState(state)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              <div className="border-t border-hairline pt-4">
                <p className="eyebrow mb-2">WAS THIS PROPERTY WORTH CHECKING</p>

                {result.mutation.applicable ? (
                  <>
                    <p className="mono text-14 text-ink-100">
                      seeded faults caught{' '}
                      <span
                        className={
                          result.mutation.killed === result.mutation.total
                            ? 'text-proof-ink'
                            : 'text-hold'
                        }
                      >
                        {result.mutation.killed} of {result.mutation.total}
                      </span>
                    </p>
                    <p className="measure mt-2 text-14 text-ink-400">
                      Each seeded fault is a plausible design mistake. A property that gives the
                      same verdict on a broken design as on the real one was not constraining
                      much, however green it looked.
                    </p>
                    {result.mutation.survivors.length > 0 ? (
                      <ul className="mt-3 space-y-1">
                        {result.mutation.survivors.map((survivor) => (
                          <li key={survivor} className="mono text-12 text-hold">
                            missed · {survivor}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mono mt-3 text-12 text-proof-ink">
                        every seeded fault changed the verdict
                      </p>
                    )}
                  </>
                ) : (
                  <p className="measure text-14 text-ink-400">
                    Not applicable while the property fails on the real design. The counter-example
                    above is the finding; strength only becomes an interesting question once
                    something passes.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          <div className="sr-only" role="status" aria-live="polite">
            {announcement}
          </div>
        </div>
      </div>

      <p className="mono border-t border-hairline px-5 py-3 text-12 text-ink-500">
        twelve states is small enough to enumerate on a laptop · the engine exists because real
        systems are not
      </p>
    </div>
  );
}
