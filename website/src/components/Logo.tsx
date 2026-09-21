/**
 * Crescent wordmark, drawn inline so it renders in the site's own Marcellus
 * face (Trajan genre, matching the shop board). Compact drops the descriptor.
 */
export function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <svg
      viewBox={compact ? "0 0 340 92" : "0 0 340 128"}
      role="img"
      aria-label="Crescent — Bespoke Furniture House"
      className={className}
    >
      {/* sweep arc */}
      <path
        d="M42 34 Q170 2 298 34"
        fill="none"
        stroke="var(--color-terra)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <text
        x="170"
        y="76"
        textAnchor="middle"
        fill="var(--color-terra)"
        style={{
          font: '400 52px var(--font-display)',
          letterSpacing: '0.06em',
        }}
      >
        CRESCENT
      </text>
      {!compact ? (
        <>
          <line x1="14" y1="102" x2="52" y2="102" stroke="var(--color-cream)" strokeWidth="1.4" opacity="0.8" />
          <line x1="288" y1="102" x2="326" y2="102" stroke="var(--color-cream)" strokeWidth="1.4" opacity="0.8" />
          <text
            x="170"
            y="107"
            textAnchor="middle"
            fill="var(--color-cream)"
            style={{ font: '500 12px var(--font-body)', letterSpacing: '0.2em' }}
          >
            BESPOKE FURNITURE HOUSE
          </text>
        </>
      ) : null}
    </svg>
  );
}
