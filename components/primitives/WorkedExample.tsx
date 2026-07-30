import { Eyebrow } from './Eyebrow';
import { VerdictChip, type VerdictKind } from './VerdictChip';

/** Terminal-style, seeded, always mono. Evidence, not decoration. */
export function WorkedExample({
  eyebrow,
  question,
  lines,
  result,
  chip,
}: {
  eyebrow: string;
  question: string;
  lines: readonly string[];
  result: string;
  chip: VerdictKind;
}) {
  const tone =
    chip === 'PROVEN' || chip === 'ALLOW'
      ? 'text-proof-ink'
      : chip === 'REFUTED' || chip === 'DENY'
        ? 'text-refute'
        : chip === 'REVIEW'
          ? 'text-hold'
          : 'text-ink-400';

  return (
    <article className="flex h-full flex-col border border-hairline bg-slate-900">
      <header className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <Eyebrow as="span">{eyebrow}</Eyebrow>
        <VerdictChip verdict={chip} />
      </header>

      <div className="flex flex-1 flex-col gap-4 px-5 py-5">
        <p className="text-17 text-ink-100">{question}</p>
        <pre className="mono overflow-x-auto text-12 leading-[1.9] text-ink-400">
          {lines.join('\n')}
        </pre>
        <p className={`mono mt-auto text-14 ${tone}`}>{result}</p>
      </div>
    </article>
  );
}
