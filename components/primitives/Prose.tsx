import type { ReactNode } from 'react';

/** Body copy. 17px, 1.65 line-height, capped at a 68ch measure. */
export function Prose({
  children,
  className = '',
  tone = 'secondary',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'primary' | 'secondary';
}) {
  return (
    <div
      className={`measure space-y-5 text-17 ${
        tone === 'primary' ? 'text-ink-100' : 'text-ink-400'
      } ${className}`}
    >
      {children}
    </div>
  );
}
