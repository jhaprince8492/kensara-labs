import type { ReactNode } from 'react';
import { SectionRule } from './SectionRule';

/** A major section: the hairline verdict strip, then the content. */
export function Section({
  id,
  label,
  value,
  children,
  className = '',
}: {
  id?: string;
  label: string;
  value?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-[88rem] px-5 sm:px-8 ${className}`}>
      <SectionRule label={label} value={value} />
      <div className="py-16 sm:py-24">{children}</div>
    </section>
  );
}
