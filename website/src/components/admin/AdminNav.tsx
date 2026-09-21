"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/hero", label: "Hero Media" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-line bg-ink lg:sticky lg:top-0 lg:h-screen lg:w-60">
      <div className="border-b border-cream/10 px-5 py-5">
        <p className="font-display text-[14px] font-semibold uppercase tracking-[0.2em] text-terra">
          Crescent
        </p>
        <p className="mt-0.5 text-[12px] text-cream/60">Workshop CRM</p>
      </div>

      <nav className="flex flex-row gap-1 overflow-x-auto p-3 no-scrollbar lg:flex-1 lg:flex-col lg:overflow-visible" aria-label="CRM">
        {LINKS.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-btn px-3.5 py-2.5 font-display text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                active ? "bg-terra text-deep" : "text-cream/80 hover:bg-cream/10 hover:text-cream"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-cream/10 p-4 lg:block">
        <p className="text-[14px] font-medium text-cream">{user.name}</p>
        <p className="truncate text-[12.5px] text-cream/55">{user.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 w-full rounded-btn border border-cream/25 px-3 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-cream/85 transition-colors hover:bg-cream/10"
        >
          Sign out
        </button>
        <Link
          href="/"
          className="mt-2 block text-center text-[12.5px] text-cream/55 underline underline-offset-4 hover:text-cream"
        >
          View storefront
        </Link>
      </div>
    </aside>
  );
}
