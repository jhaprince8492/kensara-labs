import type { Metadata } from 'next';
import { AssuranceCard } from '@/components/assurance/AssuranceCard';
import { ReplayPanel } from '@/components/assurance/ReplayPanel';
import { CTABlock } from '@/components/layout/CTABlock';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { assuranceBody } from '@/content/data/assuranceObject';
import { platform } from '@/content/copy/platform';
import { canonicalJson, sha256Hex } from '@/lib/hash';

export const metadata: Metadata = {
  title: platform.meta.title,
  description: platform.meta.description,
};

export default async function PlatformPage() {
  const contentHash = await sha256Hex(canonicalJson(assuranceBody));

  return (
    <>
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <Eyebrow>{platform.hero.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-[16ch] text-40 sm:text-60">
          {platform.hero.h1.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="measure mt-7 text-17 text-ink-400 sm:text-21">{platform.hero.sub}</p>
      </section>

      {/* the determinism contract */}
      <Section label={platform.determinism.rule.label} value={platform.determinism.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{platform.determinism.h2}</h2>
        </Reveal>

        <Reveal delay={60} className="mt-10">
          <div className="border border-hairline bg-slate-900 p-5 sm:p-7">
            <dl className="space-y-3">
              {platform.determinism.invariants.map((invariant) => (
                <div
                  key={invariant.name}
                  className="grid gap-1 sm:grid-cols-[16rem_1fr] sm:gap-6"
                >
                  <dt className="mono text-14 text-ink-100">{invariant.name}</dt>
                  <dd className="mono text-14 text-ink-400">{invariant.detail}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 border-t border-hairline pt-5 text-17 text-ink-100">
              {platform.determinism.footnote}
            </p>
          </div>
        </Reveal>

        <Reveal delay={90} className="mt-12">
          <h3 className="text-21">{platform.determinism.cost.h3}</h3>
          <Prose className="mt-4">
            <p>{platform.determinism.cost.body}</p>
          </Prose>
        </Reveal>
      </Section>

      {/* the shared artifact */}
      <Section label={platform.artifact.rule.label} value={platform.artifact.rule.value}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16">
          <Reveal>
            <h2 className="max-w-[22ch] text-28 sm:text-40">{platform.artifact.h2}</h2>
            <Prose className="mt-7">
              <p>{platform.artifact.body}</p>
            </Prose>
            <ul className="mt-8 border-t border-hairline">
              {platform.artifact.anatomy.map((part) => (
                <li
                  key={part.part}
                  className="grid gap-1 border-b border-hairline py-3.5 sm:grid-cols-[12rem_1fr]"
                >
                  <span className="mono text-14 text-proof-ink">{part.part}</span>
                  <span className="text-14 text-ink-400">{part.from}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={60}>
            <AssuranceCard contentHash={contentHash} expandable />
          </Reveal>
        </div>
      </Section>

      {/* replay */}
      <Section label={platform.replay.rule.label} value={platform.replay.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{platform.replay.h2}</h2>
          <Prose className="mt-7">
            <p>{platform.replay.body}</p>
          </Prose>
        </Reveal>
        <Reveal delay={60} className="mt-10">
          <ReplayPanel />
        </Reveal>
      </Section>

      {/* architecture */}
      <Section label={platform.architecture.rule.label} value={platform.architecture.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{platform.architecture.h2}</h2>
          <Prose className="mt-7">
            <p>{platform.architecture.body}</p>
          </Prose>
        </Reveal>

        <Reveal delay={60} className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <thead>
              <tr className="border-y border-hairline">
                <th scope="col" className="eyebrow py-3 pr-6">COMPONENT</th>
                <th scope="col" className="eyebrow py-3 pr-6">RUNS IN</th>
                <th scope="col" className="eyebrow py-3 pr-6">CROSSES THE BOUNDARY</th>
                <th scope="col" className="eyebrow py-3">NOTE</th>
              </tr>
            </thead>
            <tbody>
              {platform.architecture.rows.map((row) => (
                <tr key={row.component} className="border-b border-hairline">
                  <td className="py-3 pr-6 align-top text-14 text-ink-100">{row.component}</td>
                  <td className="mono py-3 pr-6 align-top text-14 text-ink-400">{row.runs}</td>
                  <td className="mono py-3 pr-6 align-top text-14 text-ink-400">{row.crosses}</td>
                  <td className="py-3 align-top text-14 text-ink-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Section>

      {/* the corpus */}
      <Section label={platform.corpus.rule.label} value={platform.corpus.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{platform.corpus.h2}</h2>
          <Prose className="mt-7">
            <p>{platform.corpus.body}</p>
          </Prose>
          <p className="mono mt-7 text-14 text-ink-500">
            intent → specification → correction → result
          </p>
        </Reveal>
      </Section>

      <Section label={platform.cta.rule.label} value={platform.cta.rule.value} className="pb-8">
        <Reveal>
          <CTABlock
            eyebrow={platform.cta.eyebrow}
            heading={platform.cta.heading}
            body={platform.cta.body}
            actions={platform.cta.actions}
          />
        </Reveal>
      </Section>
    </>
  );
}
