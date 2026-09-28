/**
 * Crescent wordmarks — real HTML type (Marcellus, next/font) instead of
 * SVG textLength stretching, so letter spacing renders exactly as the
 * font intends. The terracotta arc is a small inline SVG.
 */

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`wm-mark ${className ?? ""}`}>
      <svg className="wm-arc" viewBox="0 0 100 12" aria-hidden focusable="false">
        <path d="M6 10.4 Q50 2 94 10.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="wm-text">CRESCENT</span>
    </span>
  );
}

/** Full centered lockup for the footer: arc, caps, rules + descriptor. */
export function LogoLockup({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const color = tone === "dark" ? "var(--color-cream)" : "var(--color-ink)";
  return (
    <span className={`lockup ${className ?? ""}`}>
      <svg className="lockup-arc" viewBox="0 0 600 24" aria-hidden focusable="false">
        <path d="M20 22 Q300 2 580 22" fill="none" stroke="var(--color-terra)" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span className="lockup-caps" style={{ color }}>
        CRESCENT
      </span>
      <span className="lockup-sub" style={{ color }}>
        <i className="lockup-rule" />
        BESPOKE FURNITURE HOUSE
        <i className="lockup-rule" />
      </span>
    </span>
  );
}
