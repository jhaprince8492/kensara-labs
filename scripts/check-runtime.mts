/**
 * Runtime smoke check. Build-breaking.
 *
 * Every other check in this repo verifies an artifact on disk: the bundle is
 * small, the copy is present in the HTML, the frames exist and are dark enough.
 * None of them verified that the page actually runs.
 *
 * A temporal dead zone error inside an effect shipped past all of them. The
 * server-rendered HTML was perfect, so the copy check passed; React then threw
 * during hydration and unmounted the entire page. This check exists because of
 * that, and it deliberately drives a real browser: the bug only fired on tiers
 * that mount a canvas, so anything without a canvas implementation would have
 * missed it.
 *
 * Uses the system Chrome through playwright-core. No browser download.
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const OUT = join(process.cwd(), 'out');

const ROUTES = [
  '/',
  '/formus/',
  '/sentinel/',
  '/platform/',
  '/assurance-object/',
  '/industries/healthcare-lifesciences/',
  '/journal/race-the-verdict-standardise-the-certificate/',
];

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function findBrowser(): string | null {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    `${process.env.LOCALAPPDATA ?? ''}\\Google\\Chrome\\Application\\chrome.exe`,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean) as string[];

  return candidates.find((path) => existsSync(path)) ?? null;
}

if (!existsSync(OUT)) {
  console.error('check-runtime: no export at out/. Build first.');
  process.exit(1);
}

const browserPath = findBrowser();
if (!browserPath) {
  console.error(
    'check-runtime: no Chrome or Edge found. Set CHROME_PATH to a browser executable.',
  );
  process.exit(1);
}

// --- serve the export -------------------------------------------------------

const server = createServer(async (req, res) => {
  const url = (req.url ?? '/').split('?')[0] ?? '/';
  let file = normalize(join(OUT, decodeURIComponent(url)));
  if (!file.startsWith(OUT)) {
    res.writeHead(403).end();
    return;
  }
  if (url.endsWith('/')) file = join(file, 'index.html');

  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
  }
});

await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const port = typeof address === 'object' && address ? address.port : 0;
const origin = `http://127.0.0.1:${port}`;

// --- drive a real browser ---------------------------------------------------

const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const failures: string[] = [];
const warnings = new Set<string>();

console.log(`  browser: ${browserPath}`);

for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const problems: string[] = [];
  page.on('pageerror', (error) => problems.push(`uncaught: ${error.message.split('\n')[0]}`));
  page.on('console', (message) => {
    const text = message.text();
    // A 404 is reported to the console without its URL, which makes it
    // useless. The response listener below records the actual path.
    if (message.type() === 'error' && !text.includes('Failed to load resource')) {
      problems.push(`console: ${text.slice(0, 160)}`);
    }
  });
  page.on('response', (response) => {
    if (response.status() < 400) return;
    const path = new URL(response.url()).pathname;
    // The site has no favicon yet. That is a real gap and a brand decision,
    // not a reason to fail the build, so it is reported once and separately.
    if (path === '/favicon.ico') {
      warnings.add('no /favicon.ico in the export');
      return;
    }
    problems.push(`${response.status()} ${path}`);
  });

  await page.goto(`${origin}${route}`, { waitUntil: 'networkidle', timeout: 30_000 });

  // Scroll the whole page. The crash this check was written for only appeared
  // once an act armed, which needs the section to come into view.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  const state = await page.evaluate(() => ({
    hasH1: Boolean(document.querySelector('h1')),
    headings: document.querySelectorAll('h1,h2,h3').length,
    links: document.querySelectorAll('a').length,
    appError: document.body.innerText.includes('Application error'),
    textLength: (document.querySelector('main')?.textContent ?? '').trim().length,
  }));

  if (!state.hasH1) problems.push('no h1 after hydration: the page unmounted');
  if (state.appError) problems.push('Next rendered its client-side exception screen');
  if (state.textLength < 400) problems.push(`main has only ${state.textLength} characters of text`);
  if (state.links === 0) problems.push('no links after hydration');

  const ok = problems.length === 0;
  console.log(
    `  ${ok ? 'ok  ' : 'FAIL'}  ${route.padEnd(56)} ` +
      `${String(state.headings).padStart(3)} headings  ${String(state.links).padStart(3)} links`,
  );
  for (const problem of problems) {
    console.log(`          ${problem}`);
    failures.push(`${route}: ${problem}`);
  }

  await context.close();
}

await browser.close();
server.close();

for (const warning of warnings) console.log(`\n  warning: ${warning}`);

if (failures.length > 0) {
  console.error('\ncheck-runtime: FAILED');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('\ncheck-runtime: ok · every route hydrates and survives a full scroll');
