"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { Logo } from "./Logo";

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
    <header className="sticky top-0 z-40 border-b border-line bg-deep/80 backdrop-blur-xl">
      {announcement ? (
        <div className="bg-terra-veil px-4 py-2 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass">
            {announcement}
          </p>
        </div>
      ) : null}

      <div className="container-c flex h-[76px] items-center justify-between gap-4">
        <Link href="/" aria-label="Crescent — home" className="flex shrink-0 items-center">
          <Logo className="h-14 w-auto" />
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search products"
            onClick={() => setSearchOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full text-sand transition-colors hover:bg-walnut-2 hover:text-cream"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          <Link
            href="/cart"
            aria-label={`Cart, ${ready ? count : 0} items`}
            className="relative grid h-11 w-11 place-items-center rounded-full text-sand transition-colors hover:bg-walnut-2 hover:text-cream"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8h12l-1.1 11.2a2 2 0 0 1-2 1.8H9.1a2 2 0 0 1-2-1.8L6 8Z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
              <path d="M4.5 8h15" />
            </svg>
            {ready && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terra px-1 text-[10px] font-bold text-deep">
                {count}
              </span>
            ) : null}
          </Link>

          <Link href="/contact" className="btn btn-primary btn-sm ml-1 hidden md:inline-flex">
            Enquire
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full text-sand transition-colors hover:bg-walnut-2 hover:text-cream lg:hidden"
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
        <div className="border-t border-line bg-deep/95">
          <form onSubmit={submitSearch} className="container-c flex gap-3 py-4" role="search">
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
        <nav className="border-t border-line bg-deep/95 lg:hidden" aria-label="Mobile">
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
      className={`relative rounded-full px-1 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors ${
        active ? "text-cream" : "text-sand hover:text-cream"
      }`}
    >
      {label}
      <span
        aria-hidden
        className={`absolute inset-x-1 -bottom-0.5 h-[3px] rounded-full bg-terra transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
    </Link>
  );
}

function MobileLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-2xl px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-sand transition-colors hover:bg-walnut-2 hover:text-cream"
    >
      {label}
    </Link>
  );
}
