"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";

export interface NavLink {
  label: string;
  href: string;
}

export function Header({
  categories,
  announcement,
  pages,
}: {
  categories: NavLink[];
  announcement?: string;
  pages?: NavLink[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, ready } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md">
      {announcement ? (
        <div className="bg-maroon px-4 py-2 text-center">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
            {announcement}
          </p>
        </div>
      ) : null}

      <div className="container-c flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label="Crescent — home" className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/crescent-logo-light.svg" alt="Crescent — Bespoke Furniture House" className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          <NavLinkC href="/shop" label="Shop" active={isActive("/shop")} />
          {categories.map((c) => (
            <NavLinkC
              key={c.href}
              href={c.href}
              label={c.label}
              active={isActive(c.href)}
            />
          ))}
          {pages?.map((p) => (
            <NavLinkC key={p.href} href={p.href} label={p.label} active={isActive(p.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search products"
            onClick={() => setSearchOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-btn text-maroon transition-colors hover:bg-parchment"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          <Link
            href="/cart"
            aria-label={`Cart, ${ready ? count : 0} items`}
            className="relative grid h-10 w-10 place-items-center rounded-btn text-maroon transition-colors hover:bg-parchment"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7h12l-1.2 12.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8Z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
            </svg>
            {ready && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 font-display text-[10px] font-bold text-deep">
                {count}
              </span>
            ) : null}
          </Link>

          <Link href="/contact" className="btn btn-primary btn-sm hidden md:inline-flex">
            Enquire
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-btn text-maroon lg:hidden"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-line bg-cream">
          <form onSubmit={submitSearch} className="container-c flex gap-2 py-4" role="search">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tables, chairs, wardrobes…"
              className="input-c"
              aria-label="Search products"
            />
            <button type="submit" className="btn btn-primary btn-sm shrink-0">
              Search
            </button>
          </form>
        </div>
      ) : null}

      {menuOpen ? (
        <nav className="border-t border-line bg-cream lg:hidden" aria-label="Mobile">
          <div className="container-c flex flex-col gap-1 py-4">
            <MobileLink href="/shop" label="Shop All" onClick={() => setMenuOpen(false)} />
            {categories.map((c) => (
              <MobileLink key={c.href} href={c.href} label={c.label} onClick={() => setMenuOpen(false)} />
            ))}
            {pages?.map((p) => (
              <MobileLink key={p.href} href={p.href} label={p.label} onClick={() => setMenuOpen(false)} />
            ))}
            <MobileLink href="/contact" label="Contact" onClick={() => setMenuOpen(false)} />
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function NavLinkC({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative font-display text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors hover:text-coral-dark ${
        active ? "text-coral-dark" : "text-maroon"
      }`}
    >
      {label}
      {active ? <span className="absolute -bottom-[10px] left-0 right-0 h-0.5 bg-coral" /> : null}
    </Link>
  );
}

function MobileLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-btn px-3 py-3 font-display text-[13px] font-semibold uppercase tracking-[0.18em] text-maroon hover:bg-parchment"
    >
      {label}
    </Link>
  );
}
