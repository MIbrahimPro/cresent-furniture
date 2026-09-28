"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { Wordmark } from "./Logo";
import { trackSearch } from "@/lib/track";

export interface NavLink {
  label: string;
  href: string;
}

/**
 * Minimal header: Home / Shop nav, better-surface search with a clear (×)
 * button, and a lightweight "Book a visit" popover — address, hours and an
 * embedded map — instead of a separate page.
 */
export function Header({
  announcement,
  pages,
}: {
  categories?: NavLink[];
  announcement?: string;
  pages?: NavLink[];
}) {
  const router = useRouter();
  const { count, ready } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    trackSearch(q.trim());
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <>
      <header className="hd">
        {announcement ? (
          <div className="bg-espresso text-center">
            <p className="px-4 py-2 font-detail text-[11px] font-medium uppercase tracking-[0.22em] text-mutd">
              {announcement}
            </p>
          </div>
        ) : null}

        <div className="wrap hdrow">
          <Link className="wm" href="/" aria-label="Crescent — home">
            <Wordmark />
          </Link>

          <nav>
            <Link href="/" data-active="true">Home</Link>
            <Link href="/shop">Shop</Link>
          </nav>

          <div className="hdactions">
            <button
              type="button"
              aria-label="Search products"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>

            <Link href="/cart" aria-label={`Cart, ${ready ? count : 0} items`} className="cartlink" data-track="header-cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {ready && count > 0 ? <sup>{count}</sup> : null}
            </Link>

            <Link href="/visit" className="visit" data-track="header-visit">
              Book a visit
            </Link>
          </div>

          <button
            className={`burger ${menuOpen ? "x" : ""}`}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
          </button>
        </div>

        {searchOpen ? (
          <div className="searchband" ref={searchRef}>
            <form onSubmit={submitSearch} className="wrap" role="search">
              <div className="searchbox">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden className="searchbox-ico">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search sofas, dining tables, beds…"
                  aria-label="Search products"
                />
                {q ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    className="searchbox-x"
                    onClick={() => {
                      setQ("");
                      searchRef.current?.querySelector("input")?.focus();
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                ) : null}
                <button type="submit" className="searchbox-go" disabled={!q.trim()}>
                  Search
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </header>

      <div className={`mnav ${menuOpen ? "open" : ""}`} id="mnav" aria-hidden={!menuOpen}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
        {pages?.slice(0, 2).map((p) => (
          <Link key={p.href} href={p.href} onClick={() => setMenuOpen(false)}>
            {p.label}
          </Link>
        ))}
        <Link href="/visit" className="mnav-visit" onClick={() => setMenuOpen(false)}>
          Book a visit →
        </Link>
        <p>Aaram ka hai naam.</p>
      </div>
    </>
  );
}
