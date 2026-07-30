/**
 * Build-breaking bundle assertions.
 *
 * A verification company shipping a slow site is a self-refuting artifact, so
 * these are failures, not warnings.
 *
 *   1. `three` must not appear in any route's initial chunks.
 *   2. Initial JS, gzipped, must stay under 180KB on every route.
 *   3. The home page's total transferred weight must stay under 1.4MB.
 */

import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const NEXT_DIR = join(ROOT, '.next');
const OUT_DIR = join(ROOT, 'out');

const JS_BUDGET = 180 * 1024;
const PAGE_BUDGET = 1400 * 1024;

/** Strings that only exist if three.js was bundled into a chunk. */
const THREE_FINGERPRINTS = ['WebGLRenderer', 'THREE.Scene', 'setFromRotationMatrix'];

const failures = [];
const notes = [];

function gzipOf(path) {
  return gzipSync(readFileSync(path), { level: 9 }).length;
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

// --- 1 & 2 -----------------------------------------------------------------

const manifestPath = join(NEXT_DIR, 'app-build-manifest.json');
let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch {
  console.error(`check-bundle: no build found at ${relative(ROOT, manifestPath)}. Run the build first.`);
  process.exit(1);
}

for (const [route, files] of Object.entries(manifest.pages)) {
  const scripts = files.filter((file) => file.endsWith('.js'));
  let total = 0;

  for (const file of scripts) {
    const path = join(NEXT_DIR, file);
    let source;
    try {
      source = readFileSync(path, 'utf8');
    } catch {
      continue;
    }

    total += gzipSync(Buffer.from(source), { level: 9 }).length;

    const hit = THREE_FINGERPRINTS.find((needle) => source.includes(needle));
    if (hit) {
      failures.push(
        `three is in the initial bundle for ${route} (${file} contains "${hit}"). ` +
          'It must be dynamically imported behind the capability check.',
      );
    }
  }

  notes.push(`${route.padEnd(24)} initial js ${kb(total).padStart(9)}`);
  if (total > JS_BUDGET) {
    failures.push(`${route}: initial JS ${kb(total)} exceeds the ${kb(JS_BUDGET)} budget.`);
  }
}

// --- 3 ---------------------------------------------------------------------

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const info = statSync(path);
    if (info.isDirectory()) entries.push(...walk(path));
    else entries.push(path);
  }
  return entries;
}

try {
  const homeHtml = join(OUT_DIR, 'index.html');
  const html = gzipOf(homeHtml);
  const css = walk(join(OUT_DIR, '_next', 'static'))
    .filter((path) => path.endsWith('.css'))
    .reduce((sum, path) => sum + gzipOf(path), 0);

  const homeScripts = manifest.pages['/page'] ?? [];
  const js = homeScripts
    .filter((file) => file.endsWith('.js'))
    .reduce((sum, file) => {
      try {
        return sum + gzipOf(join(NEXT_DIR, file));
      } catch {
        return sum;
      }
    }, 0);

  const total = html + css + js;
  notes.push(`home total (html+css+js, gzip) ${kb(total)}`);
  if (total > PAGE_BUDGET) {
    failures.push(`home page total weight ${kb(total)} exceeds the ${kb(PAGE_BUDGET)} budget.`);
  }
} catch (error) {
  failures.push(`could not measure the exported home page: ${error.message}`);
}

// --- report ----------------------------------------------------------------

for (const note of notes) console.log(`  ${note}`);

if (failures.length > 0) {
  console.error('\ncheck-bundle: FAILED');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('\ncheck-bundle: ok');
