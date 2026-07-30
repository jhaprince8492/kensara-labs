import Link from 'next/link';
import { Eyebrow } from '@/components/primitives/Eyebrow';

/**
 * Two variants only. `technical` asks for an artifact, `commercial` asks for a
 * conversation. Buttons name what happens.
 */
export function CTABlock({
  eyebrow,
  heading,
  body,
  actions,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  actions: readonly { label: string; href: string | null; kind: 'primary' | 'secondary' }[];
}) {
  return (
    <div className="border border-hairline bg-slate-900 p-7 sm:p-10">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 max-w-[22ch] text-28 sm:text-40">{heading}</h2>
      <p className="measure mt-5 text-17 text-ink-400">{body}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {actions
          .filter((action) => action.href !== null)
          .map((action) => (
            <Link
              key={action.label}
              href={action.href as string}
              className={
                action.kind === 'primary'
                  ? 'mono border border-proof/50 bg-proof/10 px-4 py-2.5 text-14 text-proof-ink transition-colors duration-[120ms] hover:border-proof hover:bg-proof/15'
                  : 'mono border border-hairline px-4 py-2.5 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-ink-600 hover:text-ink-100'
              }
            >
              {action.label}
            </Link>
          ))}
      </div>
    </div>
  );
}
