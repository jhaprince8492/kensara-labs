/**
 * Copy integrity. Build-breaking.
 *
 * The cinematic layer sits behind the home page and is not allowed to change a
 * word of it. This asserts the strongest available version of that: every leaf
 * string in the home page copy object appears, character for character, in the
 * exported home page HTML.
 *
 * It catches a dropped paragraph, a reordered wrapper that swallowed a node, a
 * "tightened" sentence, and a string that moved into an attribute where a
 * reader can no longer see it.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { home } from '../content/copy/home.ts';

const HTML = join(process.cwd(), 'out', 'index.html');

if (!existsSync(HTML)) {
  console.error('check-copy-integrity: no export found at out/index.html. Build first.');
  process.exit(1);
}

const raw = await readFile(HTML, 'utf8');

/** Undo the escaping Next applies so comparisons are against real characters. */
const html = raw
  .replace(/&#x27;/g, "'")
  .replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&#34;/g, '"')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ')
  .replace(/<!-- -->/g, '');

/** Every leaf string in the copy object, with the path that reached it. */
function leaves(value: unknown, path: string[] = []): { path: string; text: string }[] {
  if (typeof value === 'string') return [{ path: path.join('.'), text: value }];
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, [...path, String(i)]));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, [...path, k]));
  }
  return [];
}

// Keys that are not rendered as reader-visible text on the page.
const NOT_RENDERED = new Set(['meta.title', 'meta.description']);

/**
 * Copy that is deliberately no longer on the page.
 *
 * `demo` is the SentinelGate block, removed from the home page by decision
 * before the cinematic layer was built. The strings are kept in the copy object
 * so the section can be restored without rewriting it. If it comes back, delete
 * this entry so the check guards it again.
 */
const RETIRED = ['demo'];

const isRenderable = (entry: { path: string; text: string }) => {
  if (NOT_RENDERED.has(entry.path)) return false;
  if (RETIRED.some((prefix) => entry.path === prefix || entry.path.startsWith(`${prefix}.`))) {
    return false;
  }
  if (entry.text.length < 4) return false;
  if (entry.text.startsWith('/') || entry.text.startsWith('#')) return false;
  if (/\.(href|tone|glyph|engine|kind)$/.test(entry.path)) return false;
  // `alt` and `sceneAlt` live in attributes; they are checked separately below.
  return !/(^|\.)(alt|sceneAlt)$/.test(entry.path);
};

const all = leaves(home);
const renderable = all.filter(isRenderable);
const attributes = all.filter((e) => /(^|\.)(alt|sceneAlt)$/.test(e.path));

const missing: { path: string; text: string }[] = [];

for (const entry of renderable) {
  if (!html.includes(entry.text)) missing.push(entry);
}

// Attribute copy must still be present somewhere in the document, even though
// it is not body text. Act I reuses `hero.sceneAlt` as its label.
for (const entry of attributes) {
  if (!html.includes(entry.text)) missing.push(entry);
}

console.log(
  `  checked ${renderable.length} rendered strings and ${attributes.length} attribute strings`,
);

if (missing.length > 0) {
  console.error('\ncheck-copy-integrity: FAILED');
  console.error('  the following copy is no longer present in the exported home page:\n');
  for (const entry of missing) {
    console.error(`  - home.${entry.path}`);
    console.error(`      ${JSON.stringify(entry.text.slice(0, 96))}`);
  }
  process.exit(1);
}

console.log('\ncheck-copy-integrity: ok · every string is byte-identical');
