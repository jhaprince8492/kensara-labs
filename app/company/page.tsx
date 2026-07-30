import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { company } from '@/content/copy/company';
import { site } from '@/content/copy/site';
import { team } from '@/content/data/team';

export const metadata: Metadata = {
  title: company.meta.title,
  description: company.meta.description,
};

export default function CompanyPage() {
  return (
    <>
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <Eyebrow>{company.hero.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] text-40 sm:text-60">
          {company.hero.h1.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </section>

      <Section label={company.why.rule.label} value={company.why.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{company.why.h2}</h2>
          <Prose className="mt-7" tone="primary">
            {company.why.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Reveal>
      </Section>

      <Section label={company.team.rule.label} value={company.team.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{company.team.h2}</h2>
          <p className="measure mt-5 text-17 text-ink-400">{company.team.body}</p>
        </Reveal>

        <ul className="mt-12 grid gap-px border border-hairline bg-hairline lg:grid-cols-2">
          {team.map((person, index) => (
            <Reveal as="li" key={person.name} delay={index * 50} className="bg-slate-900">
              <div className="h-full p-6 sm:p-8">
                <Eyebrow>{person.credential}</Eyebrow>
                <h3 className="mt-4 text-28">{person.name}</h3>
                <p className="mono mt-2 text-14 text-ink-500">{person.role}</p>
                <p className="measure mt-5 text-17 text-ink-400">{person.owns}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section label={company.research.rule.label} value={company.research.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{company.research.h2}</h2>
        </Reveal>
        <ul className="mt-10 border-t border-hairline">
          {company.research.items.map((item, index) => (
            <Reveal as="li" key={item.name} delay={index * 40}>
              <div className="grid gap-3 border-b border-hairline py-6 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-10">
                <h3 className="text-21 text-ink-100">{item.name}</h3>
                <p className="measure text-17 text-ink-400">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section label={company.principles.rule.label} value={company.principles.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{company.principles.h2}</h2>
        </Reveal>
        <ul className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
          {company.principles.items.map((item, index) => (
            <Reveal as="li" key={item.name} delay={index * 40} className="bg-slate-900">
              <div className="h-full p-6 sm:p-7">
                <h3 className="text-21 text-ink-100">{item.name}</h3>
                <p className="mt-4 text-17 text-ink-400">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section label={company.careers.rule.label} value={company.careers.rule.value} className="pb-8">
        <Reveal>
          <h2 className="text-28 sm:text-40">{company.careers.h2}</h2>
          <Prose className="mt-7">
            <p>{company.careers.body}</p>
          </Prose>
          <Link
            href={site.cta.href}
            className="mono mt-8 inline-block border border-hairline px-4 py-2.5 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-proof hover:text-proof-ink"
          >
            Tell us which one you would argue with
          </Link>
        </Reveal>
      </Section>
    </>
  );
}
