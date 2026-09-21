"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/format";

export function ProductRow({ product: p }: { product: Product }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(`Remove "${p.name}" from the catalogue?`)) return;
    setBusy(true);
    await fetch(`/api/admin/products/${p._id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <tr className="align-middle">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-11 w-14 shrink-0 overflow-hidden rounded-card bg-parchment">
            {p.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-maroon">{p.name}</p>
            <p className="truncate text-[13px] text-muted">{p.slug}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 capitalize text-ink/85">{p.categorySlug}</td>
      <td className="whitespace-nowrap px-5 py-3.5">{formatPKR(p.price)}</td>
      <td className="px-5 py-3.5">
        {p.kind === "in-stock" ? `${p.stock}` : <span className="text-muted">to order</span>}
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${
            p.active ? "bg-coral-tint text-coral-dark" : "bg-parchment text-muted"
          }`}
        >
          {p.active ? "Live" : "Hidden"}
        </span>
        {p.featured ? (
          <span className="ml-1.5 rounded-full bg-maroon px-2.5 py-1 text-[12px] font-medium text-cream">
            Featured
          </span>
        ) : null}
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-right">
        <Link href={`/admin/products/${p._id}`} className="text-[14px] font-medium text-coral-dark hover:underline">
          Edit
        </Link>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="ml-4 text-[14px] text-muted hover:text-coral-dark hover:underline disabled:opacity-40"
        >
          {busy ? "…" : "Delete"}
        </button>
      </td>
    </tr>
  );
}
