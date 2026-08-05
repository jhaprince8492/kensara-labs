import Link from 'next/link';
import { site } from '@/content/copy/site';

export function Footer() {
  return (
    // Positioned and opaque so it stays above the home page's fixed backdrop.
    <footer className="relative z-10 border-t border-hairline bg-void">
      <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto]">
          <div className="measure">
            <p className="font-[family-name:var(--font-display)] text-21 tracking-[-0.02em] text-ink-100">
              {site.footer.positioning}
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {site.footer.backing.map((item) => (
                <li key={item} className="mono text-12 text-ink-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {site.footer.columns.map((column) => (
            <div key={column.heading}>
              <p className="eyebrow mb-4">{column.heading}</p>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-14 text-ink-400 transition-colors duration-[120ms] hover:text-ink-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-hairline pt-6">
          <p className="eyebrow mb-3">{site.footer.standardsLabel}</p>
          <ul className="flex flex-wrap gap-2">
            {site.footer.standards.map((standard) => (
              <li
                key={standard}
                className="mono border border-hairline px-2 py-1 text-12 text-ink-400"
              >
                {standard}
              </li>
            ))}
          </ul>
          <p className="mono mt-8 text-12 text-ink-500">{site.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
