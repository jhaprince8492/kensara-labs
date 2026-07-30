import type { Metadata } from 'next';
import { AssuranceCard } from '@/components/assurance/AssuranceCard';
import { CTABlock } from '@/components/layout/CTABlock';
import { PipelineStrip } from '@/components/pipeline/PipelineStrip';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { VerdictChip } from '@/components/primitives/VerdictChip';
import { WorkedExample } from '@/components/primitives/WorkedExample';
import { ProofGraphStill } from '@/components/scenes/ProofGraphStill';
import { assuranceBody } from '@/content/data/assuranceObject';
import { formus } from '@/content/copy/formus';
import { canonicalJson, sha256Hex } from '@/lib/hash';

export const metadata: Metadata = {
  title: formus.meta.title,
  description: formus.meta.description,
};

export default async function FormusPage() {
  const contentHash = await sha256Hex(canonicalJson(assuranceBody));

  return (
    <>
      {/* hero · Scene C, idle */}
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-16">
          <div>
            <Eyebrow>{formus.hero.eyebrow}</Eyebrow>
            <h1 className="mt-6 text-40 sm:text-60">
              {formus.hero.h1.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="measure mt-7 text-17 text-ink-400 sm:text-21">{formus.hero.sub}</p>
            <p className="mono mt-8 text-14 text-proof-ink">{formus.hero.readout}</p>
          </div>
          <ProofGraphStill className="w-full" />
        </div>
      </section>

      {/* what a verdict actually is · lead with REFUSE */}
      <Section label={formus.verdicts.rule.label} value={formus.verdicts.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{formus.verdicts.h2}</h2>
          <p className="measure mt-5 text-17 text-ink-400">{formus.verdicts.intro}</p>
        </Reveal>

        <ul className="mt-12 grid gap-px border border-hairline bg-hairline lg:grid-cols-3">
          {formus.verdicts.panels.map((panel, index) => (
            <Reveal as="li" key={panel.chip} delay={index * 50} className="bg-slate-900">
              <div className="flex h-full flex-col p-6 sm:p-7">
                <VerdictChip verdict={panel.chip} className="self-start" />
                <h3 className="mt-5 text-21">{panel.title}</h3>
                <p className="mt-4 text-17 text-ink-400">{panel.body}</p>
                <p className="mono mt-auto pt-6 text-12 text-ink-500">{panel.readout}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* the pipeline */}
      <Section label={formus.pipeline.rule.label} value={formus.pipeline.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{formus.pipeline.h2}</h2>
          <p className="measure mt-5 text-17 text-ink-400">{formus.pipeline.body}</p>
        </Reveal>
        <div className="mt-10">
          <PipelineStrip stages={formus.pipeline.stages} accent="proof" />
        </div>
      </Section>

      {/* the confirmation gate */}
      <Section label={formus.confirmation.rule.label} value={formus.confirmation.rule.value}>
        <Reveal>
          <h2 className="max-w-[26ch] text-28 sm:text-40">{formus.confirmation.h2}</h2>
          <Prose className="mt-7">
            <p>{formus.confirmation.body}</p>
          </Prose>
        </Reveal>

        <Reveal delay={60} className="mt-10">
          <div className="grid gap-px border border-hairline bg-hairline lg:grid-cols-2">
            <div className="bg-slate-900 p-6 sm:p-7">
              <Eyebrow>{formus.confirmation.claimLabel}</Eyebrow>
              <p className="mt-4 text-17 text-ink-100">{formus.confirmation.claim}</p>
            </div>
            <div className="bg-slate-900 p-6 sm:p-7">
              <Eyebrow>{formus.confirmation.renderedLabel}</Eyebrow>
              <p className="mt-4 text-17 text-ink-100">{formus.confirmation.rendered}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {formus.confirmation.actions.map((action, index) => (
                  <span
                    key={action}
                    className={`mono border px-3 py-2 text-14 ${
                      index === 0
                        ? 'border-proof/50 bg-proof/10 text-proof-ink'
                        : 'border-hairline text-ink-400'
                    }`}
                  >
                    {action}
                  </span>
                ))}
              </div>
              <p className="mono mt-4 text-12 text-ink-500">
                confirmation ui · shown as it appears in the product
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* minimisation */}
      <Section label={formus.minimisation.rule.label} value={formus.minimisation.rule.value}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16">
          <Reveal>
            <h2 className="text-28 sm:text-40">{formus.minimisation.h2}</h2>
            <Prose className="mt-7">
              <p>{formus.minimisation.body}</p>
            </Prose>
            <p className="mono mt-7 text-14 text-proof-ink">{formus.minimisation.readout}</p>
          </Reveal>
          <Reveal delay={60}>
            <div className="border border-hairline bg-slate-900 p-4">
              <ProofGraphStill className="w-full" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* worked example */}
      <Section label={formus.worked.rule.label} value={formus.worked.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{formus.worked.h2}</h2>
          <p className="measure mt-5 text-17 text-ink-400">{formus.worked.body}</p>
        </Reveal>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {formus.worked.cases.map((example, index) => (
            <Reveal as="li" key={example.chip} delay={index * 50}>
              <WorkedExample
                chip={example.chip}
                eyebrow={example.eyebrow}
                question={example.question}
                lines={example.lines}
                result={example.result}
              />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={80} className="mt-10">
          <AssuranceCard contentHash={contentHash} expandable />
        </Reveal>
      </Section>

      {/* solvers */}
      <Section label={formus.solvers.rule.label} value={formus.solvers.rule.value}>
        <Reveal>
          <h2 className="max-w-[26ch] text-28 sm:text-40">{formus.solvers.h2}</h2>
          <Prose className="mt-7">
            <p>{formus.solvers.body}</p>
          </Prose>
        </Reveal>

        <Reveal delay={60} className="mt-10">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-y border-hairline">
                <th scope="col" className="eyebrow py-3 pr-6">
                  SOLVER
                </th>
                <th scope="col" className="eyebrow py-3">
                  CLAIM SHAPE
                </th>
              </tr>
            </thead>
            <tbody>
              {formus.solvers.rows.map((row) => (
                <tr key={row.engine} className="border-b border-hairline">
                  <td className="mono py-3 pr-6 align-top text-14 text-ink-100">{row.engine}</td>
                  <td className="mono py-3 text-14 text-ink-400">{row.shape}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="eyebrow mt-8">{formus.solvers.outputsLabel}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {formus.solvers.outputs.map((output) => (
              <li
                key={output}
                className="mono border border-hairline px-2 py-1 text-12 text-ink-400"
              >
                {output}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* kvl */}
      <Section label={formus.kvl.rule.label} value={formus.kvl.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{formus.kvl.h2}</h2>
          <Prose className="mt-7">
            <p>{formus.kvl.body}</p>
          </Prose>
        </Reveal>
      </Section>

      {/* where formus applies */}
      <Section label={formus.applies.rule.label} value={formus.applies.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{formus.applies.h2}</h2>
        </Reveal>
        <ul className="mt-10 border-t border-hairline">
          {formus.applies.items.map((item, index) => (
            <Reveal as="li" key={item.sector} delay={index * 30}>
              <div className="grid gap-2 border-b border-hairline py-5 md:grid-cols-[18rem_1fr]">
                <p className="text-17 text-ink-100">{item.sector}</p>
                <p className="mono text-14 text-ink-400">{item.use}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* cta */}
      <Section label={formus.cta.rule.label} value={formus.cta.rule.value} className="pb-8">
        <Reveal>
          <CTABlock
            eyebrow={formus.cta.eyebrow}
            heading={formus.cta.heading}
            body={formus.cta.body}
            actions={formus.cta.actions}
          />
        </Reveal>
      </Section>
    </>
  );
}
