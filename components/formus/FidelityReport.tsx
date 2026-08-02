import { Eyebrow } from '@/components/primitives/Eyebrow';
import { VerdictChip } from '@/components/primitives/VerdictChip';
import { formus } from '@/content/copy/formus';

/**
 * The fidelity report.
 *
 * The differentiated object: not pass or fail, but a requirement-by-requirement
 * statement of what is implemented, what is not, and exactly where it breaks.
 * The location column is the point of the whole component, so it is never
 * truncated and never behind an interaction.
 */
export function FidelityReport() {
  const { fidelity } = formus;

  return (
    <div className="border border-hairline bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <Eyebrow as="span">{fidelity.summaryLabel}</Eyebrow>
        <span className="mono text-12 text-ink-500">deterministic · replayable</span>
      </div>

      {/* the counts */}
      <ul className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
        {fidelity.summary.map((entry) => (
          <li key={entry.status} className="bg-slate-900 p-5">
            <div className="flex items-baseline gap-3">
              <span className="mono text-40 text-ink-100">{entry.count}</span>
              <VerdictChip verdict={entry.status} />
            </div>
            <p className="mono mt-3 text-12 text-ink-500">{entry.note}</p>
          </li>
        ))}
      </ul>

      <p className="mono border-t border-hairline px-5 py-3 text-14 text-proof-ink">
        {fidelity.score}
      </p>

      {/* the per-requirement detail */}
      <div className="border-t border-hairline px-5 py-4">
        <Eyebrow as="p">{fidelity.rowsLabel}</Eyebrow>
      </div>

      <ul className="border-t border-hairline">
        {fidelity.rows.map((row) => (
          <li key={row.id} className="border-b border-hairline px-5 py-4 last:border-b-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="mono text-14 text-ink-100">{row.id}</span>
              <VerdictChip verdict={row.status} />
            </div>
            <p className="measure mt-2 text-14 text-ink-400">{row.requirement}</p>
            {row.location ? (
              <p className="mono mt-2 text-12 text-ink-500">
                <span className="tracking-[0.14em] uppercase">where</span>
                <span> · </span>
                <span className="text-ink-400">{row.location}</span>
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="border-t border-hairline px-5 py-4 text-17 text-ink-100">
        {fidelity.footnote}
      </p>
    </div>
  );
}
