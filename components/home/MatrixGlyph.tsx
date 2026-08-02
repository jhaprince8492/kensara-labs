/**
 * Failure glyphs for the problem matrix.
 *
 * Not icons. Each one is a miniature of the actual geometry the row is about,
 * drawn in the same hairline vocabulary as the three scenes. A lightbulb next
 * to "expertise shortage" is exactly the stock iconography this site does not
 * use, so every glyph here is a small diagram instead.
 *
 * Colour lives only in the row's mono readout. These are hairline and ink, so
 * nothing here competes with a verdict for meaning.
 */

export type GlyphName =
  | 'state-space'
  | 'brittleness'
  | 'expertise'
  | 'environment'
  | 'bypass'
  | 'staleness'
  | 'registry'
  | 'derivation';

const HAIRLINE = 'var(--hairline)';
const INK = 'var(--ink-500)';

/** Seeded cluster, shared by the state-space pair so both show the same states. */
const CLUSTER: [number, number][] = [
  [14, 20], [19, 14], [24, 22], [30, 16], [36, 21], [41, 27], [38, 34], [33, 40],
  [27, 36], [21, 31], [16, 35], [23, 27], [29, 29], [34, 26], [19, 25], [25, 17],
  [37, 15], [42, 34], [30, 44], [20, 42], [12, 29], [45, 22],
];

const dots = (points: [number, number][]) =>
  points.map(([x, y]) => `M${x} ${y}h0`).join('');

const TOUCHED = CLUSTER.filter(([x]) => Math.abs(x - 28) <= 3);
const UNTOUCHED = CLUSTER.filter(([x]) => Math.abs(x - 28) > 3);

export function MatrixGlyph({
  name,
  variant,
  size = 56,
}: {
  name: GlyphName;
  variant: 'problem' | 'solution';
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
      fill="none"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {body(name, variant)}
    </svg>
  );
}

