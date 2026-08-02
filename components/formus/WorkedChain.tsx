import { Eyebrow } from '@/components/primitives/Eyebrow';
import { formus } from '@/content/copy/formus';

/**
 * One requirement, end to end.
 *
 * Numbering is earned here: these steps are genuinely ordered, and the reader
 * needs to see that the model's contribution is step two of eight and that
 * nothing downstream of the confirmation gate depends on it.
 */
export function WorkedChain() {
  const { steps } = formus.worked;

  return (
    <ol className="border-t border-hairline">
      {steps.map((step, index) => (
        <li key={step.label} className="border-b border-hairline">
          <div className="grid gap-3 py-6 lg:grid-cols-[3rem_minmax(0,20rem)_1fr] lg:gap-8">
            <span className="mono text-14 text-proof-ink">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div>
              <Eyebrow as="p">{step.label}</Eyebrow>
              <p className="mono mt-1.5 text-12 text-ink-500">{step.actor}</p>
            </div>

            <p
              className={
                step.mono
                  ? 'mono text-14 break-words text-ink-100'
                  : 'measure text-17 text-ink-100'
              }
            >
              {step.content}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
