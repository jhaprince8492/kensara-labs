import type { ComponentType } from 'react';

/**
 * The journal index.
 *
 * Post bodies are MDX in this directory; this file holds their metadata and the
 * static import map the route uses. One a month, no exceptions, and a post that
 * is not written does not get an entry here.
 */

export interface Post {
  slug: string;
  title: string;
  /** The standfirst. One sentence, states the argument rather than teasing it. */
  dek: string;
  /** ISO date. */
  date: string;
  eyebrow: string;
  minutes: number;
  load: () => Promise<{ default: ComponentType }>;
}

export const posts: Post[] = [
  {
    slug: 'an-interceptor-your-agent-can-bypass-is-theatre',
    title: 'An interceptor your agent can bypass is theatre',
    dek: 'Credential vaulting is the only interception design that does not depend on the agent cooperating, and most of the market has shipped the other one.',
    date: '2026-05-14',
    eyebrow: 'SENTINEL · THREAT MODEL',
    minutes: 9,
    load: () => import('./an-interceptor-your-agent-can-bypass-is-theatre.mdx'),
  },
  {
    slug: 'race-the-verdict-standardise-the-certificate',
    title: 'Race the verdict, standardise the certificate',
    dek: 'Running two solvers in parallel gives you the same answer twice and two different proofs, and the proof is the thing the auditor reads.',
    date: '2026-06-18',
    eyebrow: 'FORMUS · DETERMINISM',
    minutes: 11,
    load: () => import('./race-the-verdict-standardise-the-certificate.mdx'),
  },
  {
    slug: 'why-we-dont-make-you-learn-our-language',
    title: 'Why we don’t make you learn our language',
    dek: 'KVL is an intermediate representation, not a specification language, and the difference decides who has to change their job.',
    date: '2026-07-09',
    eyebrow: 'KVL · INTERMEDIATE REPRESENTATION',
    minutes: 8,
    load: () => import('./why-we-dont-make-you-learn-our-language.mdx'),
  },
];

export function findPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Newest first. */
export const postsByDate = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
