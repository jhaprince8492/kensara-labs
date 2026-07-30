import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CTABlock } from '@/components/layout/CTABlock';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Section } from '@/components/primitives/Section';
import { SectionRule } from '@/components/primitives/SectionRule';
import { findPost, formatDate, posts } from '@/content/journal/posts';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.dek,
    openGraph: { type: 'article', title: post.title, description: post.dek },
  };
}

export default async function JournalPost({ params }: Params) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const { default: Body } = await post.load();

  return (
    <>
      <article className="mx-auto max-w-[88rem] px-5 pt-16 pb-8 sm:px-8 sm:pt-24">
        <header>
          <Eyebrow>{post.eyebrow}</Eyebrow>
          <h1 className="measure mt-6 text-40 sm:text-60">{post.title}</h1>
          <p className="measure mt-7 text-17 text-ink-400 sm:text-21">{post.dek}</p>
          <p className="mono mt-6 text-12 text-ink-500">
            {formatDate(post.date)} · {post.minutes} min read
          </p>
        </header>

        <div className="mt-12">
          <SectionRule label="POST" value={`${post.minutes} MIN`} />
        </div>

        <div className="mt-12">
          <Body />
        </div>

        <div className="mt-16 border-t border-hairline pt-6">
          <Link
            href="/journal/"
            className="mono text-14 text-ink-400 transition-colors duration-[120ms] hover:text-proof-ink"
          >
            ← All posts
          </Link>
        </div>
      </article>

      <Section label="NEXT" value="45 min" className="pb-8">
        <CTABlock
          eyebrow="SCOPING CALL · 45 MIN"
          heading="Disagree with any of this?"
          body="Tell us which part, and why. Arguments about interception design and determinism are the ones we most want to have, and they are the fastest way for us to find out we are wrong."
          actions={[
            { label: 'Request access', href: '/demo/', kind: 'primary' as const },
            { label: 'Read the platform page', href: '/platform/', kind: 'secondary' as const },
          ]}
        />
      </Section>
    </>
  );
}
