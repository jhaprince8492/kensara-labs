import Link from 'next/link';
import { AssuranceCard } from '@/components/assurance/AssuranceCard';
import { SentinelGate } from '@/components/demo/SentinelGate';
import { ShiftDiagram } from '@/components/home/ShiftDiagram';
import { TranslationBoundary } from '@/components/home/TranslationBoundary';
import { CTABlock } from '@/components/layout/CTABlock';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { StateSpace } from '@/components/scenes/StateSpace';
import { assuranceBody } from '@/content/data/assuranceObject';
import { home } from '@/content/copy/home';
import { canonicalJson, sha256Hex } from '@/lib/hash';
import { SAMPLED_STATES, TOTAL_STATES } from '@/lib/scenes/stateSpace';

export default async function HomePage() {
  // Computed at build time from the same body the card renders, then
  // recomputed in the browser when a visitor presses verify.
  const contentHash = await sha256Hex(canonicalJson(assuranceBody));

  return (
    <>
      {/* ------------------------------------------------ H1 · the state space */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <StateSpace />

        <div className="relative mx-auto w-full max-w-[88rem] px-5 py-24 sm:px-8">
          <Eyebrow>{home.hero.eyebrow}</Eyebrow>

          <h1 className="mt-6 max-w-[18ch] text-40 sm:text-60 lg:text-88">
            {home.hero.h1.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="measure mt-8 text-17 text-ink-400 sm:text-21">{home.hero.sub}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={home.hero.primaryCta.href}
              className="mono border border-proof/50 bg-proof/10 px-4 py-2.5 text-14 text-proof-ink transition-colors duration-[120ms] hover:border-proof hover:bg-proof/15"
            >
              {home.hero.primaryCta.label}
            </Link>
            <Link
              href={home.hero.secondaryCta.href}
              className="mono border border-hairline px-4 py-2.5 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-ink-600 hover:text-ink-100"
            >
              {home.hero.secondaryCta.label}
            </Link>
          </div>

          <p className="mono mt-16 text-12 text-ink-500">
            {home.hero.counterLabel}{' '}
            <span className="text-ink-400">
              {SAMPLED_STATES} / {TOTAL_STATES.toLocaleString('en-US')}
            </span>
          </p>

          {/* Text equivalent for the canvas. */}
          <p className="sr-only">{home.hero.sceneAlt}</p>
        </div>
      </section>

      {/* ------------------------------------------------ H2 · the shift */}
      <Section label={home.shift.rule.label} value={home.shift.rule.value}>
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16">
          <Reveal>
            <h2 className="max-w-[20ch] text-28 sm:text-40">{home.shift.h2}</h2>
            <Prose className="mt-7">
              {home.shift.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>
          </Reveal>
          <Reveal delay={60} className="self-center">
            <ShiftDiagram />
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------ H3 · the cost */}
      <Section label={home.cost.rule.label} value={home.cost.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{home.cost.h2}</h2>
        </Reveal>

        <ul className="mt-12 border-t border-hairline">
          {home.cost.cards.map((card, index) => (
            <Reveal as="li" key={card.eyebrow} delay={index * 40}>
              <div
                tabIndex={0}
                className="group grid gap-4 border-b border-hairline py-7 transition-colors duration-[120ms] hover:border-ink-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-proof md:grid-cols-[14rem_1fr]"
              >
                <Eyebrow as="p" className="pt-1">
                  {card.eyebrow}
                </Eyebrow>
                <div>
                  <p className="measure text-17 text-ink-100">{card.line}</p>
                  <p className="mono mt-3 text-14 text-ink-400 transition-opacity duration-[120ms] group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:opacity-0">
                    {card.counterfactual}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------ H4 · the turn */}
      <Section label={home.turn.rule.label} value={home.turn.rule.value}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="max-w-[18ch] text-28 sm:text-40">{home.turn.h2}</h2>
            <Prose className="mt-7">
              {home.turn.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>
          </Reveal>
          <Reveal delay={60} className="self-center">
            <TranslationBoundary />
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------ H5 · the system */}
      <Section id="gate" label={home.system.rule.label} value={home.system.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{home.system.h2}</h2>
        </Reveal>

        <div className="mt-12 grid gap-px border border-hairline bg-hairline lg:grid-cols-2">
          {[home.system.formus, home.system.sentinel].map((engine, index) => (
            <Reveal key={engine.title} delay={index * 60} className="bg-slate-900 p-7 sm:p-9">
              <Eyebrow>{engine.eyebrow}</Eyebrow>
              <h3 className="mt-4 text-28">{engine.title}</h3>
              <p className="measure mt-4 text-17 text-ink-400">{engine.body}</p>
              <p
                className={`mono mt-6 text-14 ${
                  index === 0 ? 'text-proof-ink' : 'text-gate'
                }`}
              >
                {engine.readout}
              </p>
              <Link
                href={engine.cta.href}
                className="mono mt-7 inline-block border border-hairline px-3 py-2 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-ink-600 hover:text-ink-100"
              >
                {engine.cta.label}
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 id="gate-demo" className="text-21 sm:text-28">
              {home.system.demo.title}
            </h3>
            <p className="measure mt-3 text-17 text-ink-400">{home.system.demo.body}</p>
          </Reveal>
          <div className="mt-8">
            <SentinelGate headingId="gate-demo" />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------ H6 · the artifact */}
      <Section label={home.artifact.rule.label} value={home.artifact.rule.value}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,32rem)_1fr] lg:gap-16">
          <Reveal>
            <h2 className="max-w-[20ch] text-28 sm:text-40">{home.artifact.h2}</h2>
            <Prose className="mt-7">
              {home.artifact.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>
            <ul className="mt-6 flex flex-wrap gap-2">
              {home.artifact.clauses.map((clause) => (
                <li
                  key={clause}
                  className="mono border border-hairline px-2 py-1 text-12 text-ink-400"
                >
                  {clause}
                </li>
              ))}
            </ul>
            <Link
              href={home.artifact.cta.href}
              className="mono mt-8 inline-block border border-hairline px-3 py-2 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-proof hover:text-proof-ink"
            >
              {home.artifact.cta.label}
            </Link>
          </Reveal>

          <Reveal delay={60}>
            <AssuranceCard contentHash={contentHash} expandable />
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------ H7 · where it runs */}
      <Section label={home.industries.rule.label} value={home.industries.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{home.industries.h2}</h2>
        </Reveal>

        <ul className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {home.industries.tiles.map((tile, index) => (
            <Reveal as="li" key={tile.name} delay={index * 30} className="bg-slate-900">
              <div className="h-full p-6">
                <Eyebrow>{tile.standards}</Eyebrow>
                <p className="mt-3 text-21 text-ink-100">{tile.name}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------ H8 · close */}
      <Section label={home.close.rule.label} value={home.close.rule.value} className="pb-8">
        <Reveal>
          <CTABlock
            eyebrow="SCOPING CALL · 45 MIN"
            heading={home.close.h2}
            body={home.close.body}
            actions={home.close.ctas}
          />
        </Reveal>
      </Section>
    </>
  );
}
