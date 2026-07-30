import type { ReactNode } from 'react';

export type MonoTone = 'default' | 'proof' | 'gate' | 'hold' | 'refute' | 'muted';

const TONES: Record<MonoTone, string> = {
  default: 'text-ink-100',
  proof: 'text-proof-ink',
  gate: 'text-gate',
  hold: 'text-hold',
  refute: 'text-refute',
  muted: 'text-ink-500',
};

/**
 * One line of evidence. Prose is proportional; evidence is monospaced.
 * Hashes, rule ids, verdicts, timestamps, pack names, latencies and standards
 * references all come through here.
 */
export function MonoLine({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode;
  tone?: MonoTone;
  className?: string;
}) {
  return (
    <p className={`mono text-14 ${TONES[tone]} ${className}`}>{children}</p>
  );
}
