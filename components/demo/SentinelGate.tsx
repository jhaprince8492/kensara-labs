'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { canonicalJson, sha256Hex, truncateHash } from '@/lib/hash';
import {
  ACTION,
  DEFAULT_INPUT,
  PACK_ID,
  evaluate,
  formatPaise,
  type CrmAddressAge,
  type CustomerClaim,
  type Decision,
  type GateInput,
  type OmsStatus,
  type PredicateStatus,
  type RuleTrace,
} from '@/lib/policy';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { VerdictChip } from '@/components/primitives/VerdictChip';
import { Segmented } from './Segmented';

const CLAIMS: readonly CustomerClaim[] = ['not delivered', 'damaged', 'wrong item'];
const STATUSES: readonly OmsStatus[] = ['delivered', 'in transit', 'lost'];
const ADDRESS_AGES: readonly CrmAddressAge[] = ['current', 'stale (3w)'];

/** Predicates resolve in sequence, then the verdict lands at ~900ms. */
const RULE_STEP_MS = 150;
const RULE_START_MS = 160;
const VERDICT_AT_MS = 900;

const MARK_TONE: Record<PredicateStatus, string> = {
  pass: 'text-proof-ink',
  fail: 'text-refute',
  obligation: 'text-hold',
  info: 'text-ink-500',
};

