/**
 * Scene B, composed frame. The corridor, the gate plane, the policy tokens
 * being read, the permitted lane and the hold lane.
 *
 * Interception is a chokepoint, so the drawing is spatial: there is no way
 * through the corridor that does not cross the plane.
 */
export function GateStill({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 520"
      className={className}
      role="img"
      aria-label="An isometric corridor. An intent packet enters from the left and meets a translucent plane, the gate. Three policy tokens, R-207, R-311 and R-402, orbit the plane. Beyond it the corridor splits: a permitted lane continues to the right, and a held lane drops away, where one packet is parked for review."
    >
      {/* corridor floor */}
      <g stroke="var(--hairline)" strokeWidth="1" fill="none">
        <path d="M40 400L430 330L860 372" />
        <path d="M40 190L430 150L860 178" />
        <path d="M40 190L40 400" />
        <path d="M860 178L860 372" />
        <path d="M150 372L150 178" strokeOpacity="0.5" />
        <path d="M265 352L265 166" strokeOpacity="0.5" />
        <path d="M600 340L600 156" strokeOpacity="0.5" />
        <path d="M730 356L730 166" strokeOpacity="0.5" />
      </g>

      {/* the gate: a translucent plane across the whole corridor */}
      <path
        d="M430 150L430 330L455 336L455 156Z"
        fill="var(--gate)"
        fillOpacity="0.1"
        stroke="var(--gate)"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <text
        x="442"
        y="130"
        textAnchor="middle"
        fill="var(--gate)"
        fontSize="11"
        letterSpacing="1.5"
        fontFamily="var(--font-mono)"
      >
        GATE
      </text>

      {/* the intent packet, entering */}
      <g>
        <rect x="118" y="256" width="26" height="26" fill="var(--slate-800)" stroke="var(--ink-400)" />
        <text x="131" y="308" textAnchor="middle" fill="var(--ink-500)" fontSize="11" fontFamily="var(--font-mono)">
          intent
        </text>
        <path d="M152 269h230" stroke="var(--ink-500)" strokeWidth="1" strokeDasharray="3 4" fill="none" />
        <path d="M378 264l9 5-9 5z" fill="var(--ink-500)" />
      </g>

      {/* policy tokens, orbiting the plane */}
      {[
        { x: 352, y: 176, label: 'R-207' },
        { x: 486, y: 210, label: 'R-311' },
        { x: 358, y: 300, label: 'R-402' },
      ].map((token) => (
        <g key={token.label}>
          <rect
            x={token.x}
            y={token.y}
            width="56"
            height="20"
            fill="var(--slate-900)"
            stroke="var(--hairline)"
          />
          <text
            x={token.x + 28}
            y={token.y + 14}
            textAnchor="middle"
            fill="var(--ink-400)"
            fontSize="11"
            fontFamily="var(--font-mono)"
          >
            {token.label}
          </text>
        </g>
      ))}
      <g stroke="var(--hairline)" strokeWidth="1" strokeDasharray="2 3" fill="none">
        <path d="M408 186L432 200" />
        <path d="M486 220L458 226" />
        <path d="M414 306L434 292" />
      </g>

      {/* permitted lane */}
      <g>
        <path d="M470 244h280" stroke="var(--gate)" strokeWidth="1" strokeOpacity="0.7" fill="none" />
        <path d="M746 239l9 5-9 5z" fill="var(--gate)" />
        <rect x="762" y="231" width="26" height="26" fill="var(--slate-800)" stroke="var(--gate)" />
        <text x="775" y="284" textAnchor="middle" fill="var(--gate)" fontSize="11" fontFamily="var(--font-mono)">
          ALLOW
        </text>
      </g>

      {/* hold lane */}
      <g>
        <path
          d="M470 268C560 268 580 392 660 392"
          stroke="var(--hold)"
          strokeWidth="1"
          strokeOpacity="0.7"
          fill="none"
        />
        <path d="M656 387l9 5-9 5z" fill="var(--hold)" />
        <rect x="676" y="379" width="26" height="26" fill="var(--slate-800)" stroke="var(--hold)" />
        <text x="722" y="397" fill="var(--hold)" fontSize="11" fontFamily="var(--font-mono)">
          REVIEW
        </text>
        <text x="676" y="430" fill="var(--ink-500)" fontSize="11" fontFamily="var(--font-mono)">
          queue:refund-escalation
        </text>
      </g>
    </svg>
  );
}
