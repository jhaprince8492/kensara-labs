import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { security } from '@/content/copy/security';
import { certifications, securityContact, subProcessors } from '@/content/data/security';

export const metadata: Metadata = {
  title: security.meta.title,
  description: security.meta.description,
};

export default function SecurityPage() {
  return (
    <>
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <Eyebrow>{security.hero.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] text-40 sm:text-60">
          {security.hero.h1.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="measure mt-7 text-17 text-ink-400 sm:text-21">{security.hero.sub}</p>
      </section>

      {/* deployment models */}
      <Section label={security.deployment.rule.label} value={security.deployment.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{security.deployment.h2}</h2>
          <p className="measure mt-5 text-17 text-ink-400">{security.deployment.body}</p>
        </Reveal>

        <ul className="mt-12 grid gap-px border border-hairline bg-hairline lg:grid-cols-3">
          {security.deployment.models.map((model, index) => (
            <Reveal as="li" key={model.name} delay={index * 50} className="bg-slate-900">
              <div className="flex h-full flex-col p-6 sm:p-7">
                <Eyebrow>{model.note}</Eyebrow>
                <h3 className="mt-4 text-21">{model.name}</h3>
                <p className="mt-4 text-17 text-ink-400">{model.body}</p>
                <dl className="mt-auto space-y-3 pt-6">
                  <div>
                    <dt className="eyebrow">CROSSES THE BOUNDARY</dt>
                    <dd className="mono mt-1 text-12 text-ink-400">{model.leaves}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow">NEVER LEAVES</dt>
                    <dd className="mono mt-1 text-12 text-gate">{model.stays}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* data handling */}
      <Section label={security.data.rule.label} value={security.data.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{security.data.h2}</h2>
          <Prose className="mt-7" tone="primary">
            {security.data.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
          <p className="measure mt-5 text-17 text-ink-400">{security.data.residency}</p>
        </Reveal>

        <Reveal delay={60} className="mt-10">
          <ul className="border-t border-hairline">
            {security.data.rows.map((row) => (
              <li
                key={row.item}
                className="grid gap-2 border-b border-hairline py-4 md:grid-cols-[22rem_1fr] md:gap-8"
              >
                <span className="text-17 text-ink-100">{row.item}</span>
                <span className="mono text-14 text-ink-400">{row.handling}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* key management */}
      <Section label={security.keys.rule.label} value={security.keys.rule.value}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="max-w-[22ch] text-28 sm:text-40">{security.keys.h2}</h2>
            <Prose className="mt-7">
              <p>{security.keys.body}</p>
            </Prose>
          </Reveal>
          <Reveal delay={60} className="self-center">
            <ul className="border border-hairline bg-slate-900 p-6">
              {security.keys.points.map((point) => (
                <li
                  key={point}
                  className="mono border-b border-hairline py-3 text-14 text-ink-400 last:border-b-0"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* ledger integrity */}
      <Section label={security.ledger.rule.label} value={security.ledger.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{security.ledger.h2}</h2>
          <Prose className="mt-7">
            <p>{security.ledger.body}</p>
          </Prose>
        </Reveal>
      </Section>

      {/* certification status */}
      <Section label={security.certifications.rule.label} value={security.certifications.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{security.certifications.h2}</h2>
          {certifications.length === 0 ? (
            <Prose className="mt-7">
              <p>{security.certifications.empty}</p>
            </Prose>
          ) : (
            <ul className="mt-10 border-t border-hairline">
              {certifications.map((certification) => (
                <li
                  key={certification.name}
                  className="grid gap-2 border-b border-hairline py-4 md:grid-cols-[16rem_14rem_1fr]"
                >
                  <span className="mono text-14 text-ink-100">{certification.name}</span>
                  <span className="mono text-14 text-hold">{certification.status}</span>
                  <span className="text-14 text-ink-400">{certification.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </Section>

      {/* sub-processors */}
      <Section label={security.subProcessors.rule.label} value={security.subProcessors.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{security.subProcessors.h2}</h2>
          {subProcessors.length === 0 ? (
            <Prose className="mt-7">
              <p>{security.subProcessors.empty}</p>
            </Prose>
          ) : (
            <ul className="mt-10 border-t border-hairline">
              {subProcessors.map((processor) => (
                <li
                  key={processor.name}
                  className="grid gap-2 border-b border-hairline py-4 md:grid-cols-[14rem_1fr_10rem_16rem]"
                >
                  <span className="text-17 text-ink-100">{processor.name}</span>
                  <span className="text-14 text-ink-400">{processor.purpose}</span>
                  <span className="mono text-14 text-ink-500">{processor.region}</span>
                  <span className="mono text-14 text-ink-400">{processor.dataTouched}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </Section>

      {/* disclosure */}
      <Section label={security.disclosure.rule.label} value={security.disclosure.rule.value} className="pb-8">
        <Reveal>
          <h2 className="text-28 sm:text-40">{security.disclosure.h2}</h2>
          <Prose className="mt-7">
            <p>{security.disclosure.body}</p>
          </Prose>
          {securityContact ? (
            <p className="mono mt-8 text-17 text-proof-ink">{securityContact}</p>
          ) : (
            <Link
              href="/demo/"
              className="mono mt-8 inline-block border border-hairline px-4 py-2.5 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-proof hover:text-proof-ink"
            >
              {security.disclosure.fallbackCta}
            </Link>
          )}
        </Reveal>
      </Section>
    </>
  );
}
