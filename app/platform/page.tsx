import type { Metadata } from 'next';
import { AssuranceCard } from '@/components/assurance/AssuranceCard';
import { ReplayPanel } from '@/components/assurance/ReplayPanel';
import { SentinelGate } from '@/components/demo/SentinelGate';
import { CTABlock } from '@/components/layout/CTABlock';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { FormusSandbox } from '@/components/sandbox/FormusSandbox';
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
      {/* hero */}
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

        <ul className="mt-8 flex flex-wrap gap-2">
          {platform.hero.chips.map((chip) => (
            <li
              key={chip.text}
              className={`mono border px-2.5 py-1.5 text-12 ${
                chip.tone === 'proof'
                  ? 'border-proof/40 bg-proof/8 text-proof-ink'
                  : 'border-hairline text-ink-400'
              }`}
            >
              {chip.text}
            </li>
          ))}
        </ul>
      </section>

      {/* what this is, and what it deliberately is not */}
      <Section label={platform.framing.rule.label} value={platform.framing.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{platform.framing.h2}</h2>
          <Prose className="mt-7">
            {platform.framing.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Reveal>

        <div className="mt-12 grid gap-px border border-hairline bg-hairline lg:grid-cols-2">
          <Reveal className="bg-slate-800 p-6 sm:p-8">
            <Eyebrow>{platform.framing.shows.label}</Eyebrow>
            <ul className="mt-5 border-t border-hairline">
              {platform.framing.shows.items.map((item) => (
                <li key={item} className="border-b border-hairline py-3 text-17 text-ink-100">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={60} className="bg-slate-900 p-6 sm:p-8">
            <Eyebrow>{platform.framing.hides.label}</Eyebrow>
            <ul className="mt-5 border-t border-hairline">
              {platform.framing.hides.items.map((item) => (
                <li key={item} className="border-b border-hairline py-3 text-17 text-ink-500">
                  {item}
                </li>
              ))}
            </ul>
            <p className="measure mt-5 text-14 text-ink-400">{platform.framing.hides.note}</p>
          </Reveal>
        </div>
      </Section>

      {/* formus sandbox */}
      <Section label={platform.formus.rule.label} value={platform.formus.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{platform.formus.h2}</h2>
          <Prose className="mt-7">
            {platform.formus.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Reveal>

        <div className="mt-10">
          <FormusSandbox />
        </div>

        <Reveal className="mt-8">
          <TryThis label={platform.formus.tryThis.label} items={platform.formus.tryThis.items} />
        </Reveal>
      </Section>

      {/* sentinel sandbox */}
      <Section label={platform.sentinel.rule.label} value={platform.sentinel.rule.value}>
        <Reveal>
          <h2 id="sentinel-sandbox" className="max-w-[24ch] text-28 sm:text-40">
            {platform.sentinel.h2}
          </h2>
          <Prose className="mt-7">
            {platform.sentinel.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Reveal>

        <div className="mt-10">
          <SentinelGate headingId="sentinel-sandbox" />
        </div>

        <Reveal className="mt-8">
          <TryThis
            label={platform.sentinel.tryThis.label}
            items={platform.sentinel.tryThis.items}
          />
        </Reveal>
      </Section>

      {/* the shared artifact */}
      <Section label={platform.artifact.rule.label} value={platform.artifact.rule.value}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16">
          <Reveal>
            <h2 className="max-w-[24ch] text-28 sm:text-40">{platform.artifact.h2}</h2>
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

      {/* the determinism contract */}
      <Section label={platform.determinism.rule.label} value={platform.determinism.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{platform.determinism.h2}</h2>
          <Prose className="mt-7">
            <p>{platform.determinism.body}</p>
          </Prose>
        </Reveal>

        <Reveal delay={60} className="mt-10">
          <div className="border border-hairline bg-slate-900 p-5 sm:p-7">
            <dl className="space-y-3">
              {platform.determinism.invariants.map((invariant) => (
                <div key={invariant.name} className="grid gap-1 sm:grid-cols-[16rem_1fr] sm:gap-6">
                  <dt className="mono text-14 text-ink-100">{invariant.name}</dt>
                  <dd className="mono text-14 text-ink-400">{invariant.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={90} className="mt-12">
          <h3 className="text-21">{platform.determinism.cost.h3}</h3>
          <Prose className="mt-4">
            <p>{platform.determinism.cost.body}</p>
          </Prose>
        </Reveal>
      </Section>

      {/* the limits */}
      <Section label={platform.limits.rule.label} value={platform.limits.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{platform.limits.h2}</h2>
          <Prose className="mt-7">
            <p>{platform.limits.body}</p>
          </Prose>
        </Reveal>

        <ul className="mt-10 border-t border-hairline">
          {platform.limits.items.map((item, index) => (
            <Reveal as="li" key={item.name} delay={index * 30}>
              <div className="grid gap-3 border-b border-hairline py-6 md:grid-cols-[minmax(0,24rem)_1fr] md:gap-10">
                <h3 className="text-21 text-ink-100">{item.name}</h3>
                <p className="measure text-17 text-ink-400">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* cta */}
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

/** The invitation to actually touch the thing above it. */
function TryThis({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="border border-proof/40 bg-proof/8 p-5 sm:p-6">
      <Eyebrow>{label}</Eyebrow>
      <ol className="mt-4 space-y-2.5">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3">
            <span className="mono shrink-0 text-12 text-proof-ink">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="measure text-17 text-ink-100">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
