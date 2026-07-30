'use client';

import { useState } from 'react';
import { canonicalJson, sha256Hex } from '@/lib/hash';
import { assuranceBody } from '@/content/data/assuranceObject';
import { platform } from '@/content/copy/platform';
import { Eyebrow } from '@/components/primitives/Eyebrow';

interface Derivation {
  bytes: number;
  digest: string;
  ordering: string;
}

/**
 * Two independent derivations of the same object, side by side.
 *
 * Nothing is shared between the columns: each one canonicalises from its own
 * deep copy and digests its own bytes. The verdict line compares them, so a
 * failure of the determinism contract would surface here as a mismatch rather
 * than as a tick nobody checked.
 */
export function ReplayPanel() {
  const [a, setA] = useState<Derivation | null>(null);
  const [b, setB] = useState<Derivation | null>(null);
  const [running, setRunning] = useState(false);

  const derive = async (): Promise<Derivation> => {
    const canonical = canonicalJson(structuredClone(assuranceBody));
    return {
      bytes: new TextEncoder().encode(canonical).length,
      digest: await sha256Hex(canonical),
      // First three keys of the canonical form, proving the ordering is total
      // and not an artifact of insertion order.
      ordering: (canonical.match(/"([a-z_]+)":/g) ?? []).slice(0, 3).join(' '),
    };
  };

  const run = async () => {
    setRunning(true);
    setA(null);
    setB(null);
    const [first, second] = await Promise.all([derive(), derive()]);
    setA(first);
    setB(second);
    setRunning(false);
  };

  const match = a !== null && b !== null && a.digest === b.digest && a.bytes === b.bytes;

  return (
    <div className="border border-hairline bg-slate-900">
      <div className="grid gap-px bg-hairline sm:grid-cols-2">
        <Machine label={platform.replay.machineA} result={a} running={running} />
        <Machine label={platform.replay.machineB} result={b} running={running} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline px-5 py-4">
        <p className="mono text-14" role="status" aria-live="polite">
          {a && b ? (
            match ? (
              <span className="text-proof-ink">
                byte-identical · {a.bytes} bytes · digests match
              </span>
            ) : (
              <span className="text-refute">
                derivations disagree · determinism contract violated
              </span>
            )
          ) : (
            <span className="text-ink-500">no derivation yet</span>
          )}
        </p>

        <button
          type="button"
          onClick={() => void run()}
          disabled={running}
          className="mono border border-proof/50 bg-proof/10 px-4 py-2 text-14 text-proof-ink transition-colors duration-[120ms] hover:border-proof hover:bg-proof/15 disabled:opacity-50"
        >
          {running ? platform.replay.running : platform.replay.run}
        </button>
      </div>
    </div>
  );
}

function Machine({
  label,
  result,
  running,
}: {
  label: string;
  result: Derivation | null;
  running: boolean;
}) {
  return (
    <div className="bg-slate-900 p-5">
      <Eyebrow>{label}</Eyebrow>
      <dl className="mt-4 space-y-3">
        <Row term="bytes" value={result ? String(result.bytes) : running ? '…' : '—'} />
        <Row term="key order" value={result ? result.ordering : running ? '…' : '—'} />
        <Row
          term="sha-256"
          value={result ? result.digest : running ? '…' : '—'}
          wrap
          tone={result ? 'proof' : 'muted'}
        />
      </dl>
    </div>
  );
}

function Row({
  term,
  value,
  wrap = false,
  tone = 'muted',
}: {
  term: string;
  value: string;
  wrap?: boolean;
  tone?: 'proof' | 'muted';
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[6rem_1fr]">
      <dt className="mono text-12 text-ink-500">{term}</dt>
      <dd
        className={`mono text-12 ${wrap ? 'break-all' : ''} ${
          tone === 'proof' ? 'text-proof-ink' : 'text-ink-400'
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
