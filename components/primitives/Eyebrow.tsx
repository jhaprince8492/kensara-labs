import type { ReactNode } from 'react';

/**
 * Mono, uppercase, 12px, 0.14em tracking, --ink-600.
 *
 * Only used where the label states a real classification: `P1 · ACTION PATH`,
 * `IEC 62304 · CLASS C`. Never decorative.
 */
export function Eyebrow({
  children,
  className = '',
  as: Tag = 'p',
}: {
  children: ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h2';
}) {
  return <Tag className={`eyebrow ${className}`}>{children}</Tag>;
}
