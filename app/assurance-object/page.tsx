import type { Metadata } from 'next';
import { AssuranceCard } from '@/components/assurance/AssuranceCard';
import { AssuranceJSON } from '@/components/assurance/AssuranceJSON';
import { ObjectTools } from '@/components/assurance/ObjectTools';
import { CTABlock } from '@/components/layout/CTABlock';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { assuranceObjectPage as copy } from '@/content/copy/assuranceObjectPage';
import { assuranceBody } from '@/content/data/assuranceObject';
import { canonicalJson, sha256Hex } from '@/lib/hash';

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export default async function AssuranceObjectPage() {
  const contentHash = await sha256Hex(canonicalJson(assuranceBody));

  return (
    <>
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <Eyebrow>{copy.hero.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] text-40 sm:text-60">
          {copy.hero.h1.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="measure mt-7 text-17 text-ink-400 sm:text-21">{copy.hero.sub}</p>

        <div className="mt-12">
          <AssuranceCard contentHash={contentHash} />
        </div>
      </section>

      <Section label={copy.binds.rule.label} value={copy.binds.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{copy.binds.h2}</h2>
          <Prose className="mt-7">
            <p>{copy.binds.body}</p>
          </Prose>
        </Reveal>

        <ul className="mt-12 border-t border-hairline">
          {copy.binds.items.map((item, index) => (
            <Reveal as="li" key={item.name} delay={index * 40}>
              <div className="grid gap-3 border-b border-hairline py-6 md:grid-cols-[minmax(0,24rem)_1fr] md:gap-10">
                <h3 className="text-21 text-ink-100">{item.name}</h3>
                <p className="measure text-17 text-ink-400">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section label={copy.tools.rule.label} value={copy.tools.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{copy.tools.h2}</h2>
          <Prose className="mt-7">
            <p>{copy.tools.body}</p>
          </Prose>
        </Reveal>
        <Reveal delay={60} className="mt-10">
          <ObjectTools contentHash={contentHash} />
        </Reveal>
      </Section>

      <Section label={copy.payload.rule.label} value={copy.payload.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{copy.payload.h2}</h2>
          <Prose className="mt-7">
            <p>{copy.payload.body}</p>
          </Prose>
        </Reveal>
        <Reveal delay={60} className="mt-10">
          <AssuranceJSON contentHash={contentHash} />
        </Reveal>
      </Section>

      <Section label={copy.clauses.rule.label} value={copy.clauses.rule.value}>
        <Reveal>
          <h2 className="max-w-[26ch] text-28 sm:text-40">{copy.clauses.h2}</h2>
          <Prose className="mt-7">
            <p>{copy.clauses.body}</p>
          </Prose>
        </Reveal>

        <Reveal delay={60} className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <thead>
              <tr className="border-y border-hairline">
                <th scope="col" className="eyebrow py-3 pr-6">STANDARD</th>
                <th scope="col" className="eyebrow py-3 pr-6">CLAUSE</th>
                <th scope="col" className="eyebrow py-3 pr-6">EVIDENCE REQUIREMENT</th>
                <th scope="col" className="eyebrow py-3">FIELD</th>
              </tr>
            </thead>
            <tbody>
              {copy.clauses.rows.map((row) => (
                <tr key={`${row.standard}-${row.clause}`} className="border-b border-hairline">
                  <td className="mono py-3 pr-6 align-top text-14 text-ink-100">{row.standard}</td>
                  <td className="mono py-3 pr-6 align-top text-14 text-ink-400">{row.clause}</td>
                  <td className="py-3 pr-6 align-top text-14 text-ink-400">{row.requirement}</td>
                  <td className="mono py-3 align-top text-14 text-proof-ink">{row.field}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Section>

      <Section label={copy.cta.rule.label} value={copy.cta.rule.value} className="pb-8">
        <Reveal>
          <CTABlock
            eyebrow={copy.cta.eyebrow}
            heading={copy.cta.heading}
            body={copy.cta.body}
            actions={copy.cta.actions}
          />
        </Reveal>
      </Section>
    </>
  );
}
