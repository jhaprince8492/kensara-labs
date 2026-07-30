'use client';

import { useId } from 'react';

/**
 * A radio group rendered as segments. Native radios underneath, so arrow keys,
 * roving focus and screen-reader semantics come from the platform rather than
 * from us reimplementing them.
 */
export function Segmented<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  disabled = false,
}: {
  legend: string;
  name: string;
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
  disabled?: boolean;
}) {
  const id = useId();

  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="eyebrow mb-2">{legend}</legend>
      <div className="flex flex-wrap gap-px border border-hairline bg-hairline">
        {options.map((option) => {
          const checked = option === value;
          return (
            <label
              key={option}
              className={`mono relative flex-1 cursor-pointer px-3 py-2 text-center text-14 whitespace-nowrap transition-colors duration-[120ms] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-2px] has-[:focus-visible]:outline-proof ${
                checked
                  ? 'bg-slate-800 text-ink-100'
                  : 'bg-slate-900 text-ink-400 hover:text-ink-100'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <input
                type="radio"
                name={`${name}-${id}`}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
