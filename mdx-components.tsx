import type { MDXComponents } from 'mdx/types';

/**
 * Journal typography.
 *
 * Prose is proportional and capped at the measure. Anything verifiable stays
 * monospaced, which in a post means code, inline identifiers and blockquoted
 * readouts.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="measure mt-16 mb-5 text-28 text-ink-100 sm:text-40">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="measure mt-12 mb-4 text-21 text-ink-100 sm:text-28">{children}</h3>
    ),
    p: ({ children }) => <p className="measure mb-6 text-17 text-ink-400">{children}</p>,
    ul: ({ children }) => (
      <ul className="measure mb-6 list-none border-t border-hairline">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="measure mb-6 list-none border-t border-hairline">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="border-b border-hairline py-3 text-17 text-ink-400">{children}</li>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-proof-ink underline decoration-proof/40 underline-offset-4 transition-colors duration-[120ms] hover:decoration-proof"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-medium text-ink-100">{children}</strong>,
    code: ({ children }) => (
      <code className="mono bg-slate-800 px-1.5 py-0.5 text-14 text-ink-100">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="mono mb-8 overflow-x-auto border border-hairline bg-slate-900 px-5 py-5 text-12 leading-[1.9] text-ink-400">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="measure mb-8 border-l border-proof/50 pl-5 text-17 text-ink-100">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-12 border-0 border-t border-hairline" />,
    ...components,
  };
}
