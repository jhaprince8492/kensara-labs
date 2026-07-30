/**
 * The hairline verdict strip.
 *
 * A 1px rule with a small mono label sitting on it. It separates every major
 * section on the site and echoes a solver log: the labels accumulate meaning as
 * you scroll. This is the one repeated structural motif, so it is built once
 * and used everywhere without variation.
 */
export function SectionRule({
  label,
  value,
  id,
}: {
  /** The classification this section carries. Rendered in mono, uppercased. */
  label: string;
  /** Optional right-hand readout: a count, a latency, a standard. */
  value?: string;
  id?: string;
}) {
  return (
    <div id={id} className="relative py-px" role="separator" aria-label={label}>
      <div className="h-px w-full bg-hairline" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex -translate-y-1/2 items-center justify-between gap-4">
        <span className="eyebrow bg-void pr-3 whitespace-nowrap">{label}</span>
        {value ? (
          <span className="eyebrow bg-void pl-3 whitespace-nowrap">{value}</span>
        ) : null}
      </div>
    </div>
  );
}
