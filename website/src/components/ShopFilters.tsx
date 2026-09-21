"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export interface FilterData {
  categories: { slug: string; name: string }[];
  variantFacets: Record<string, string[]>;
}

const PRICE_BANDS: { label: string; min?: number; max?: number }[] = [
  { label: "Under 50,000", max: 50000 },
  { label: "50,000 – 100,000", min: 50000, max: 100000 },
  { label: "100,000 – 200,000", min: 100000, max: 200000 },
  { label: "200,000 & above", min: 200000 },
];

export function ShopFilters({ data }: { data: FilterData }) {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
    },
    [params, router],
  );

  const category = params.get("category");
  const band = params.get("band");
  const variant = params.get("variant");
  const availability = params.get("availability");
  const hasFilters = category || band || variant || availability;

  return (
    <aside className="space-y-8">
      <FilterGroup title="Category">
        <ul className="space-y-2">
          <FilterLink active={!category} onClick={() => setParam("category", null)}>
            All furniture
          </FilterLink>
          {data.categories.map((c) => (
            <FilterLink
              key={c.slug}
              active={category === c.slug}
              onClick={() => setParam("category", c.slug)}
            >
              {c.name}
            </FilterLink>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Price">
        <ul className="space-y-2">
          {PRICE_BANDS.map((b) => {
            const value = `${b.min ?? ""}-${b.max ?? ""}`;
            return (
              <FilterLink
                key={b.label}
                active={band === value}
                onClick={() => setParam("band", band === value ? null : value)}
              >
                {b.label}
              </FilterLink>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Availability">
        <ul className="space-y-2">
          <FilterLink active={!availability} onClick={() => setParam("availability", null)}>
            Everything
          </FilterLink>
          <FilterLink
            active={availability === "in-stock"}
            onClick={() => setParam("availability", availability === "in-stock" ? null : "in-stock")}
          >
            Ready to deliver
          </FilterLink>
          <FilterLink
            active={availability === "made-to-order"}
            onClick={() =>
              setParam("availability", availability === "made-to-order" ? null : "made-to-order")
            }
          >
            Made to order
          </FilterLink>
        </ul>
      </FilterGroup>

      {Object.entries(data.variantFacets).map(([group, options]) => (
        <FilterGroup key={group} title={group}>
          <ul className="space-y-2">
            {options.map((opt) => {
              const value = `${group}:${opt}`;
              return (
                <FilterLink
                  key={opt}
                  active={variant === value}
                  onClick={() => setParam("variant", variant === value ? null : value)}
                >
                  {opt}
                </FilterLink>
              );
            })}
          </ul>
        </FilterGroup>
      ))}

      {hasFilters ? (
        <button
          type="button"
          onClick={() => router.push("/shop", { scroll: false })}
          className="text-[14px] text-terra underline underline-offset-4 hover:text-terra"
        >
          Clear all filters
        </button>
      ) : null}
    </aside>
  );
}

export function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get("sort") ?? "featured";

  return (
    <label className="flex items-center gap-2 text-[14px] text-sand">
      <span className="whitespace-nowrap font-display text-[11px] uppercase tracking-[0.16em]">
        Sort
      </span>
      <select
        value={sort}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value === "featured") next.delete("sort");
          else next.set("sort", e.target.value);
          const qs = next.toString();
          router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
        }}
        className="input-c min-h-[40px] w-auto py-1.5"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name">Name A–Z</option>
        <option value="newest">Newest</option>
      </select>
    </label>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-[12px] font-semibold uppercase tracking-[0.2em] text-cream">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function FilterLink({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`text-left text-[16px] transition-colors ${
          active ? "font-medium text-terra underline underline-offset-4" : "text-sand/80 hover:text-terra"
        }`}
      >
        {children}
      </button>
    </li>
  );
}
