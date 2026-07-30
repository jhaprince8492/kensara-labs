import { assuranceBody } from '@/content/data/assuranceObject';

/**
 * The object as it actually serializes: canonical form, sorted keys, the exact
 * bytes the content hash covers. Rendered readably rather than minified, with
 * the canonical string available beneath it for anyone hashing it themselves.
 */
export function AssuranceJSON({ contentHash }: { contentHash: string }) {
  const pretty = JSON.stringify(
    { ...assuranceBody, signature: { ...assuranceBody.signature, content_hash: contentHash } },
    null,
    2,
  );

  return (
    <div className="border border-hairline bg-void">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2">
        <span className="eyebrow">SIGNED PAYLOAD</span>
        <span className="mono text-12 text-ink-500">
          {assuranceBody.signature.canonicalization}
        </span>
      </div>
      <pre className="mono overflow-x-auto px-4 py-4 text-12 leading-[1.7] text-ink-400">
        {pretty}
      </pre>
    </div>
  );
}
