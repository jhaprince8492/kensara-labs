/**
 * Canonical serialization and SHA-256 helpers.
 *
 * Every hash shown on this site is computed here, in the visitor's browser,
 * from the canonicalised input. Nothing is hardcoded. A visitor who opens
 * devtools and re-runs the same inputs gets the same hash, which is the point.
 *
 * Canonical form, matching the determinism contract:
 *   - object keys sorted lexicographically
 *   - no insignificant whitespace
 *   - money as exact integers (paise), never floats
 */

/** Deterministic JSON: sorted keys, no whitespace, no float money. */
export function canonicalJson(value: unknown): string {
  return serialize(value);
}

function serialize(value: unknown): string {
  if (value === null) return 'null';

  if (Array.isArray(value)) {
    return `[${value.map(serialize).join(',')}]`;
  }

  switch (typeof value) {
    case 'string':
      return JSON.stringify(value);
    case 'boolean':
      return value ? 'true' : 'false';
    case 'number': {
      if (!Number.isFinite(value)) {
        throw new TypeError('canonicalJson: non-finite number is not serializable');
      }
      // Integers serialize exactly. Non-integers are a determinism hazard and
      // are rejected rather than silently rounded.
      if (!Number.isInteger(value)) {
        throw new TypeError('canonicalJson: non-integer number is not serializable');
      }
      return String(value);
    }
    case 'object': {
      const entries = Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
      return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${serialize(v)}`).join(',')}}`;
    }
    default:
      throw new TypeError(`canonicalJson: unsupported value of type ${typeof value}`);
  }
}

/** SHA-256 of a UTF-8 string, lowercase hex. Uses the platform Web Crypto. */
export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Display form of a hash: first `chars` hex digits followed by an ellipsis. */
export function truncateHash(hex: string, chars = 6): string {
  return `${hex.slice(0, chars)}…`;
}
