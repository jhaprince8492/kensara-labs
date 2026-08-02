export type VerdictKind =
  | 'PROVEN'
  | 'REFUTED'
  | 'REFUSE'
  | 'ALLOW'
  | 'DENY'
  | 'REVIEW'
  // Fidelity report statuses. Same chip, same colour semantics: a requirement
  // that holds is proven, one with a located counter-example is refuted, and a
  // property that passed without constraining anything needs a human.
  | 'IMPLEMENTED'
  | 'VIOLATED'
  | 'UNPROVEN'
  | 'VACUOUS';

/**
 * Colour is data. Blue is proven or allowed. Green is the gate enforcing.
 * Amber is a human being required. Red is refuted or denied and nothing else.
 *
 * REFUSE is deliberately neutral: an honest "I cannot answer, and here is
 * precisely why" is not a failure state, and colouring it red would say it was.
 */
const STYLES: Record<VerdictKind, string> = {
  PROVEN: 'text-proof-ink border-proof/40 bg-proof/8',
  ALLOW: 'text-proof-ink border-proof/40 bg-proof/8',
  REFUTED: 'text-refute border-refute/40 bg-refute/8',
  DENY: 'text-refute border-refute/40 bg-refute/8',
  REVIEW: 'text-hold border-hold/40 bg-hold/8',
  REFUSE: 'text-ink-400 border-hairline bg-slate-800',
  IMPLEMENTED: 'text-proof-ink border-proof/40 bg-proof/8',
  VIOLATED: 'text-refute border-refute/40 bg-refute/8',
  VACUOUS: 'text-hold border-hold/40 bg-hold/8',
  UNPROVEN: 'text-ink-400 border-hairline bg-slate-800',
};

export function VerdictChip({
  verdict,
  className = '',
}: {
  verdict: VerdictKind;
  className?: string;
}) {
  return (
    <span
      className={`mono inline-flex items-center border px-2 py-[3px] text-12 tracking-[0.14em] ${STYLES[verdict]} ${className}`}
    >
      {verdict}
    </span>
  );
}
