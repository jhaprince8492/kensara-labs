/**
 * Procedural placeholder frames.
 *
 * Phase 1 exists so the scroll behaviour can be tuned before real footage is
 * committed. These are not art: they are stand-ins with the right frame counts,
 * the right palette and the right luminance range, so the scrub feel and the
 * budget report are both honest before a single generated frame lands.
 *
 * Act VII has no supplied footage, so it stays on a placeholder until it does.
 *
 *   node --experimental-strip-types scripts/gen-placeholders.mts [--act N]
 */

import { mkdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import {
  ACTS,
  BUDGET,
  CINEMA_DIR,
  actSlug,
  frameName,
  kb,
  measureLuminance,
  upsertAct,
  type ActId,
} from './lib/cinema.mts';

const W = 1280;
const H = 720;
const VOID = '#05070B';
const PROOF = '#2F6BFF';
const GATE = '#22C39A';
const REFUTE = '#E2483F';

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIELD = (() => {
  const next = rng(0x51a7e);
  return Array.from({ length: 900 }, () => ({
    x: next(),
    y: next(),
    z: next(),
    red: next() > 0.994,
  }));
})();

function wrap(body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${VOID}"/>${body}
<rect width="${W}" height="${H}" fill="url(#vig)"/>
<defs><radialGradient id="vig" cx="50%" cy="50%" r="72%">
<stop offset="55%" stop-color="${VOID}" stop-opacity="0"/>
<stop offset="100%" stop-color="${VOID}" stop-opacity="0.85"/></radialGradient></defs></svg>`;
}

/** Each act, as a function of normalised time. */
const SCENES: Record<ActId, (t: number) => string> = {
  // I · the state space: a field too large to sample, and a plane that misses
  1: (t) => {
    const push = 1 + t * 0.5;
    const sweep = 0.1 + t * 0.8;
    const dots = FIELD.map((p) => {
      const x = (p.x - 0.5) * W * push + W / 2;
      const y = (p.y - 0.5) * H * push + H / 2;
      const near = Math.abs(p.x - sweep) < 0.02;
      const r = 0.8 + p.z * 1.4;
      const fill = p.red ? REFUTE : PROOF;
      const o = p.red ? 0.85 : near ? 0.8 : 0.1 + p.z * 0.12;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}" opacity="${o.toFixed(2)}"/>`;
    }).join('');
    return `${dots}<rect x="${(sweep * W - 1).toFixed(1)}" y="0" width="2" height="${H}" fill="${PROOF}" opacity="0.42"/>`;
  },

  // II · five ordered tracks fracturing into an uncountable fan
  2: (t) => {
    const split = 0.24 + t * 0.34;
    let out = '';
    for (let i = 0; i < 5; i += 1) {
      const y = H * (0.3 + i * 0.1);
      out += `<path d="M0 ${y} H${(split * W).toFixed(0)}" stroke="${PROOF}" stroke-width="1.4" opacity="0.5" fill="none"/>`;
      const branches = Math.round(2 + t * 46);
      for (let b = 0; b < branches; b += 1) {
        const spread = ((b / branches) - 0.5) * H * (0.35 + t * 0.9);
        out += `<path d="M${(split * W).toFixed(0)} ${y} C${(split * W + 120).toFixed(0)} ${y} ${(W - 200).toFixed(0)} ${(y + spread).toFixed(0)} ${W} ${(y + spread).toFixed(0)}" stroke="${PROOF}" stroke-width="0.6" opacity="${(0.26 - t * 0.1).toFixed(2)}" fill="none"/>`;
      }
    }
    return out;
  },

  // III · the quietest act. Eight nodes in a cold lattice, tracked laterally
  3: (t) => {
    const pan = -t * 260;
    let out = '';
    for (let i = 0; i < 26; i += 1) {
      const x = pan + i * 90;
      out += `<path d="M${x} 0 V${H}" stroke="${PROOF}" stroke-width="0.5" opacity="0.05"/>`;
    }
    for (let i = 0; i < 9; i += 1) {
      out += `<path d="M0 ${i * 90} H${W}" stroke="${PROOF}" stroke-width="0.5" opacity="0.045"/>`;
    }
    for (let i = 0; i < 8; i += 1) {
      const x = pan + 150 + i * 190;
      const y = H * (0.34 + (i % 3) * 0.16);
      out += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="3.2" fill="${PROOF}" opacity="0.4"/>`;
      out += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="16" fill="${PROOF}" opacity="0.05"/>`;
    }
    return out;
  },

  // IV · the turn. Formless on the left, crystalline on the right
  4: (t) => {
    const next = rng(0x2f6b);
    let out = '';
    for (let i = 0; i < 90; i += 1) {
      const bx = next() * 0.46 * W;
      const by = next() * H;
      const r = 26 + next() * 54;
      out += `<circle cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" r="${r.toFixed(0)}" fill="${PROOF}" opacity="0.022"/>`;
    }
    const grow = 0.3 + t * 0.7;
    for (let i = 0; i < 140; i += 1) {
      const gx = W * 0.54 + next() * W * 0.44;
      const gy = next() * H;
      const s = 5 + next() * 13 * grow;
      out += `<path d="M${gx.toFixed(0)} ${(gy - s).toFixed(0)} L${(gx + s).toFixed(0)} ${gy.toFixed(0)} L${gx.toFixed(0)} ${(gy + s).toFixed(0)} L${(gx - s).toFixed(0)} ${gy.toFixed(0)} Z" fill="none" stroke="${PROOF}" stroke-width="0.7" opacity="${(0.1 + t * 0.28).toFixed(2)}"/>`;
    }
    return `${out}<rect x="${(W * 0.5 - 1).toFixed(0)}" y="0" width="2" height="${H}" fill="${PROOF}" opacity="${(0.16 + t * 0.2).toFixed(2)}"/>`;
  },

  // V · two engines, converging
  5: (t) => {
    let out = '';
    for (let i = 0; i < 130; i += 1) {
      const a = (i / 130) * Math.PI * 6 + t * 1.6;
      const rad = (1 - i / 130) * 220;
      const x = W * 0.26 + Math.cos(a) * rad;
      const y = H * 0.44 + Math.sin(a) * rad * 0.6;
      out += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="1.3" fill="${PROOF}" opacity="0.4"/>`;
    }
    out += `<rect x="${(W * 0.7).toFixed(0)}" y="${(H * 0.12).toFixed(0)}" width="3" height="${(H * 0.62).toFixed(0)}" fill="${GATE}" opacity="0.4"/>`;
    for (let i = 0; i < 14; i += 1) {
      const p = ((i / 14 + t) % 1);
      const x = W * 0.56 + p * W * 0.34;
      const passed = i % 4 !== 0;
      const y = H * 0.42 + (passed ? 0 : p * H * 0.2);
      out += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="2.4" fill="${passed ? GATE : '#E0A22A'}" opacity="0.55"/>`;
    }
    return out;
  },

  // VI · everything collapses and seals
  6: (t) => {
    const k = 1 - t;
    const next = rng(0x9f2c);
    let out = '';
    for (let i = 0; i < 320; i += 1) {
      const ax = (next() - 0.5) * W * 1.1;
      const ay = (next() - 0.5) * H * 1.1;
      out += `<circle cx="${(W / 2 + ax * k).toFixed(0)}" cy="${(H / 2 + ay * k).toFixed(0)}" r="1.2" fill="${PROOF}" opacity="${(0.14 + t * 0.2).toFixed(2)}"/>`;
    }
    const w = 60 + t * 300;
    const h = 34 + t * 130;
    out += `<rect x="${(W / 2 - w / 2).toFixed(0)}" y="${(H / 2 - h / 2).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${PROOF}" opacity="${(t * 0.16).toFixed(2)}" stroke="${PROOF}" stroke-opacity="${(t * 0.5).toFixed(2)}"/>`;
    return out;
  },

  // VII · six volumes, one signature
  7: (t) => {
    const pan = -t * 300;
    let out = '';
    for (let i = 0; i < 6; i += 1) {
      const x = pan + 160 + i * 200;
      const scale = 0.6 + ((i * 37) % 100) / 140;
      const w = 100 * scale;
      const h = 130 * scale;
      const y = H * 0.3 + (i % 3) * 60;
      out += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${PROOF}" opacity="0.05" stroke="${PROOF}" stroke-opacity="0.22"/>`;
      for (let j = 0; j < 5; j += 1) {
        out += `<path d="M${x.toFixed(0)} ${(y + (h / 5) * j).toFixed(0)} h${w.toFixed(0)}" stroke="${PROOF}" stroke-width="0.5" opacity="0.12"/>`;
      }
    }
    return out;
  },

  // VIII · settle
  8: (t) => {
    const dots = FIELD.slice(0, 260)
      .map((p) => {
        const x = p.x * W;
        const y = p.y * H;
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="0.9" fill="${PROOF}" opacity="${(0.05 + p.z * 0.05).toFixed(3)}"/>`;
      })
      .join('');
    const pulse = 0.34 + Math.sin(t * Math.PI) * 0.06;
    return `${dots}<circle cx="${W / 2}" cy="${H / 2}" r="2.2" fill="${PROOF}" opacity="${pulse.toFixed(2)}"/><circle cx="${W / 2}" cy="${H / 2}" r="22" fill="${PROOF}" opacity="0.035"/>`;
  },
};

async function encode(svg: string, width: number, quality: number, out: string) {
  await sharp(Buffer.from(svg))
    .resize({ width })
    .avif({ quality, effort: 2, chromaSubsampling: '4:2:0' })
    .toFile(out);
  return (await stat(out)).size;
}

async function buildAct(id: ActId) {
  const config = ACTS.find((a) => a.id === id);
  if (!config) return;

  const slug = actSlug(id);
  const base = join(CINEMA_DIR, slug);
  await rm(base, { recursive: true, force: true });
  await mkdir(join(base, 'desktop'), { recursive: true });
  await mkdir(join(base, 'mobile'), { recursive: true });

  const count = config.frames;
  const svgs = Array.from({ length: count }, (_, i) =>
    wrap(SCENES[id](count === 1 ? 0 : i / (count - 1))),
  );

  let desktopBytes = 0;
  let mobileBytes = 0;
  let lumSum = 0;
  let peak = 0;

  // Modest concurrency: sharp already threads internally.
  const indices = svgs.map((_, i) => i);
  const workers = Array.from({ length: 4 }, async () => {
    while (indices.length > 0) {
      const i = indices.shift();
      if (i === undefined) return;
      const svg = svgs[i]!;
      desktopBytes += await encode(
        svg,
        BUDGET.desktopWidth,
        32,
        join(base, 'desktop', frameName(i)),
      );
      mobileBytes += await encode(
        svg,
        BUDGET.mobileWidth,
        28,
        join(base, 'mobile', frameName(i)),
      );
    }
  });
  await Promise.all(workers);

  // Luminance sampled across twelve evenly spaced frames.
  const samples = 12;
  for (let s = 0; s < samples; s += 1) {
    const i = Math.round((s / (samples - 1)) * (count - 1));
    const { mean, peak: framePeak } = await measureLuminance(
      join(base, 'desktop', frameName(i)),
    );
    lumSum += mean;
    peak = Math.max(peak, framePeak);
  }
  const meanLuminance = lumSum / samples;

  // The poster is the median-luminance frame, never frame 0, which is usually
  // the darkest and would read as a black rectangle while the act loads.
  const posterIndex = Math.round(count * 0.45);
  const posterSvg = svgs[posterIndex] ?? svgs[0]!;
  const posterPath = join(base, 'poster.avif');
  const posterBytes = await encode(posterSvg, BUDGET.desktopWidth, 30, posterPath);

  await upsertAct({
    act: id,
    frameCount: count,
    poster: `/cinema/${slug}/poster.avif`,
    posterBytes,
    desktop: { path: `/cinema/${slug}/desktop`, bytes: desktopBytes, width: BUDGET.desktopWidth },
    mobile: { path: `/cinema/${slug}/mobile`, bytes: mobileBytes, width: BUDGET.mobileWidth },
    meanLuminance: Number(meanLuminance.toFixed(4)),
    textColumnPeakLuminance: Number(peak.toFixed(4)),
    scrim: [...config.scrim],
    placeholder: true,
  });

  console.log(
    `  ${slug}  ${String(count).padStart(2)} frames  ` +
      `desktop ${kb(desktopBytes).padStart(9)}  mobile ${kb(mobileBytes).padStart(9)}  ` +
      `poster ${kb(posterBytes).padStart(7)}  mean lum ${meanLuminance.toFixed(3)}`,
  );
}

const only = process.argv.includes('--act')
  ? Number(process.argv[process.argv.indexOf('--act') + 1])
  : null;

console.log('generating placeholder frames');
for (const config of ACTS) {
  if (only !== null && config.id !== only) continue;
  await buildAct(config.id);
}
console.log('done');
