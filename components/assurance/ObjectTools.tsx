'use client';

import { useState } from 'react';
import { canonicalJson, sha256Hex } from '@/lib/hash';
import { assuranceBody } from '@/content/data/assuranceObject';
import { Eyebrow } from '@/components/primitives/Eyebrow';

type Result =
  | { kind: 'idle' }
  | { kind: 'busy' }
  | { kind: 'match'; digest: string; bytes: number }
  | { kind: 'mismatch'; digest: string };

/**
 * Verify and replay, both running here in the browser.
 *
 * Verify recomputes the content hash from the canonical bytes. Replay does the
 * whole derivation a second time, from the same inputs, and compares every
 * byte: if the two runs disagreed the panel would say so.
 */
export function ObjectTools({ contentHash }: { contentHash: string }) {
  const [verify, setVerify] = useState<Result>({ kind: 'idle' });
  const [replay, setReplay] = useState<Result>({ kind: 'idle' });

  const runVerify = async () => {
    setVerify({ kind: 'busy' });
    const canonical = canonicalJson(assuranceBody);
    const digest = await sha256Hex(canonical);
    setVerify(
      digest === contentHash
        ? { kind: 'match', digest, bytes: new TextEncoder().encode(canonical).length }
        : { kind: 'mismatch', digest },
    );
  };

  const runReplay = async () => {
    setReplay({ kind: 'busy' });
    const first = canonicalJson(assuranceBody);
    const second = canonicalJson(structuredClone(assuranceBody));
    const [a, b] = await Promise.all([sha256Hex(first), sha256Hex(second)]);
    setReplay(
      a === b && a === contentHash
        ? { kind: 'match', digest: a, bytes: new TextEncoder().encode(second).length }
        : { kind: 'mismatch', digest: b },
    );
  };

  const download = () => {
    const payload = JSON.stringify(
      { ...assuranceBody, signature: { ...assuranceBody.signature, content_hash: contentHash } },
      null,
      2,
    );
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kensara-assurance-object.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-px border border-hairline bg-hairline sm:grid-cols-3">
      <Tool
        label="SIGNATURE"
        action="Verify signature"
        onRun={runVerify}
        state={verify}
        idleNote="recomputes the content hash from the canonical bytes"
      />
      <Tool
        label="DETERMINISM"
        action="Replay this object"
        onRun={runReplay}
        state={replay}
        idleNote="re-derives the object and compares every byte"
      />
      <div className="bg-slate-900 p-5">
        <Eyebrow>SAMPLE</Eyebrow>
        <p className="mt-3 text-14 text-ink-400">
          Take it into a meeting. It is the same object this page renders.
        </p>
        <button
          type="button"
          onClick={download}
          className="mono mt-5 border border-hairline px-3 py-2 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-ink-600 hover:text-ink-100"
        >
          Download this object as JSON
        </button>
      </div>
    </div>
  );
}

function Tool({
  label,
  action,
  onRun,
  state,
  idleNote,
}: {
  label: string;
  action: string;
  onRun: () => Promise<void>;
  state: Result;
  idleNote: string;
}) {
  return (
    <div
      className={`bg-slate-900 p-5 transition-colors duration-200 ${
        state.kind === 'match' ? 'shadow-[inset_0_0_0_1px_var(--proof)]' : ''
      }`}
    >
      <Eyebrow>{label}</Eyebrow>

      <div className="mt-3 min-h-[3.5rem]" role="status" aria-live="polite">
        {state.kind === 'idle' ? <p className="text-14 text-ink-400">{idleNote}</p> : null}
        {state.kind === 'busy' ? <p className="mono text-14 text-ink-400">running…</p> : null}
        {state.kind === 'match' ? (
          <>
            <p className="mono text-14 text-proof-ink">match · {state.bytes} bytes</p>
            <p className="mono mt-1 text-12 break-all text-ink-500">{state.digest}</p>
          </>
        ) : null}
        {state.kind === 'mismatch' ? (
          <>
            <p className="mono text-14 text-refute">mismatch</p>
            <p className="mono mt-1 text-12 break-all text-ink-500">{state.digest}</p>
          </>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => void onRun()}
        disabled={state.kind === 'busy'}
        className="mono mt-4 border border-hairline px-3 py-2 text-14 text-ink-400 transition-colors duration-[120ms] hover:border-proof hover:text-proof-ink disabled:opacity-50"
      >
        {action}
      </button>
    </div>
  );
}