function body(name: GlyphName, variant: 'problem' | 'solution') {
  const solution = variant === 'solution';

  switch (name) {
    // 1 · the space is too large to sample, then it is partitioned and closed
    case 'state-space':
      return solution ? (
        <>
          <path d={dots(CLUSTER)} stroke={HAIRLINE} strokeWidth="2" />
          <rect x="9" y="9" width="19" height="19" stroke={INK} />
          <rect x="28" y="9" width="19" height="19" stroke={INK} />
          <rect x="9" y="28" width="19" height="19" stroke={INK} />
          <rect x="28" y="28" width="19" height="19" stroke={INK} />
        </>
      ) : (
        <>
          <path d={dots(UNTOUCHED)} stroke={HAIRLINE} strokeWidth="2" />
          <path d={dots(TOUCHED)} stroke={INK} strokeWidth="2.6" />
          <path d="M28 6v44" stroke={INK} />
        </>
      );

    // 2 · an edge breaks and the graph downstream goes with it, then it is re-derived
    case 'brittleness': {
      const nodes: [number, number][] = [[14, 18], [28, 13], [42, 20], [20, 37], [35, 41]];
      return (
        <>
          <path d="M14 18L28 13M28 13L42 20M14 18L20 37M20 37L35 41" stroke={HAIRLINE} />
          <path
            d="M42 20L35 41"
            stroke={solution ? INK : HAIRLINE}
            strokeDasharray={solution ? undefined : '3 3'}
          />
          <path d={dots(nodes)} stroke={solution ? INK : HAIRLINE} strokeWidth="3.4" />
          {solution ? <path d="M40 47l3 3 6-7" stroke={INK} /> : null}
        </>
      );
    }

    // 3 · the notation runs out, then plain language is bound to it
    case 'expertise':
      return solution ? (
        <>
          <rect x="10" y="12" width="36" height="7" stroke={HAIRLINE} />
          <path d="M28 19v12" stroke={INK} />
          <rect x="10" y="31" width="36" height="7" stroke={INK} />
          <path d="M22 44l3 3 6-7" stroke={INK} />
        </>
      ) : (
        <>
          <path d="M10 22h6M20 22h4M28 22h3" stroke={INK} strokeWidth="2" />
          <path d="M10 32h9M23 32h5" stroke={INK} strokeWidth="2" />
          <path
            d={dots([
              [35, 22], [40, 21], [45, 24], [34, 32], [39, 33], [44, 30],
              [37, 27], [43, 37], [33, 38],
            ])}
            stroke={HAIRLINE}
            strokeWidth="2"
          />
        </>
      );

    // 4 · assumptions arrive unchecked, then they are stopped at the boundary
    case 'environment':
      return (
        <>
          <rect x="18" y="18" width="20" height="20" stroke={INK} />
          <path d="M6 24h10M6 32h10M24 6v10M32 6v10" stroke={HAIRLINE} />
          {solution ? (
            <>
              <path d="M16 21v6M16 29v6M21 16h6M29 16h6" stroke={INK} />
            </>
          ) : (
            <>
              <path d="M16 24h6M16 32h6M24 16v6M32 16v6" stroke={HAIRLINE} />
              <path d="M42 20l6 6M48 20l-6 6M42 34l6 6M48 34l-6 6" stroke={INK} />
              <path d="M38 23h10M38 37h10" stroke={HAIRLINE} strokeDasharray="2 2" />
            </>
          )}
        </>
      );

    // 5 · a path exists around the plane, then it does not
    case 'bypass':
      return (
        <>
          <rect x="8" y="20" width="40" height="22" stroke={HAIRLINE} />
          <path d="M28 20v22" stroke={INK} />
          {solution ? (
            <>
              <rect x="25" y="27" width="6" height="8" stroke={INK} fill="var(--slate-800)" />
              <path d="M12 31h11M33 31h11" stroke={HAIRLINE} strokeDasharray="2 2" />
            </>
          ) : (
            <>
              <path d="M14 20C14 8 42 8 42 20" stroke={INK} strokeDasharray="3 3" />
              <path d="M25 9l6 6M31 9l-6 6" stroke={INK} />
            </>
          )}
        </>
      );

    // 6 · the evidence is older than the window, then it is inside it
    case 'staleness':
      return (
        <>
          <path d="M9 38h38" stroke={HAIRLINE} />
          <path d="M24 32v12" stroke={INK} strokeDasharray="2 2" />
          <rect
            x="9"
            y="22"
            width={solution ? 13 : 33}
            height="9"
            stroke={INK}
          />
          {solution ? (
            <path d="M34 24l3 3 6-7" stroke={INK} />
          ) : (
            <path d="M24 17h18M24 14v6M42 14v6" stroke={HAIRLINE} />
          )}
        </>
      );

    // 7 · an action nobody registered, then the same action routed to review
    case 'registry': {
      const row: [number, number][] = [[12, 26], [20, 26], [28, 26], [36, 26], [44, 26]];
      return (
        <>
          <path d="M8 26h40" stroke={HAIRLINE} />
          <path d={dots(row)} stroke={HAIRLINE} strokeWidth="4" />
          {solution ? (
            <>
              <path d="M8 44h40" stroke={INK} strokeDasharray="3 3" />
              <path d="M36 28v16" stroke={INK} />
              <path d="M34 42h4v4h-4z" stroke={INK} />
            </>
          ) : (
            <>
              <path d="M34 8h4v4h-4z" stroke={INK} />
              <path d="M36 14v8" stroke={INK} strokeDasharray="2 2" />
            </>
          )}
        </>
      );
    }

    // 8 · the chain has a gap, then four things are bound and hashed
    case 'derivation':
      return solution ? (
        <>
          <path d="M14 12v32M14 12h4M14 44h4" stroke={INK} />
          <rect x="20" y="12" width="26" height="6" stroke={HAIRLINE} />
          <rect x="20" y="21" width="26" height="6" stroke={HAIRLINE} />
          <rect x="20" y="30" width="26" height="6" stroke={HAIRLINE} />
          <rect x="20" y="39" width="26" height="6" stroke={HAIRLINE} />
          <path d="M20 50h18" stroke={INK} />
        </>
      ) : (
        <>
          <rect x="8" y="24" width="14" height="9" rx="4" stroke={HAIRLINE} />
          <rect x="34" y="24" width="14" height="9" rx="4" stroke={HAIRLINE} />
          <path d="M23 28.5h10" stroke={INK} strokeDasharray="2 2" />
          <path d="M25 24l6 9M31 24l-6 9" stroke={INK} />
        </>
      );
  }
}
