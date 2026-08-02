import type { Metadata } from 'next';
import { SentinelGate } from '@/components/demo/SentinelGate';
import { CTABlock } from '@/components/layout/CTABlock';
import { LedgerTick } from '@/components/layout/LedgerTick';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Prose } from '@/components/primitives/Prose';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { Gate } from '@/components/scenes/Gate';
import { sentinel } from '@/content/copy/sentinel';

export const metadata: Metadata = {
  title: sentinel.meta.title,
  description: sentinel.meta.description,
};

export default function SentinelPage() {
  return (
    <>
      {/* hero · Scene B */}
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <Eyebrow>{sentinel.hero.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-[20ch] text-40 sm:text-60">
          {sentinel.hero.h1.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="measure mt-7 text-17 text-ink-400 sm:text-21">{sentinel.hero.sub}</p>
        <p className="mono mt-8 text-14 text-refute">{sentinel.hero.readout}</p>

        <Gate className="mt-14" />
      </section>

      {/* the bypass problem */}
      <Section label={sentinel.bypass.rule.label} value={sentinel.bypass.rule.value}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,32rem)_1fr] lg:gap-16">
          <Reveal>
            <h2 className="max-w-[20ch] text-28 sm:text-40">{sentinel.bypass.h2}</h2>
            <Prose className="mt-7">
              {sentinel.bypass.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>
          </Reveal>

          <Reveal delay={60} className="self-center">
            <div className="border border-hairline bg-slate-900 p-6">
              <ol className="space-y-px">
                {[
                  { name: sentinel.bypass.diagram.agent, note: sentinel.bypass.diagram.agentNote, tone: 'ink' },
                  { name: sentinel.bypass.diagram.gate, note: sentinel.bypass.diagram.gateNote, tone: 'gate' },
                  { name: sentinel.bypass.diagram.tool, note: null, tone: 'ink' },
                ].map((node, index) => (
                  <li key={node.name}>
                    <div
                      className={`flex flex-wrap items-baseline justify-between gap-3 border px-4 py-4 ${
                        node.tone === 'gate'
                          ? 'border-gate/50 bg-gate/5'
                          : 'border-hairline bg-slate-800'
                      }`}
                    >
                      <span className="mono text-14 text-ink-100">{node.name}</span>
                      {node.note ? (
                        <span
                          className={`mono text-12 ${
                            node.tone === 'gate' ? 'text-gate' : 'text-ink-500'
                          }`}
                        >
                          {node.note}
                        </span>
                      ) : null}
                    </div>
                    {index < 2 ? (
                      <div className="flex justify-center py-2" aria-hidden="true">
                        <span className="mono text-12 text-ink-500">↓</span>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* integration surfaces */}
      <Section label={sentinel.surfaces.rule.label} value={sentinel.surfaces.rule.value}>
        <Reveal>
          <h2 className="max-w-[26ch] text-28 sm:text-40">{sentinel.surfaces.h2}</h2>
        </Reveal>

        <ul className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
          {sentinel.surfaces.items.map((item, index) => (
            <Reveal as="li" key={item.name} delay={index * 40} className="bg-slate-900">
              <div className="h-full p-6 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-21 text-ink-100">{item.name}</h3>
                  <span className="mono text-12 text-ink-500">{item.note}</span>
                </div>
                <p className="mt-4 text-17 text-ink-400">{item.body}</p>
                <p className="mono mt-5 text-12 text-ink-500">{item.honesty}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* latency */}
      <Section label={sentinel.latency.rule.label} value={sentinel.latency.rule.value}>
        <Reveal>
          <h2 className="max-w-[24ch] text-28 sm:text-40">{sentinel.latency.h2}</h2>
          <Prose className="mt-7">
            <p>{sentinel.latency.body}</p>
          </Prose>
        </Reveal>

        <Reveal delay={60} className="mt-10">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-y border-hairline">
                <th scope="col" className="eyebrow py-3 pr-6">SENSITIVITY</th>
                <th scope="col" className="eyebrow py-3 pr-6">BEHAVIOUR</th>
                <th scope="col" className="eyebrow py-3">LATENCY</th>
              </tr>
            </thead>
            <tbody>
              {sentinel.latency.rows.map((row) => (
                <tr key={row.sensitivity} className="border-b border-hairline">
                  <td className="mono py-3 pr-6 align-top text-14 text-ink-100">{row.sensitivity}</td>
                  <td className="mono py-3 pr-6 align-top text-14 text-ink-400">{row.behaviour}</td>
                  <td className="mono py-3 align-top text-14 text-gate">{row.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Section>

      {/* fail posture */}
      <Section label={sentinel.failPosture.rule.label} value={sentinel.failPosture.rule.value}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,32rem)_1fr] lg:gap-16">
          <Reveal>
            <h2 className="max-w-[22ch] text-28 sm:text-40">{sentinel.failPosture.h2}</h2>
            <Prose className="mt-7">
              {sentinel.failPosture.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>
          </Reveal>

          <Reveal delay={60} className="self-center">
            <ul className="border-t border-hairline">
              {sentinel.failPosture.rows.map((row) => (
                <li
                  key={row.klass}
                  className="grid gap-2 border-b border-hairline py-4 sm:grid-cols-[10rem_8rem_1fr]"
                >
                  <span className="mono text-14 text-ink-100">{row.klass}</span>
                  <span
                    className={`mono text-14 ${
                      row.posture === 'CLOSED'
                        ? 'text-gate'
                        : row.posture === 'REVIEW'
                          ? 'text-hold'
                          : 'text-ink-400'
                    }`}
                  >
                    {row.posture}
                  </span>
                  <span className="mono text-14 text-ink-500">{row.example}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* worked example · the gate itself */}
      <Section id="gate" label={sentinel.demo.rule.label} value={sentinel.demo.rule.value}>
        <Reveal>
          <h2 id="sentinel-demo" className="max-w-[28ch] text-28 sm:text-40">
            {sentinel.demo.h2}
          </h2>
          <p className="measure mt-5 text-17 text-ink-400">{sentinel.demo.body}</p>
        </Reveal>
        <div className="mt-10">
          <SentinelGate headingId="sentinel-demo" />
        </div>
      </Section>

      {/* obligations and review */}
      <Section label={sentinel.obligations.rule.label} value={sentinel.obligations.rule.value}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="max-w-[22ch] text-28 sm:text-40">{sentinel.obligations.h2}</h2>
            <Prose className="mt-7">
              <p>{sentinel.obligations.body}</p>
            </Prose>
            <ul className="mt-8 border-t border-hairline">
              {sentinel.obligations.items.map((item) => (
                <li
                  key={item.name}
                  className="grid gap-2 border-b border-hairline py-3.5 sm:grid-cols-[11rem_1fr]"
                >
                  <span className="mono text-14 text-hold">{item.name}</span>
                  <span className="text-14 text-ink-400">{item.detail}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={60}>
            <div className="border border-hairline bg-slate-900">
              <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
                <Eyebrow as="span">{sentinel.obligations.queueLabel}</Eyebrow>
                <span className="mono text-12 text-hold">
                  {sentinel.obligations.queue.length} held
                </span>
              </div>
              <ul>
                {sentinel.obligations.queue.map((item) => (
                  <li
                    key={item.id}
                    className="grid gap-1 border-b border-hairline px-5 py-4 last:border-b-0 sm:grid-cols-[7rem_1fr_auto]"
                  >
                    <span className="mono text-14 text-ink-500">{item.id}</span>
                    <span className="mono text-14 text-ink-100">
                      {item.action}
                      <span className="text-ink-500"> · </span>
                      <span className="text-ink-400">{item.amount}</span>
                    </span>
                    <span className="mono text-12 text-ink-500">
                      {item.rule} · {item.age}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* the ledger */}
      <Section label={sentinel.ledger.rule.label} value={sentinel.ledger.rule.value}>
        <Reveal>
          <h2 className="max-w-[22ch] text-28 sm:text-40">{sentinel.ledger.h2}</h2>
          <Prose className="mt-7">
            <p>{sentinel.ledger.body}</p>
          </Prose>
        </Reveal>
      </Section>

      {/* policy packs */}
      <Section label={sentinel.packs.rule.label} value={sentinel.packs.rule.value}>
        <Reveal>
          <h2 className="max-w-[26ch] text-28 sm:text-40">{sentinel.packs.h2}</h2>
          <Prose className="mt-7">
            <p>{sentinel.packs.body}</p>
          </Prose>
          <ul className="mt-8 flex flex-wrap gap-2">
            {sentinel.packs.items.map((item) => (
              <li key={item} className="mono border border-hairline px-3 py-1.5 text-12 text-ink-400">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* cta */}
      <Section label={sentinel.cta.rule.label} value={sentinel.cta.rule.value} className="pb-20">
        <Reveal>
          <CTABlock
            eyebrow={sentinel.cta.eyebrow}
            heading={sentinel.cta.heading}
            body={sentinel.cta.body}
            actions={sentinel.cta.actions}
          />
        </Reveal>
      </Section>

      <LedgerTick />
    </>
  );
}
