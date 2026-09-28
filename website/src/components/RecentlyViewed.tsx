"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { readHistory } from "@/lib/track";
import { ProductCard } from "./ProductCard";
import { api } from "@/lib/api";

/**
 * Personalized strip: reads the visitor's localStorage browsing history and
 * renders those pieces. Renders nothing for first-time visitors — the home
 * page simply flows without an empty gap.
 */
export function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const history = readHistory();
    if (!history.length) return;
    let cancelled = false;
    const slugs = history.slice(0, 8).map((h) => h.slug);
    fetch(api("/api/") + `products/by-slugs?slugs=${encodeURIComponent(slugs.join(","))}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { products?: Product[] } | null) => {
        if (!cancelled && data?.products?.length) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="container-c section-flow">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="overline-c">For you</p>
          <h2 className="display-c mt-4 text-[30px] sm:text-[38px]">
            Since you were <span className="accent-i">last here.</span>
          </h2>
        </div>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={String(p._id)} product={p} />
        ))}
      </div>
    </section>
  );
}
