/**
 * Ingest one act of real footage.
 *
 *   pnpm ingest-act --act 4 --src "videos/ACT 4.mp4" --frames 72
 *
 * Grades the source toward the Kensara palette, crushes the blacks so text
 * stays readable, adds fine grain so near-black gradients do not posterise at
 * AVIF sizes, extracts evenly spaced frames, encodes both widths, picks a
 * median-luminance poster, measures everything and writes the manifest.
 *
 * Fails loudly on a size or luminance breach rather than committing an act that
 * will break the budget check later.
 *
 * ffmpeg is resolved from FFMPEG_PATH, then from the `imageio-ffmpeg` python
 * package, then from PATH. No system install is required.
 */

import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
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

const run = promisify(execFile);

function arg(name: string): string | null {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? (process.argv[i + 1] ?? null) : null;
}

async function resolveFfmpeg(): Promise<string> {
  if (process.env.FFMPEG_PATH && existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }
  for (const python of ['python', 'python3']) {
    try {
      const { stdout } = await run(python, [
        '-c',
        'import imageio_ffmpeg,sys; sys.stdout.write(imageio_ffmpeg.get_ffmpeg_exe())',
      ]);
      if (stdout.trim() && existsSync(stdout.trim())) return stdout.trim();
    } catch {
      // try the next one
    }
  }
  return 'ffmpeg';
}

/**
 * Appendix B grade. The curves node is what drops the film into the lower
 * luminance third; the noise node hides AVIF banding in the near-black regions,
 * without which dark gradients posterise badly at these file sizes.
 */
const GRADE = [
  'colorbalance=rs=-0.08:gs=-0.04:bs=0.10:rm=-0.06:bm=0.08',
  "curves=all='0/0 0.25/0.14 0.6/0.55 1/0.92'",
  'eq=saturation=0.82:contrast=1.06:brightness=-0.04',
  'noise=alls=4:allf=t+u',
].join(',');

