import type { Metadata } from 'next';
import Link from 'next/link';
import { CTABlock } from '@/components/layout/CTABlock';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { sectors } from '@/content/data/industries';

export const metadata: Metadata = {
  title: 'Industries',
  description:
    'Six sectors, one template: the specific failure mode, the governing clauses, three workflows, a worked example, and what Kensara does not do there.',
};

export default function IndustriesPage() {
  return (
    <>
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <Eyebrow>INDUSTRIES · SIX SECTORS</Eyebrow>
        <h1 className="mt-6 max-w-[20ch] text-40 sm:text-60">
          The failure mode is different. The instrument is the same.
        </h1>
        <p className="measure mt-7 text-17 text-ink-400 sm:text-21">
          Each page states the sector’s specific failure mode, the clauses that govern it, three
          workflows with the engine named, one worked example, and what we do not do there.
        </p>
      </section>

      <Section label="SECTORS" value="6">
        <ul className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, index) => {
            const inner = (
              <div className="flex h-full flex-col p-6 sm:p-7">
                <Eyebrow>{sector.standards}</Eyebrow>
                <h2 className="mt-3 text-21 text-ink-100">{sector.name}</h2>
                <p className="mt-4 text-14 text-ink-400">{sector.summary}</p>
                <p className="mono mt-auto pt-6 text-12 text-ink-500">
                  {sector.page ? 'open the sector page →' : 'sector page in preparation'}
                </p>
              </div>
            );

            return (
              <Reveal as="li" key={sector.slug} delay={index * 30} className="bg-slate-900">
                {sector.page ? (
                  <Link
                    href={`/industries/${sector.slug}/`}
                    className="block h-full transition-colors duration-[120ms] hover:bg-slate-800"
                  >
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </Reveal>
            );
          })}
        </ul>
      </Section>

      <Section label="NEXT" value="45 min" className="pb-8">
        <Reveal>
          <CTABlock
            eyebrow="SCOPING CALL · 45 MIN"
            heading="Your sector is not the interesting part. Your workflow is."
            body="Bring one decision you have stopped short of automating, or one requirement your certification body keeps returning. We will tell you honestly whether this is the right instrument for it."
            actions={[{ label: 'Request access', href: '/demo/', kind: 'primary' as const }]}
          />
        </Reveal>
      </Section>
    </>
  );
}
