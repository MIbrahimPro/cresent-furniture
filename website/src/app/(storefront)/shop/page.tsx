import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getActiveCategories, getVariantFacets, searchProducts } from "@/lib/catalog";
import { toPlainList } from "@/lib/serialize";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters, SortSelect } from "@/components/ShopFilters";
import type { CatalogFilter } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse handcrafted living, dining, bedroom, and office furniture by Crescent.",
};

interface SearchParams {
  q?: string;
  category?: string;
  band?: string;
  variant?: string;
  availability?: string;
  sort?: string;
}

function parseBand(band?: string): { min?: number; max?: number } {
  if (!band) return {};
  const [min, max] = band.split("-").map((s) => (s ? Number(s) : undefined));
  return { min, max };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { min, max } = parseBand(sp.band);

  const filter: CatalogFilter = {
    q: sp.q,
    category: sp.category,
    min,
    max,
    variant: sp.variant,
    availability: sp.availability as CatalogFilter["availability"],
    sort: sp.sort as CatalogFilter["sort"],
  };

  let products = [] as Awaited<ReturnType<typeof searchProducts>>;
  let categories: { slug: string; name: string; description?: string }[] = [];
  let facets: Record<string, string[]> = {};
  let dbError = false;
  try {
    [products, categories, facets] = await Promise.all([
      searchProducts(filter),
      getActiveCategories(),
      getVariantFacets(),
    ]);
  } catch {
    dbError = true;
  }

  const activeCategory = categories.find((c) => c.slug === sp.category);

  return (
    <>
      {/* ============ SHOP HEAD — exact h.html .sh-head ============ */}
      <div className="sh-head">
        <div className="wrap">
          <h1>
            {sp.q
              ? (
                <>
                  Results for <em>&ldquo;{sp.q}&rdquo;</em>
                </>
              )
              : activeCategory
                ? (
                    <>
                      {activeCategory.name.split(" ").slice(0, -1).join(" ")}{" "}
                      <em>{activeCategory.name.split(" ").slice(-1)}</em>
                    </>
                  )
                : (
                  <>
                    Everything, <em>under one roof.</em>
                  </>
                )}
          </h1>
          <p className="cnt">
            <span>{products.length}</span>{" "}
            {products.length === 1 ? "piece" : "pieces"} on the floor — new stock lands every
            week.
          </p>
        </div>
      </div>

      <div className="wrap">
        {/* ============ TOOLBAR — exact h.html: chips + custom sort ============ */}
        <div className="toolbar">
          <Suspense fallback={null}>
            <ShopChips
              categories={toPlainList(categories)}
              active={sp.category}
              q={sp.q}
              band={sp.band}
              variant={sp.variant}
              availability={sp.availability}
              facets={facets}
            />
          </Suspense>
          <span className="tspace" />
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <ShopFilters data={{ categories: toPlainList(categories), variantFacets: facets }} />
        </Suspense>

        {dbError ? (
          <p className="panel-c mt-10 p-6 font-body text-[16px] text-ink-soft">
            The catalogue is resting — the database is unreachable. Run <code>npm run seed</code> and
            refresh.
          </p>
        ) : products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-[24px] text-ink">Nothing matches that search</p>
            <p className="mx-auto mt-3 max-w-md font-body text-[15.5px] text-mute">
              Try a different word, or clear a filter or two — or bring the idea to the workshop and
              we&rsquo;ll build it.
            </p>
            <Link href="/shop" className="lnk mt-8">
              Clear everything <i>→</i>
            </Link>
          </div>
        ) : (
          <div className="pgrid">
            {toPlainList(products).map((p) => (
              <ProductCard key={String(p._id)} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* ============ BSTRIP — espresso CTA ============ */}
      <div className="bstrip">
        <h2>
          Better in person. <em>Come see it.</em>
        </h2>
        <p>
          Photos are honest, fabric is honest-er. The showroom is on Murree Road — open daily, 10am
          to 8pm, chai on the house.
        </p>
        <Link className="btn btn-cream" href="/visit" data-track="shop-bstrip">
          Plan a visit
        </Link>
      </div>
    </>
  );
}

/**
 * Category chips in the h.html .ft style, plus the mobile variant filter
 * sheet. Desktop shows all chips; on narrow screens the row scrolls
 * horizontally (no-sidebar layout, matching h.html exactly).
 */
async function ShopChips({
  categories,
  active,
  q,
  band,
  variant,
  availability,
  facets,
}: {
  categories: { slug: string; name: string }[];
  active?: string;
  q?: string;
  band?: string;
  variant?: string;
  availability?: string;
  facets: Record<string, string[]>;
}) {
  const current = new URLSearchParams();
  if (q) current.set("q", q);
  if (band) current.set("band", band);
  if (variant) current.set("variant", variant);
  if (availability) current.set("availability", availability);

  function chipHref(slug?: string) {
    const next = new URLSearchParams(current);
    if (slug) next.set("category", slug);
    else next.delete("category");
    const s = next.toString();
    return s ? `/shop?${s}` : "/shop";
  }

  const chips: { label: string; href: string; on: boolean }[] = [
    { label: "All", href: chipHref(undefined), on: !active },
    ...categories.map((c) => ({
      label: c.name,
      href: chipHref(c.slug),
      on: active === c.slug,
    })),
  ];

  return (
    <>
      <nav aria-label="Categories" className="no-scrollbar -my-2 flex max-w-full items-center gap-6 overflow-x-auto pb-0.5">
        {chips.map((c) => (
          <Link key={c.label} href={c.href} className={`ft ${c.on ? "on" : ""} shrink-0`}>
            {c.label}
          </Link>
        ))}
      </nav>
      {/* Variant/availability refinements stay available via the custom sort row on mobile */}
      {Object.keys(facets).length > 0 && variant ? (
        <span className="font-detail text-[11px] font-medium uppercase tracking-[0.16em] text-terra">
          {variant} only
        </span>
      ) : null}
    </>
  );
}
