import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CTABlock } from '@/components/layout/CTABlock';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { WorkedExample } from '@/components/primitives/WorkedExample';
import { findSector, publishedSectors } from '@/content/data/industries';

interface Params {
  params: Promise<{ sector: string }>;
}

export function generateStaticParams() {
  return publishedSectors.map((sector) => ({ sector: sector.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sector: slug } = await params;
  const sector = findSector(slug);
  if (!sector?.page) return {};

  return {
    title: sector.name,
    description: sector.page.failure,
  };
}

export default async function SectorPage({ params }: Params) {
  const { sector: slug } = await params;
  const sector = findSector(slug);
  if (!sector?.page) notFound();

  const page = sector.page;

  return (
    <>
      {/* 1 · the specific failure mode */}
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <Eyebrow>{`${sector.name.toUpperCase()} · ${sector.standards.toUpperCase()}`}</Eyebrow>
        <h1 className="measure mt-6 text-28 sm:text-40 lg:text-60">{page.failure}</h1>
      </section>

      {/* 2 · the regulation */}
      <Section label="REGULATION" value={`${page.regulation.clauses.length} clauses`}>
        <Reveal>
          <h2 className="text-28 sm:text-40">The clauses that govern it.</h2>
          <Prose className="mt-7">
            <p>{page.regulation.intro}</p>
          </Prose>
        </Reveal>

        <Reveal delay={60} className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr className="border-y border-hairline">
                <th scope="col" className="eyebrow py-3 pr-6">STANDARD</th>
                <th scope="col" className="eyebrow py-3 pr-6">CLAUSE</th>
                <th scope="col" className="eyebrow py-3">WHAT IT REQUIRES</th>
              </tr>
            </thead>
            <tbody>
              {page.regulation.clauses.map((clause) => (
                <tr key={`${clause.standard}-${clause.clause}`} className="border-b border-hairline">
                  <td className="mono py-3 pr-6 align-top text-14 text-ink-100">{clause.standard}</td>
                  <td className="mono py-3 pr-6 align-top text-14 text-ink-400">{clause.clause}</td>
                  <td className="py-3 align-top text-14 text-ink-400">{clause.requires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Section>

      {/* 3 · three concrete workflows */}
      <Section label="WORKFLOWS" value="3">
        <Reveal>
          <h2 className="text-28 sm:text-40">Three workflows, and the artifact each leaves.</h2>
        </Reveal>

        <ul className="mt-12 border-t border-hairline">
          {page.workflows.map((workflow, index) => (
            <Reveal as="li" key={workflow.name} delay={index * 40}>
              <div className="grid gap-4 border-b border-hairline py-7 lg:grid-cols-[minmax(0,22rem)_1fr_minmax(0,18rem)] lg:gap-10">
                <div>
                  <span
                    className={`mono text-12 tracking-[0.14em] ${
                      workflow.engine === 'Formus' ? 'text-proof-ink' : 'text-gate'
                    }`}
                  >
                    {workflow.engine.toUpperCase()}
                  </span>
                  <h3 className="mt-2 text-21 text-ink-100">{workflow.name}</h3>
                </div>
                <p className="measure text-17 text-ink-400">{workflow.detail}</p>
                <div>
                  <p className="eyebrow">ARTIFACT</p>
                  <p className="mono mt-2 text-14 text-ink-400">{workflow.artifact}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 4 · one worked mini-example */}
      <Section label="WORKED EXAMPLE" value="one decision">
        <Reveal>
          <h2 className="text-28 sm:text-40">One decision, in full.</h2>
        </Reveal>
        <Reveal delay={60} className="mt-10 max-w-[46rem]">
          <WorkedExample
            chip={page.example.chip}
            eyebrow={page.example.eyebrow}
            question={page.example.question}
            lines={page.example.lines}
            result={page.example.result}
          />
        </Reveal>
      </Section>

      {/* 5 · the boundary */}
      <Section label="BOUNDARY" value={`${page.boundary.items.length} limits`}>
        <Reveal>
          <h2 className="text-28 sm:text-40">{page.boundary.intro}</h2>
        </Reveal>
        <ul className="mt-10 border-t border-hairline">
          {page.boundary.items.map((item, index) => (
            <Reveal as="li" key={item} delay={index * 30}>
              <p className="measure border-b border-hairline py-5 text-17 text-ink-100">{item}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 6 · cta */}
      <Section label="NEXT" value="45 min" className="pb-8">
        <Reveal>
          <CTABlock
            eyebrow="SCOPING CALL · 45 MIN"
            heading={page.cta.heading}
            body={page.cta.body}
            actions={[
              { label: 'Request access', href: '/demo/', kind: 'primary' as const },
              { label: 'See all sectors', href: '/industries/', kind: 'secondary' as const },
            ]}
          />
        </Reveal>
      </Section>
    </>
  );
}
