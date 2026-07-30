'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { site } from '@/content/copy/site';

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-void/92 backdrop-blur-[3px]">
      <div className="mx-auto flex max-w-[88rem] items-center gap-6 px-5 py-3.5 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2"
          aria-label="Kensara Labs, home"
        >
          <span className="font-[family-name:var(--font-display)] text-21 tracking-[-0.02em] text-ink-100">
            Kensara
          </span>
          <span className="mono text-12 tracking-[0.14em] text-ink-500">LABS</span>
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 items-center gap-7 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              className={`text-14 transition-colors duration-[120ms] hover:text-ink-100 ${
                isCurrent(item.href) ? 'text-ink-100' : 'text-ink-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-5 md:flex">
          {site.utility.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              className={`mono text-12 transition-colors duration-[120ms] hover:text-ink-100 ${
                isCurrent(item.href) ? 'text-ink-100' : 'text-ink-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={site.cta.href}
            className="mono border border-hairline px-3 py-1.5 text-14 text-ink-100 transition-colors duration-[120ms] hover:border-proof hover:text-proof-ink"
          >
            {site.cta.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nav-mobile"
          className="mono ml-auto border border-hairline px-3 py-1.5 text-12 tracking-[0.14em] text-ink-400 md:hidden"
        >
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {open ? (
        <nav
          id="nav-mobile"
          aria-label="Primary, mobile"
          className="border-t border-hairline bg-slate-900 md:hidden"
        >
          <ul className="mx-auto max-w-[88rem] px-5 py-2 sm:px-8">
            {[...site.nav, ...site.utility, site.cta].map((item) => (
              <li key={item.href} className="border-b border-hairline last:border-b-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className="block py-3 text-17 text-ink-400 hover:text-ink-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
