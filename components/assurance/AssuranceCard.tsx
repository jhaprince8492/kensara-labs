'use client';

import { useState } from 'react';
import { canonicalJson, sha256Hex, truncateHash } from '@/lib/hash';
import { assuranceBody, assuranceMeta } from '@/content/data/assuranceObject';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { VerdictChip } from '@/components/primitives/VerdictChip';
import { AssuranceJSON } from './AssuranceJSON';

type VerifyState = 'idle' | 'checking' | 'verified' | 'mismatch';

/**
 * The signature element. Dark panel, mono header, verdict chip, hash footer.
 * One component, three sizes, no variants: it appears on the home page, both
 * product pages, every industry page, and as a standalone page, and it is the
 * same object everywhere.
 *
 * `contentHash` is computed at build time from the same body this card renders,
 * and verify recomputes it here in the browser. Nothing about the check is
 * decorative.
 */
export function AssuranceCard({
  contentHash,
  expandable = false,
  defaultExpanded = false,
}: {
  contentHash: string;
  expandable?: boolean;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [state, setState] = useState<VerifyState>('idle');
  const [computed, setComputed] = useState<string | null>(null);

  const verify = async () => {
    setState('checking');
    const digest = await sha256Hex(canonicalJson(assuranceBody));
    setComputed(digest);
    setState(digest === contentHash ? 'verified' : 'mismatch');
  };

  const borderClass =
    state === 'verified'
      ? 'border-proof'
      : state === 'mismatch'
        ? 'border-refute'
        : 'border-hairline';

  return (
    <article
      className={`border bg-slate-900 transition-colors duration-200 ${borderClass}`}
      aria-label="Assurance object"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <Eyebrow as="span">{assuranceMeta.standardsLabel}</Eyebrow>
        <span className="mono text-12 text-ink-500">
          {assuranceBody.kensara_assurance_object} · {assuranceBody.emitted_by}
        </span>
      </header>

      <div className="space-y-5 px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-center gap-3">
          <VerdictChip verdict="PROVEN" />
          <span className="mono text-14 text-ink-400">
            unsat core: {assuranceBody.verdict.unsat_core.length} of{' '}
            {assuranceBody.verdict.rule_base_size} rules ·{' '}
            {assuranceBody.verdict.duration_ms}ms · {assuranceBody.verdict.solver}{' '}
            {assuranceBody.verdict.solver_version}
          </span>
        </div>

        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Field label="REQUIREMENT" value={assuranceBody.requirement.id}>
            {assuranceBody.requirement.text}
          </Field>
          <Field label="SPECIFICATION" value={assuranceBody.specification.language}>
            {assuranceBody.specification.formula}
          </Field>
          <Field label="CONFIRMED BY" value={assuranceBody.specification.confirmation_mode}>
            {assuranceBody.specification.confirmed_by}
          </Field>
          <Field label="LEDGER" value={`seq ${assuranceBody.ledger.seq}`}>
            {assuranceBody.ledger.chain}
          </Field>
        </dl>

        <div>
          <p className="eyebrow mb-2">REGULATORY BINDING</p>
          <ul className="flex flex-wrap gap-2">
            {assuranceBody.regulatory_binding.map((binding) => (
              <li
                key={`${binding.standard}-${binding.clause}`}
                className="mono border border-hairline px-2 py-1 text-12 text-ink-400"
              >
                {binding.standard} {binding.clause}
              </li>
            ))}
          </ul>
        </div>

        {expandable ? (
          <div>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mono border border-hairline px-3 py-2 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-ink-600 hover:text-ink-100"
            >
              {expanded ? 'Collapse the object' : 'Expand the full object'}
            </button>
            {expanded ? (
              <div className="mt-4">
                <AssuranceJSON contentHash={contentHash} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-5 py-3">
        <p className="mono text-12 text-ink-500">
          {assuranceBody.signature.algorithm} · {truncateHash(contentHash, 12)}
        </p>
        <div className="flex items-center gap-3">
          {state === 'verified' ? (
            <span className="mono text-12 text-proof-ink">
              recomputed in this browser · match
            </span>
          ) : null}
          {state === 'mismatch' ? (
            <span className="mono text-12 text-refute">
              digest mismatch · {computed ? truncateHash(computed, 12) : ''}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => void verify()}
            disabled={state === 'checking'}
            className="mono border border-hairline px-3 py-1.5 text-12 text-ink-400 transition-colors duration-[120ms] hover:border-proof hover:text-proof-ink disabled:opacity-50"
          >
            {state === 'checking' ? 'Verifying…' : 'Verify this object'}
          </button>
        </div>
      </footer>
    </article>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: string;
}) {
  return (
    <div>
      <dt className="eyebrow mb-1.5">
        {label} · {value}
      </dt>
      <dd className="mono text-14 text-ink-100">{children}</dd>
    </div>
  );
}
