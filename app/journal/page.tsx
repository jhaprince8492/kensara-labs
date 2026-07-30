import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Reveal } from '@/components/primitives/Reveal';
import { Section } from '@/components/primitives/Section';
import { formatDate, postsByDate } from '@/content/journal/posts';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Long-form engineering writing on interception design, determinism, and the translation layer between requirements and proofs.',
};

export default function JournalPage() {
  return (
    <>
      <section className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <Eyebrow>JOURNAL · ENGINEERING WRITING</Eyebrow>
        <h1 className="mt-6 max-w-[20ch] text-40 sm:text-60">
          The parts that were hard, written up honestly.
        </h1>
        <p className="measure mt-7 text-17 text-ink-400 sm:text-21">
          One post a month. Each one is a decision we had to make, the options we rejected, and
          what the choice cost us.
        </p>
      </section>

      <Section label="POSTS" value={String(postsByDate.length)}>
        <ul className="border-t border-hairline">
          {postsByDate.map((post, index) => (
            <Reveal as="li" key={post.slug} delay={index * 40}>
              <Link
                href={`/journal/${post.slug}/`}
                className="group block border-b border-hairline py-8 transition-colors duration-[120ms] hover:border-ink-600"
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-10">
                  <div>
                    <Eyebrow>{post.eyebrow}</Eyebrow>
                    <p className="mono mt-2 text-12 text-ink-500">
                      {formatDate(post.date)} · {post.minutes} min
                    </p>
                  </div>
                  <div>
                    <h2 className="max-w-[26ch] text-28 text-ink-100">{post.title}</h2>
                    <p className="measure mt-4 text-17 text-ink-400">{post.dek}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}