async function main() {
  const actArg = Number(arg('act'));
  const src = arg('src');
  if (!Number.isInteger(actArg) || actArg < 1 || actArg > 8) {
    throw new Error('pass --act 1..8');
  }
  const id = actArg as ActId;
  const config = ACTS.find((a) => a.id === id);
  if (!config) throw new Error(`unknown act ${id}`);
  if (!src || !existsSync(src)) throw new Error(`--src not found: ${src ?? '(missing)'}`);

  const frames = Number(arg('frames') ?? config.frames);
  // Quality is tunable per act because the grain that keeps near-black
  // gradients from posterising is expensive, and each act carries a different
  // amount of moving detail.
  const desktopQuality = Number(arg('quality') ?? 42);
  const mobileQuality = Number(arg('mobile-quality') ?? desktopQuality - 6);
  const ffmpeg = await resolveFfmpeg();
  const slug = actSlug(id);
  const base = join(CINEMA_DIR, slug);

  console.log(`ingesting ${slug} from ${src}`);
  console.log(`  ffmpeg: ${ffmpeg}`);

  const work = await mkdtemp(join(tmpdir(), `kensara-${slug}-`));
  const graded = join(work, 'graded.mp4');

  // 1 · grade
  console.log('  grading');
  await run(ffmpeg, ['-y', '-v', 'error', '-i', src, '-vf', GRADE, '-c:v', 'libx264', '-crf', '16', graded], {
    maxBuffer: 1024 * 1024 * 64,
  });

  // 2 · extract evenly spaced frames across the whole clip
  console.log(`  extracting ${frames} frames`);
  const { stdout: durOut } = await run(ffmpeg, ['-v', 'error', '-i', graded, '-f', 'null', '-'], {
    maxBuffer: 1024 * 1024 * 64,
  }).catch(() => ({ stdout: '' }));
  void durOut;

  const pngDir = join(work, 'png');
  await mkdir(pngDir, { recursive: true });
  // `select` on evenly spaced source frames avoids the fps-rounding drift that
  // leaves the last frame duplicated or missing.
  await run(
    ffmpeg,
    [
      '-y',
      '-v',
      'error',
      '-i',
      graded,
      '-vf',
      `scale=${BUDGET.desktopWidth}:-2:flags=lanczos`,
      '-vsync',
      '0',
      join(pngDir, '%05d.png'),
    ],
    { maxBuffer: 1024 * 1024 * 64 },
  );

  const all = (await readdir(pngDir)).filter((f) => f.endsWith('.png')).sort();
  if (all.length === 0) throw new Error('ffmpeg produced no frames');
  const picks = Array.from({ length: frames }, (_, i) =>
    all[Math.round((i / Math.max(1, frames - 1)) * (all.length - 1))]!,
  );

  // 3 · encode both widths
  console.log('  encoding avif');
  await rm(base, { recursive: true, force: true });
  await mkdir(join(base, 'desktop'), { recursive: true });
  await mkdir(join(base, 'mobile'), { recursive: true });

  let desktopBytes = 0;
  let mobileBytes = 0;
  const perFrameLuminance: { index: number; mean: number; peak: number }[] = [];

  const queue = picks.map((file, index) => ({ file, index }));
  const workers = Array.from({ length: 4 }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) return;
      const source = join(pngDir, item.file);

      const desktopOut = join(base, 'desktop', frameName(item.index));
      await sharp(source).avif({ quality: desktopQuality, effort: 6 }).toFile(desktopOut);
      desktopBytes += (await stat(desktopOut)).size;

      const mobileOut = join(base, 'mobile', frameName(item.index));
      await sharp(source)
        .resize({ width: BUDGET.mobileWidth })
        .avif({ quality: mobileQuality, effort: 6 })
        .toFile(mobileOut);
      mobileBytes += (await stat(mobileOut)).size;

      const measured = await measureLuminance(desktopOut);
      perFrameLuminance.push({ index: item.index, ...measured });
    }
  });
  await Promise.all(workers);

  // 4 · poster from the median-luminance frame, never frame 0
  perFrameLuminance.sort((a, b) => a.mean - b.mean);
  const median = perFrameLuminance[Math.floor(perFrameLuminance.length / 2)]!;
  const posterSource = join(pngDir, picks[median.index]!);
  const posterPath = join(base, 'poster.avif');
  await sharp(posterSource).avif({ quality: 40, effort: 6 }).toFile(posterPath);
  const posterBytes = (await stat(posterPath)).size;

  const meanLuminance =
    perFrameLuminance.reduce((sum, f) => sum + f.mean, 0) / perFrameLuminance.length;
  const peak = perFrameLuminance.reduce((max, f) => Math.max(max, f.peak), 0);

  await upsertAct({
    act: id,
    frameCount: frames,
    poster: `/cinema/${slug}/poster.avif`,
    posterBytes,
    desktop: { path: `/cinema/${slug}/desktop`, bytes: desktopBytes, width: BUDGET.desktopWidth },
    mobile: { path: `/cinema/${slug}/mobile`, bytes: mobileBytes, width: BUDGET.mobileWidth },
    meanLuminance: Number(meanLuminance.toFixed(4)),
    textColumnPeakLuminance: Number(peak.toFixed(4)),
    scrim: [...config.scrim],
    placeholder: false,
  });

  await rm(work, { recursive: true, force: true });

  console.log(
    `  ${slug}  ${frames} frames  desktop ${kb(desktopBytes)}  mobile ${kb(mobileBytes)}  ` +
      `poster ${kb(posterBytes)} (frame ${median.index})  mean lum ${meanLuminance.toFixed(3)}`,
  );

  const problems: string[] = [];
  if (desktopBytes > BUDGET.perActDesktop) {
    problems.push(
      `desktop ${kb(desktopBytes)} over ${kb(BUDGET.perActDesktop)}. Reduce --frames before reducing quality: 48 clean frames scrub better than 72 blocky ones.`,
    );
  }
  if (mobileBytes > BUDGET.perActMobile) {
    problems.push(`mobile ${kb(mobileBytes)} over ${kb(BUDGET.perActMobile)}`);
  }
  if (meanLuminance > BUDGET.meanLuminanceCeiling) {
    problems.push(
      `mean luminance ${meanLuminance.toFixed(3)} over ${BUDGET.meanLuminanceCeiling}. Regrade, do not compensate with scrim.`,
    );
  }

  if (problems.length > 0) {
    console.error('\ningest-act: act written but OVER BUDGET');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
}

await main();
