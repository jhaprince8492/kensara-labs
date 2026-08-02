import { home } from '@/content/copy/home';

/**
 * The trusted boundary.
 *
 * The most important thing this drawing communicates is where the language
 * model is not: outside the solid boundary, in a dashed box, labelled advisory
 * and not authoritative. Draw it, do not just say it.
 */
export function TranslationBoundary() {
  const { diagram } = home.turn;

  return (
    <figure className="border border-hairline bg-slate-900 p-5 sm:p-7">
      <svg viewBox="0 0 720 300" className="w-full" role="img" aria-label={diagram.alt}>
        {/* the language model, outside the boundary */}
        <rect
          x="250"
          y="18"
          width="220"
          height="52"
          fill="none"
          stroke="var(--ink-500)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="360"
          y="42"
          textAnchor="middle"
          fill="var(--ink-400)"
          fontSize="13"
          fontFamily="var(--font-mono)"
        >
          advisory model
        </text>
        <text
          x="360"
          y="60"
          textAnchor="middle"
          fill="var(--ink-500)"
          fontSize="11"
          letterSpacing="1.5"
          fontFamily="var(--font-mono)"
        >
          {diagram.boundaryLabel}
        </text>
        <path
          d="M360 70v34"
          stroke="var(--ink-500)"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
        />

        {/* the trusted boundary */}
        <rect
          x="16"
          y="104"
          width="688"
          height="176"
          fill="none"
          stroke="var(--hairline)"
          strokeWidth="1"
        />
        <text
          x="30"
          y="126"
          fill="var(--ink-500)"
          fontSize="11"
          letterSpacing="1.5"
          fontFamily="var(--font-mono)"
        >
          {diagram.trustedLabel}
        </text>

        {/* requirement */}
        <rect x="44" y="150" width="256" height="96" fill="var(--slate-800)" stroke="var(--hairline)" />
        <text x="58" y="176" fill="var(--ink-500)" fontSize="11" letterSpacing="1.5" fontFamily="var(--font-mono)">
          {diagram.sourceLabel}
        </text>
        <text x="58" y="204" fill="var(--ink-100)" fontSize="13" fontFamily="var(--font-sans)">
          The pump shall not arm both
        </text>
        <text x="58" y="224" fill="var(--ink-100)" fontSize="13" fontFamily="var(--font-sans)">
          timers in the same cycle.
        </text>

        {/* the compile step */}
        <path d="M300 198h116" stroke="var(--proof)" strokeWidth="1" strokeOpacity="0.6" fill="none" />
        <path d="M410 193l8 5-8 5z" fill="var(--proof)" fillOpacity="0.8" />

        {/* specification */}
        <rect x="420" y="150" width="256" height="96" fill="var(--slate-800)" stroke="var(--proof)" strokeOpacity="0.35" />
        <text x="434" y="176" fill="var(--ink-500)" fontSize="11" letterSpacing="1.5" fontFamily="var(--font-mono)">
          {diagram.targetLabel}
        </text>
        <text x="434" y="208" fill="var(--proof)" fontSize="16" fontFamily="var(--font-mono)">
          {diagram.targetText}
        </text>
      </svg>

      {/* The sentence that separates this from every other AI verification
          product, so it is set at reading size rather than as a caption. */}
      <figcaption className="mt-5 border-t border-hairline pt-5 text-17 text-ink-100">
        {diagram.caption}
      </figcaption>
    </figure>
  );
}
