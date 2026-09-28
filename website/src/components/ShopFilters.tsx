"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export interface FilterData {
  categories: { slug: string; name: string }[];
  variantFacets: Record<string, string[]>;
}

/** Remember popup openness across server re-renders (every filter click
 * re-renders the page server-side, which would otherwise close the modal). */
let keepOpen = false;

const BANDS = [
  { label: "Under 50,000", value: "-50000" },
  { label: "50,000 – 100,000", value: "50000-100000" },
  { label: "100,000 – 200,000", value: "100000-200000" },
  { label: "200,000 & above", value: "200000-" },
];

/**
 * "Filters" — a centered modal over a dimmed page. Every click applies
 * instantly (no Apply step); the modal stays open so you can stack filters.
 * Availability is in-store only — everything on the floor is ready to deliver.
 */
export function ShopFilters({ data }: { data: FilterData }) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(keepOpen);

  useEffect(() => {
    keepOpen = open;
  }, [open]);

  // Escape closes; page scroll locks while the modal is up
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  /** Apply immediately — read the live URL so rapid clicks never clobber. */
  function setParam(key: "band" | "variant" | "availability", value: string | null) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }

  const band = params.get("band");
  const variant = params.get("variant");
  const availability = params.get("availability");
  const activeCount = [band, variant, availability].filter(Boolean).length;

  function clearAll() {
    const next = new URLSearchParams(window.location.search);
    for (const k of ["band", "variant", "availability"]) next.delete(k);
    const qs = next.toString();
    router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }

  return (
    <div className="filterbar">
      <div className="filterbar-row">
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className={`filtertoggle ${open || activeCount ? "on" : ""}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filters
          {activeCount > 0 ? <i className="filtercount">{activeCount}</i> : null}
        </button>

        {/* Applied-filter chips — visible proof of what's active, each removable */}
        {activeCount > 0 ? (
          <div className="filterchips">
            {band ? (
              <Removable label={BANDS.find((b) => b.value === band)?.label ?? band} onRemove={() => setParam("band", null)} />
            ) : null}
            {availability ? (
              <Removable label="Ready to deliver" onRemove={() => setParam("availability", null)} />
            ) : null}
            {variant ? (
              <Removable label={variant.split(":").pop() ?? variant} onRemove={() => setParam("variant", null)} />
            ) : null}
            <button type="button" className="filterclear" onClick={clearAll}>
              Clear all ✕
            </button>
          </div>
        ) : null}
      </div>

      {open ? (
        <>
          <div className="filterveil" onClick={() => setOpen(false)} aria-hidden />
          <div className="filterpop" role="dialog" aria-modal="true" aria-label="Filter products">
            <header className="filterpop-head">
              <h3 className="filterpop-title">
                Filters
                {activeCount > 0 ? <span className="filterpop-count"> · {activeCount} active</span> : null}
              </h3>
              <button type="button" className="filterpop-x" onClick={() => setOpen(false)} aria-label="Close filters">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </header>

            <div className="filterpop-grid">
              <section>
                <h4 className="filterpop-h">Price</h4>
                <ul>
                  {BANDS.map((b) => (
                    <li key={b.value}>
                      <Pick active={band === b.value} onClick={() => setParam("band", band === b.value ? null : b.value)}>
                        {b.label}
                      </Pick>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h4 className="filterpop-h">Availability</h4>
                <ul>
                  <li>
                    <Pick
                      active={availability === "in-stock"}
                      onClick={() => setParam("availability", availability === "in-stock" ? null : "in-stock")}
                    >
                      Ready to deliver
                    </Pick>
                  </li>
                </ul>
                <p className="filterpop-note">
                  Everything on our floor is stocked and ready — nothing here is made to order.
                </p>
              </section>
              {Object.entries(data.variantFacets).map(([group, options]) => (
                <section key={group}>
                  <h4 className="filterpop-h">{group}</h4>
                  <ul>
                    {options.map((opt) => {
                      const value = `${group}:${opt}`;
                      return (
                        <li key={opt}>
                          <Pick
                            active={variant === value}
                            onClick={() => setParam("variant", variant === value ? null : value)}
                          >
                            {opt}
                          </Pick>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>

            <footer className="filterpop-foot">
              {activeCount > 0 ? (
                <button type="button" className="filterwipe" onClick={clearAll}>
                  Clear all
                </button>
              ) : (
                <span />
              )}
              <button type="button" className="filterdone" onClick={() => setOpen(false)}>
                Done
              </button>
            </footer>
          </div>
        </>
      ) : null}
    </div>
  );
}

function Removable({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button type="button" className="filterchip" onClick={onRemove} aria-label={`Remove filter ${label}`}>
      {label} <span aria-hidden>✕</span>
    </button>
  );
}

function Pick({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={`filterpick ${active ? "on" : ""}`} aria-pressed={active}>
      {children}
      {active ? <span aria-hidden>—</span> : null}
    </button>
  );
}

const SORT_OPTIONS = [
  { value: "featured", label: "Featured", short: "Featured" },
  { value: "price-asc", label: "Price · low to high", short: "Price ↑" },
  { value: "price-desc", label: "Price · high to low", short: "Price ↓" },
  { value: "newest", label: "Newest arrivals", short: "Newest" },
  { value: "name", label: "Name · A to Z", short: "A – Z" },
] as const;

/**
 * Custom sort dropdown — a styled listbox (no native select chrome).
 * The trigger shows only the active choice so it never clips in the toolbar.
 */
export function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get("sort") ?? "featured";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0];

  function choose(value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value === "featured") next.delete("sort");
    else next.set("sort", value);
    const qs = next.toString();
    router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
    setOpen(false);
  }

  return (
    <div className="sortsel" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sort products — ${current.label}`}
        onClick={() => setOpen((v) => !v)}
        className="sortsel-btn"
      >
        <span className="sortsel-label">Sort</span>
        <span className="sortsel-value">{current.short}</span>
        <svg
          width="10"
          height="7"
          viewBox="0 0 12 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`sortsel-chev ${open ? "up" : ""}`}
        >
          <path d="m1 1 5 5 5-5" />
        </svg>
      </button>

      {open ? (
        <ul role="listbox" aria-label="Sort products" className="sortsel-pop">
          {SORT_OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === sort}
                onClick={() => choose(o.value)}
                className={`sortsel-opt ${o.value === sort ? "on" : ""}`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