export function SentinelGate({ headingId }: { headingId?: string }) {
  const [input, setInput] = useState<GateInput>(DEFAULT_INPUT);
  const [decision, setDecision] = useState<Decision | null>(null);
  // `stale` keeps the last decision on screen after an input changes, clearly
  // marked as no longer matching the form. Blanking the panel would put the
  // component back in the empty state it is not allowed to sit in.
  const [phase, setPhase] = useState<'idle' | 'running' | 'settled' | 'stale'>('idle');
  const [revealed, setRevealed] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  const timers = useRef<number[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const amountId = useId();
  const freshnessId = useId();

  const clearTimers = useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // A visitor who opens devtools can re-derive any decision id shown here.
  // Nothing about this component is a mock, so nothing about it is hidden.
  useEffect(() => {
    Object.assign(window as unknown as Record<string, unknown>, {
      kensara: { canonicalJson, sha256Hex, evaluate, DEFAULT_INPUT, PACK_ID },
    });
  }, []);

  // Land on a decision rather than on an empty panel.
  //
  // The default scenario is evaluated once on mount and shown already settled,
  // with no animation and no announcement: a screen reader should not be told a
  // verdict nobody asked for. This is the state a screenshot, a PDF export or a
  // visitor who never clicks will see, so it has to be the decision and not
  // "no decision yet".
  useEffect(() => {
    let cancelled = false;

    void evaluate(DEFAULT_INPUT, new Date()).then((result) => {
      if (cancelled) return;
      setDecision(result);
      setRevealed(result.rules.length);
      setPhase('settled');
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const patch = useCallback(
    (next: Partial<GateInput>) => {
      clearTimers();
      setPhase((current) => (current === 'idle' ? 'idle' : 'stale'));
      setAnnouncement('');
      setInput((current) => ({ ...current, ...next }));
    },
    [clearTimers],
  );

  const submit = useCallback(async () => {
    clearTimers();
    setRevealed(0);
    setAnnouncement('');
    setPhase('running');

    // `now` is captured here and injected. It stamps the decision; it never
    // decides it, and it is not part of the hash.
    const result = await evaluate(input, new Date());
    setDecision(result);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setRevealed(result.rules.length);
      setPhase('settled');
      setAnnouncement(describe(result));
      return;
    }

    result.rules.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => setRevealed(i + 1), RULE_START_MS + i * RULE_STEP_MS),
      );
    });

    timers.current.push(
      window.setTimeout(() => {
        setPhase('settled');
        setAnnouncement(describe(result));
      }, VERDICT_AT_MS),
    );
  }, [clearTimers, input]);

  const stale = phase === 'stale';
  const settled = (phase === 'settled' || stale) && decision !== null;
  const rupees = Math.trunc(input.amount_inr / 100);

  return (
    <div className="border border-hairline bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <Eyebrow as="span">SENTINEL · ACTION PATH · CLIENT-SIDE</Eyebrow>
        <span className="mono text-12 text-ink-500">
          {ACTION} · pack:{PACK_ID}
        </span>
      </div>

      <div className="grid gap-px bg-hairline lg:grid-cols-2">
        {/* ------------------------------------------------ the intent */}
        <form
          className="space-y-6 bg-slate-900 p-5 sm:p-7"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          aria-labelledby={headingId}
        >
          <div>
            <label htmlFor={amountId} className="eyebrow mb-2 block">
              AMOUNT · INR
            </label>
            <div className="flex items-center border border-hairline bg-slate-800 focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-proof">
              <span className="mono px-3 py-2 text-14 text-ink-500" aria-hidden="true">
                ₹
              </span>
              <input
                id={amountId}
                type="number"
                inputMode="numeric"
                min={0}
                max={100000}
                step={100}
                value={rupees}
                onChange={(event) => {
                  const parsed = Number.parseInt(event.target.value, 10);
                  const safe = Number.isFinite(parsed) ? Math.max(0, Math.min(100000, parsed)) : 0;
                  patch({ amount_inr: safe * 100 });
                }}
                className="mono w-full bg-transparent py-2 pr-3 text-14 text-ink-100 outline-none"
              />
              <span className="mono px-3 py-2 text-12 whitespace-nowrap text-ink-500">
                {input.amount_inr.toLocaleString('en-IN')} paise
              </span>
            </div>
          </div>

          <Segmented
            legend="CUSTOMER CLAIM"
            name="claim"
            value={input.customer_claim}
            options={CLAIMS}
            onChange={(customer_claim) => patch({ customer_claim })}
          />

          <Segmented
            legend="OMS STATUS · AUTHORITATIVE SOURCE"
            name="oms"
            value={input.oms_status}
            options={STATUSES}
            onChange={(oms_status) => patch({ oms_status })}
          />

          <div>
            <label htmlFor={freshnessId} className="eyebrow mb-2 block">
              OMS LAST UPDATED · MINUTES AGO
            </label>
            <input
              id={freshnessId}
              type="number"
              inputMode="numeric"
              min={0}
              max={1440}
              step={1}
              value={input.oms_updated_min}
              onChange={(event) => {
                const parsed = Number.parseInt(event.target.value, 10);
                const safe = Number.isFinite(parsed) ? Math.max(0, Math.min(1440, parsed)) : 0;
                patch({ oms_updated_min: safe });
              }}
              className="mono w-full border border-hairline bg-slate-800 px-3 py-2 text-14 text-ink-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-proof"
            />
          </div>

          <Segmented
            legend="CRM ADDRESS"
            name="crm"
            value={input.crm_address_age}
            options={ADDRESS_AGES}
            onChange={(crm_address_age) => patch({ crm_address_age })}
          />

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              className="mono border border-proof/50 bg-proof/10 px-4 py-2.5 text-14 text-proof-ink transition-colors duration-[120ms] hover:border-proof hover:bg-proof/15"
            >
              Submit action to Sentinel
            </button>
            <button
              type="button"
              onClick={() => void submit()}
              disabled={!decision}
              className="mono border border-hairline px-4 py-2.5 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-ink-600 hover:text-ink-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Re-run this decision
            </button>
          </div>
        </form>

        {/* ------------------------------------------------ the decision */}
        <div ref={outputRef} className="bg-slate-900 p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Eyebrow as="span">DECISION TRACE</Eyebrow>
            {settled && decision ? (
              <span className="mono text-12 text-ink-500">{decision.evaluatedAt}</span>
            ) : null}
          </div>

          {!decision ? (
            <p className="mono max-w-[46ch] text-14 text-ink-400">
              Evaluating the default scenario. Nothing is sent anywhere: the pack runs in
              this browser.
            </p>
          ) : null}

          {stale ? (
            <p className="mono mb-4 border border-hold/40 bg-hold/8 px-3 py-2 text-12 text-hold">
              conditions changed · this decision was made on the previous inputs · submit to
              re-evaluate
            </p>
          ) : null}

          {decision ? (
            <div className={`space-y-4 ${stale ? 'opacity-55' : ''}`}>
              <ol className="space-y-3">
                {decision.rules.map((rule, index) => (
                  <RuleRow key={rule.id} rule={rule} shown={index < revealed} />
                ))}
              </ol>

              <div
                className={`border-t border-hairline pt-4 transition-opacity duration-200 ${
                  settled ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {settled ? <VerdictBlock decision={decision} /> : <span aria-hidden="true">&nbsp;</span>}
              </div>
            </div>
          ) : null}

          <div className="sr-only" role="status" aria-live="polite">
            {announcement}
          </div>
        </div>
      </div>

      <div className="border-t border-hairline px-5 py-3">
        <p className="mono text-12 text-ink-500">
          {settled && decision
            ? `sha256(${'{'}sorted keys, no whitespace, integer paise${'}'}) · reproduce in devtools: kensara.sha256Hex(kensara.canonicalJson(input))`
            : 'the decision id is a sha-256 of the canonicalised input · sorted keys · no whitespace · money as integer paise'}
        </p>
      </div>
    </div>
  );
}

function RuleRow({ rule, shown }: { rule: RuleTrace; shown: boolean }) {
  return (
    <li
      className="transition-opacity duration-150"
      style={{ opacity: shown ? 1 : 0.18 }}
      aria-hidden={shown ? undefined : true}
    >
      <div className="flex items-baseline gap-3">
        <span className="mono text-14 text-ink-400">{rule.id}</span>
        <span className="mono text-14 text-ink-100">{rule.name}</span>
        <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
        <span className={`mono text-12 tracking-[0.14em] uppercase ${MARK_TONE[rule.status]}`}>
          {shown ? rule.status : '·'}
        </span>
      </div>
      {shown
        ? rule.lines.map((line) => (
            <div key={line.expr} className="mt-1 flex gap-3 pl-1">
              <span className={`mono text-14 ${MARK_TONE[line.status]}`} aria-hidden="true">
                {line.mark}
              </span>
              <span className="mono text-14 text-ink-400">
                <span className="text-ink-100">{line.expr}</span>
                <span className="text-ink-500"> · </span>
                {line.note}
              </span>
            </div>
          ))
        : null}
    </li>
  );
}

function VerdictBlock({ decision }: { decision: Decision }) {
  const deciding = decision.rules.filter(
    (r) => r.status === 'fail' || (decision.verdict === 'ALLOW' && r.status === 'obligation'),
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <VerdictChip verdict={decision.verdict} />
        <span className="mono text-14 text-ink-400">
          {decision.pack}
          {decision.decidingRule ? ` · rule ${decision.decidingRule}` : ''}
        </span>
      </div>

      <div className="space-y-1">
        {deciding.flatMap((rule) =>
          rule.lines.map((line) => (
            <div key={`${rule.id}-${line.expr}`} className="flex gap-3">
              <span className={`mono text-14 ${MARK_TONE[line.status]}`} aria-hidden="true">
                {line.mark}
              </span>
              <span className="mono text-14 text-ink-400">
                <span className="text-ink-100">{line.expr}</span> {line.note}
              </span>
            </div>
          )),
        )}
      </div>

      {decision.obligation ? (
        <p className="mono text-14 text-hold">obligation: {decision.obligation}</p>
      ) : null}

      <p className="mono text-14 text-ink-400">
        decision id{' '}
        <span className="text-ink-100">{truncateHash(decision.decisionId)}</span>
        <span className="text-ink-500"> · </span>
        ledger seq <span className="text-ink-100">{decision.ledgerSeq}</span>
        <span className="text-ink-500"> · </span>
        replay{' '}
        <span className={decision.replayOk ? 'text-proof-ink' : 'text-refute'}>
          {decision.replayOk ? '✓' : '✗'}
        </span>
      </p>

      <details className="border border-hairline bg-slate-800/60">
        <summary className="mono cursor-pointer px-3 py-2 text-12 text-ink-400 hover:text-ink-100">
          show the bytes that were hashed
        </summary>
        <div className="space-y-2 border-t border-hairline px-3 py-3">
          <pre className="mono overflow-x-auto text-12 text-ink-400">
            {decision.canonicalInput}
          </pre>
          <p className="mono text-12 break-all text-ink-500">{decision.decisionId}</p>
        </div>
      </details>
    </div>
  );
}

function describe(decision: Decision): string {
  const rule = decision.decidingRule ? `, deciding rule ${decision.decidingRule}` : '';
  const obligation = decision.obligation ? `, obligation: ${decision.obligation}` : '';
  return `Verdict ${decision.verdict} under policy pack ${decision.pack}${rule}${obligation}. Decision id ${truncateHash(decision.decisionId)}.`;
}

export { formatPaise };
