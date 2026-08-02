import Link from 'next/link';
import { AssuranceCard } from '@/components/assurance/AssuranceCard';
import { CinematicAct } from '@/components/cinema/CinematicAct';
import { ProblemMatrix } from '@/components/home/ProblemMatrix';
import { ShiftDiagram } from '@/components/home/ShiftDiagram';
import { TranslationBoundary } from '@/components/home/TranslationBoundary';
import { CTABlock } from '@/components/layout/CTABlock';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
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
      {/* Act I replaces the Scene A point cloud rather than sitting alongside
          it: the hero gets one visual. The Scene A description is reused
          verbatim as the act's label, because it describes the same image. */}
      <CinematicAct act={1} label={home.hero.sceneAlt}>
        <section className="relative flex min-h-[92vh] items-center overflow-hidden">
          <div className="relative mx-auto w-full max-w-[88rem] px-5 py-24 sm:px-8">
            <Eyebrow>{home.hero.eyebrow}</Eyebrow>

            <h1 className="mt-6 max-w-[26ch] text-40 sm:text-60">
              {home.hero.h1.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            {/* What the company sells, at display size rather than in a caption. */}
            <p className="measure mt-8 text-21 text-ink-100 sm:text-28">{home.hero.sub}</p>
            <p className="measure mt-4 text-17 text-ink-400">{home.hero.subDetail}</p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {home.hero.chips.map((chip) => (
                <li
                  key={chip.text}
                  className={`mono border px-2.5 py-1.5 text-12 ${
                    chip.tone === 'proof'
                      ? 'border-proof/40 bg-proof/8 text-proof-ink'
                      : 'border-refute/40 bg-refute/8 text-refute'
                  }`}
                >
                  {chip.text}
                </li>
              ))}
            </ul>

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

            <p className="mono mt-14 text-12 text-ink-500">
              {home.hero.counterLabel}{' '}
              <span className="text-ink-400">
                {SAMPLED_STATES} / {TOTAL_STATES.toLocaleString('en-US')}
              </span>
            </p>
          </div>
        </section>
      </CinematicAct>

      {/* ------------------------------------------------ H2 · the shift */}
      <CinematicAct act={2}>
        <Section label={home.shift.rule.label} value={home.shift.rule.value}>
          <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16">
            <Reveal>
              <h2 className="max-w-[22ch] text-28 sm:text-40">
                {home.shift.h2.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
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
      </CinematicAct>

      {/* ------------------------------------------------ H3 · the problem matrix */}
      <CinematicAct act={3}>
        <Section label={home.matrix.rule.label} value={home.matrix.rule.value}>
          <Reveal>
            <h2 className="max-w-[26ch] text-28 sm:text-40">{home.matrix.h2}</h2>
            <Prose className="mt-7">
              <p>{home.matrix.body}</p>
            </Prose>
          </Reveal>

          <div className="mt-14">
            <ProblemMatrix />
          </div>
        </Section>
      </CinematicAct>

      {/* ------------------------------------------------ H4 · the turn */}
      <CinematicAct act={4}>
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
      </CinematicAct>

      {/* ------------------------------------------------ H5 · two engines */}
      <CinematicAct act={5}>
        <Section label={home.system.rule.label} value={home.system.rule.value}>
          <Reveal>
            <h2 className="text-28 sm:text-40">{home.system.h2}</h2>
          </Reveal>

          <div className="mt-12 grid gap-px border border-hairline bg-hairline lg:grid-cols-2">
            {[home.system.formus, home.system.sentinel].map((engine, index) => (
              <Reveal key={engine.title} delay={index * 60} className="bg-slate-900 p-7 sm:p-9">
                <Eyebrow>{engine.eyebrow}</Eyebrow>
                <h3 className="mt-4 text-28">{engine.title}</h3>
                <p className="measure mt-4 text-17 text-ink-400">{engine.body}</p>

                <p className="mt-7 text-21 text-ink-100">{engine.hook}</p>
                <p
                  className={`mono mt-3 text-14 ${
                    index === 0 ? 'text-proof-ink' : 'text-gate'
                  }`}
                >
                  {engine.readout}
                </p>
                <p className="measure mt-3 text-14 text-ink-500">{engine.gloss}</p>

                <Link
                  href={engine.cta.href}
                  className="mono mt-7 inline-block border border-hairline px-3 py-2 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-ink-600 hover:text-ink-100"
                >
                  {engine.cta.label}
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      </CinematicAct>

      {/* ------------------------------------------------ H7 · the artifact */}
      <CinematicAct act={6}>
        <Section label={home.artifact.rule.label} value={home.artifact.rule.value}>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,32rem)_1fr] lg:gap-16">
            <Reveal>
              <h2 className="max-w-[24ch] text-28 sm:text-40">{home.artifact.h2}</h2>

              <p className="measure mt-7 text-17 text-ink-100">{home.artifact.lead}</p>
              <ul className="measure mt-4 border-t border-hairline">
                {home.artifact.binds.map((bind) => (
                  <li key={bind} className="border-b border-hairline py-3 text-17 text-ink-400">
                    {bind}
                  </li>
                ))}
              </ul>

              <p className="measure mt-6 text-17 text-ink-400">{home.artifact.body}</p>

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
      </CinematicAct>

      {/* ------------------------------------------------ H8 · where it runs */}
      <CinematicAct act={7}>
        <Section label={home.industries.rule.label} value={home.industries.rule.value}>
          <Reveal>
            <h2 className="text-28 sm:text-40">{home.industries.h2}</h2>
          </Reveal>

          <ul className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {home.industries.tiles.map((tile, index) => (
              <Reveal as="li" key={tile.name} delay={index * 30} className="bg-slate-900">
                <Link
                  href={tile.href}
                  className="block h-full p-6 transition-colors duration-[120ms] hover:bg-slate-800"
                >
                  <Eyebrow>{tile.standards}</Eyebrow>
                  <p className="mt-3 text-21 text-ink-100">{tile.name}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      </CinematicAct>

      {/* ------------------------------------------------ H9 · close */}
      <CinematicAct act={8}>
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
      </CinematicAct>
    </>
  );
}
