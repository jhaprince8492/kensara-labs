import type { Metadata } from 'next';
import { RequestAccessForm } from '@/components/demo/RequestAccessForm';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { demo } from '@/content/copy/demo';

export const metadata: Metadata = {
  title: demo.meta.title,
  description: demo.meta.description,
};

export default function DemoPage() {
  return (
    <>
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <Eyebrow>{demo.hero.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-[20ch] text-40 sm:text-60">
          {demo.hero.h1.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="measure mt-7 text-17 text-ink-400 sm:text-21">{demo.hero.sub}</p>
      </section>

      <Section label={demo.expect.rule.label} value={demo.expect.rule.value}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{demo.expect.h2}</h2>
        </Reveal>
        <ul className="mt-10 border-t border-hairline">
          {demo.expect.items.map((item, index) => (
            <Reveal as="li" key={item.name} delay={index * 40}>
              <div className="grid gap-3 border-b border-hairline py-6 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-10">
                <h3 className="text-21 text-ink-100">{item.name}</h3>
                <p className="measure text-17 text-ink-400">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section label={demo.form.rule.label} value={demo.form.rule.value} className="pb-8">
        <Reveal>
          <h2 className="text-28 sm:text-40">{demo.form.h2}</h2>
          <p className="measure mt-5 text-17 text-ink-400">{demo.form.body}</p>
        </Reveal>
        <div className="mt-10 max-w-[52rem]">
          <RequestAccessForm />
        </div>
      </Section>
    </>
  );
}
