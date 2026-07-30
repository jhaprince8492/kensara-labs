'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/useRenderTier';

/**
 * The ambient layer. Not particles: a hairline strip emitting one mono ledger
 * line every four seconds. It says "this thing is running" better than any
 * abstract motion could, and it is a product demo while it does it.
 *
 * The sequence is seeded and deterministic, so two people looking at the same
 * strip see the same lines in the same order. Silent, dismissible, and under
 * reduced-motion it renders one composed line and stops.
 */

interface LedgerEntry {
  time: string;
  verdict: 'ALLOW' | 'REVIEW' | 'DENY';
  action: string;
  pack: string;
  latency: string;
  hash: string;
}

const ACTIONS: readonly (readonly [string, string])[] = [
  ['payments.refund', 'pack:fin-in-v3.1'],
  ['crm.export_contacts', 'pack:dpdp-v2.0'],
  ['tickets.add_note', 'passthrough'],
  ['ledger.post_journal', 'pack:fin-in-v3.1'],
  ['patients.share_record', 'pack:hipaa-v1.4'],
  ['orders.cancel', 'pack:fin-in-v3.1'],
];

/** mulberry32. Seeded, so the strip replays identically for every visitor. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HEX = '0123456789abcdef';

function buildLedger(count: number): LedgerEntry[] {
  const next = rng(0x5e17);
  // A fixed synthetic clock. No ambient clock is read anywhere on this strip.
  let ms = 14 * 3600_000 + 22 * 60_000 + 7_000 + 481;
  const entries: LedgerEntry[] = [];

  for (let i = 0; i < count; i += 1) {
    ms += 3800 + Math.floor(next() * 900);
    const pick = ACTIONS[Math.floor(next() * ACTIONS.length)] ?? ACTIONS[0]!;
    const roll = next();
    const verdict: LedgerEntry['verdict'] =
      roll > 0.86 ? 'DENY' : roll > 0.7 ? 'REVIEW' : 'ALLOW';
    const passthrough = pick[1] === 'passthrough';

    entries.push({
      time: formatClock(ms),
      verdict,
      action: pick[0],
      pack: pick[1],
      latency: verdict === 'REVIEW' ? 'held' : passthrough ? '0ms' : `${18 + Math.floor(next() * 40)}ms`,
      hash: `${Array.from({ length: 4 }, () => HEX[Math.floor(next() * 16)]).join('')}…`,
    });
  }

  return entries;
}

function formatClock(ms: number): string {
  const h = Math.floor(ms / 3600_000) % 24;
  const m = Math.floor(ms / 60_000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  const milli = ms % 1000;
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(milli, 3)}`;
}

const LEDGER = buildLedger(24);

const VERDICT_TONE: Record<LedgerEntry['verdict'], string> = {
  ALLOW: 'text-proof-ink',
  REVIEW: 'text-hold',
  DENY: 'text-refute',
};

export function LedgerTick() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (reduced || dismissed) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % LEDGER.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [reduced, dismissed]);

  if (dismissed) return null;

  const entry = LEDGER[index] ?? LEDGER[0]!;

  return (
    <aside
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-void/92 backdrop-blur-[2px]"
      aria-label="Live decision ledger"
    >
      <div className="mx-auto flex max-w-[88rem] items-center gap-4 px-5 py-2 sm:px-8">
        <span className="eyebrow hidden shrink-0 sm:block">LEDGER</span>
        <p className="mono flex min-w-0 flex-1 gap-4 overflow-hidden text-12 whitespace-nowrap text-ink-500">
          <span>{entry.time}</span>
          <span className={VERDICT_TONE[entry.verdict]}>{entry.verdict}</span>
          <span className="text-ink-400">{entry.action}</span>
          <span className="hidden sm:inline">{entry.pack}</span>
          <span className="hidden md:inline">{entry.latency}</span>
          <span className="hidden md:inline">{entry.hash}</span>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mono pointer-events-auto shrink-0 border border-hairline px-2 py-1 text-12 text-ink-500 transition-colors duration-[120ms] hover:border-ink-600 hover:text-ink-100"
        >
          hide
        </button>
      </div>
    </aside>
  );
}
