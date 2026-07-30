import type { Metadata, Viewport } from 'next';
import { Inter_Tight, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@/components/layout/Analytics';
import { Footer } from '@/components/layout/Footer';
import { Nav } from '@/components/layout/Nav';
import { home } from '@/content/copy/home';
import './globals.css';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const body = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter-tight',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: {
    default: home.meta.title,
    template: '%s · Kensara Labs',
  },
  description: home.meta.description,
  applicationName: 'Kensara Labs',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Kensara Labs',
    title: home.meta.title,
    description: home.meta.description,
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#05070B',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="mono sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:border focus:border-proof focus:bg-slate-900 focus:px-3 focus:py-2 focus:text-14 focus:text-proof-ink"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
