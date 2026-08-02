import type { Metadata } from 'next';
import { AssuranceCard } from '@/components/assurance/AssuranceCard';
import { FidelityReport } from '@/components/formus/FidelityReport';
import { WorkedChain } from '@/components/formus/WorkedChain';
import { CTABlock } from '@/components/layout/CTABlock';
import { PipelineStrip } from '@/components/pipeline/PipelineStrip';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { WorkedExample } from '@/components/primitives/WorkedExample';
import { ProofGraph } from '@/components/scenes/ProofGraph';
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
      {/* hero */}
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,36rem)_1fr] lg:gap-16">
          <div>
            <Eyebrow>{formus.hero.eyebrow}</Eyebrow>
            <h1 className="mt-6 max-w-[22ch] text-40 sm:text-60">
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

      {/* the gap */}
      <Section label={formus.gap.rule.label} value={formus.gap.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{formus.gap.h2}</h2>
          <Prose className="mt-7">
            {formus.gap.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Reveal>

        <ul className="mt-12 grid gap-px border border-hairline bg-hairline lg:grid-cols-2">
          {formus.gap.panels.map((panel, index) => (
            <Reveal as="li" key={panel.label} delay={index * 60} className="bg-slate-900">
              <div className="h-full p-6 sm:p-8">
                <Eyebrow>{panel.label}</Eyebrow>
                <h3 className="mt-4 text-21 text-ink-100">{panel.title}</h3>
                <ul className="mt-5 border-t border-hairline">
                  {panel.items.map((item) => (
                    <li
                      key={item}
                      className={`mono border-b border-hairline py-3 text-14 ${
                        panel.tone === 'proof' ? 'text-ink-100' : 'text-ink-500'
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* the bottleneck */}
      <Section label={formus.bottleneck.rule.label} value={formus.bottleneck.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{formus.bottleneck.h2}</h2>
          <Prose className="mt-7">
            {formus.bottleneck.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
          <p className="mono mt-8 text-14 text-ink-400">{formus.bottleneck.readout}</p>
        </Reveal>
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

      {/* who decides */}
      <Section label={formus.authority.rule.label} value={formus.authority.rule.value}>
        <Reveal>
          <h2 className="max-w-[26ch] text-28 sm:text-40">{formus.authority.h2}</h2>
          <Prose className="mt-7">
            <p>{formus.authority.body}</p>
          </Prose>
        </Reveal>

        <ul className="mt-12 grid gap-px border border-hairline bg-hairline lg:grid-cols-3">
          {formus.authority.steps.map((step, index) => (
            <Reveal as="li" key={step.actor} delay={index * 50} className="bg-slate-900">
              <div className="flex h-full flex-col p-6 sm:p-7">
                <h3 className="text-21 text-ink-100">{step.actor}</h3>
                <p
                  className={`mono mt-2 text-12 ${
                    step.authority === 'none' ? 'text-ink-500' : 'text-proof-ink'
                  }`}
                >
                  authority: {step.authority}
                </p>
                <p className="mt-5 text-17 text-ink-400">{step.action}</p>
                <p className="mono mt-auto pt-6 text-12 text-ink-500">{step.output}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={80} className="mt-10">
          <p className="measure text-17 text-ink-100">{formus.authority.closing}</p>
        </Reveal>
      </Section>

      {/* the fidelity report */}
      <Section label={formus.fidelity.rule.label} value={formus.fidelity.rule.value}>
        <Reveal>
          <h2 className="max-w-[26ch] text-28 sm:text-40">{formus.fidelity.h2}</h2>
          <Prose className="mt-7">
            {formus.fidelity.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Reveal>
        <Reveal delay={60} className="mt-10">
          <FidelityReport />
        </Reveal>
      </Section>

      {/* worked example, end to end */}
      <Section label={formus.worked.rule.label} value={formus.worked.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{formus.worked.h2}</h2>
          <p className="measure mt-5 text-17 text-ink-400">{formus.worked.body}</p>
        </Reveal>

        <div className="mt-10">
          <WorkedChain />
        </div>

        <ul className="mt-12 grid gap-6 lg:grid-cols-2">
          {formus.worked.variants.map((variant, index) => (
            <Reveal as="li" key={variant.chip} delay={index * 50}>
              <WorkedExample
                chip={variant.chip}
                eyebrow={variant.eyebrow}
                question={variant.question}
                lines={variant.lines}
                result={variant.result}
              />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* the minimisation, and the scene that shows it */}
      <Section label="MINIMISATION" value="412 → 4">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16">
          <Reveal>
            <h2 className="text-28 sm:text-40">412 rules went in. Four came out.</h2>
            <Prose className="mt-7">
              <p>
                The certificate a checker returns is not the whole rule base. It is the minimal
                set that was actually responsible for the result, which is also, conveniently,
                the explanation. An assessor reads four rules, not four hundred.
              </p>
            </Prose>
            <p className="mono mt-7 text-14 text-proof-ink">
              unsat core · R-0087 · R-0141 · R-0302 · R-0398
            </p>
          </Reveal>
          <Reveal delay={60}>
            <ProofGraph label="Scene C, the proof graph" />
          </Reveal>
        </div>
      </Section>

      {/* the evidence */}
      <Section label={formus.evidence.rule.label} value={formus.evidence.rule.value}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,32rem)_1fr] lg:gap-16">
          <Reveal>
            <h2 className="max-w-[24ch] text-28 sm:text-40">{formus.evidence.h2}</h2>
            <Prose className="mt-7">
              {formus.evidence.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>

            <table className="mt-8 w-full border-collapse text-left">
              <thead>
                <tr className="border-y border-hairline">
                  <th scope="col" className="eyebrow py-3 pr-6">STANDARD</th>
                  <th scope="col" className="eyebrow py-3 pr-6">CLAUSE</th>
                  <th scope="col" className="eyebrow py-3">SATISFIES</th>
                </tr>
              </thead>
              <tbody>
                {formus.evidence.clauses.map((row) => (
                  <tr key={`${row.standard}-${row.clause}`} className="border-b border-hairline">
                    <td className="mono py-3 pr-6 align-top text-14 text-ink-100">
                      {row.standard}
                    </td>
                    <td className="mono py-3 pr-6 align-top text-14 text-ink-400">{row.clause}</td>
                    <td className="py-3 align-top text-14 text-ink-400">{row.satisfies}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <Reveal delay={60}>
            <AssuranceCard contentHash={contentHash} expandable />
          </Reveal>
        </div>
      </Section>

      {/* continuous proof */}
      <Section label={formus.continuous.rule.label} value={formus.continuous.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{formus.continuous.h2}</h2>
          <Prose className="mt-7">
            {formus.continuous.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
          <p className="mono mt-8 text-14 text-proof-ink">{formus.continuous.readout}</p>
          <p className="measure mt-6 text-17 text-ink-100">{formus.continuous.note}</p>
        </Reveal>
      </Section>

      {/* where formus runs */}
      <Section label={formus.domains.rule.label} value={formus.domains.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{formus.domains.h2}</h2>
        </Reveal>

        <div className="mt-12 space-y-px bg-hairline">
          {formus.domains.items.map((domain, index) => (
            <Reveal key={domain.name} delay={index * 50} className="bg-slate-900">
              <article className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12">
                <div>
                  <Eyebrow>{domain.eyebrow}</Eyebrow>
                  <h3 className="mt-3 text-28 text-ink-100">{domain.name}</h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {domain.standards.map((standard) => (
                      <li
                        key={standard}
                        className="mono border border-hairline px-2 py-1 text-12 text-ink-400"
                      >
                        {standard}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="measure text-17 text-ink-400">{domain.body}</p>
                  <p className="mono mt-5 text-14 text-proof-ink">{domain.readout}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* compatibility and KVL */}
      <Section label={formus.compatibility.rule.label} value={formus.compatibility.rule.value}>
        <Reveal>
          <h2 className="max-w-[26ch] text-28 sm:text-40">{formus.compatibility.h2}</h2>
          <Prose className="mt-7">
            <p>{formus.compatibility.body}</p>
          </Prose>
        </Reveal>

        <Reveal delay={60} className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
          <div className="bg-slate-900 p-6">
            <Eyebrow>{formus.compatibility.solversLabel}</Eyebrow>
            <ul className="mt-4 flex flex-wrap gap-2">
              {formus.compatibility.solvers.map((solver) => (
                <li
                  key={solver}
                  className="mono border border-hairline px-2 py-1 text-12 text-ink-400"
                >
                  {solver}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900 p-6">
            <Eyebrow>{formus.compatibility.formatsLabel}</Eyebrow>
            <ul className="mt-4 flex flex-wrap gap-2">
              {formus.compatibility.formats.map((format) => (
                <li
                  key={format}
                  className="mono border border-hairline px-2 py-1 text-12 text-ink-400"
                >
                  {format}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-6">
          <p className="measure text-17 text-ink-100">{formus.compatibility.note}</p>
        </Reveal>

        <Reveal delay={100} className="mt-14 border-t border-hairline pt-10">
          <h3 className="max-w-[24ch] text-21 sm:text-28">{formus.compatibility.kvl.h3}</h3>
          <Prose className="mt-5">
            <p>{formus.compatibility.kvl.body}</p>
          </Prose>
        </Reveal>
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
