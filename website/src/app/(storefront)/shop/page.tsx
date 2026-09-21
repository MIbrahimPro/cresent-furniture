import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getActiveCategories, getVariantFacets, searchProducts } from "@/lib/catalog";
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
    <div className="container-c py-12">
      <nav aria-label="Breadcrumb" className="text-[14px] text-sand">
        <Link href="/" className="hover:text-terra">Home</Link>
        <span className="mx-2">/</span>
        <span>{activeCategory ? activeCategory.name : "Shop"}</span>
      </nav>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="overline-c text-terra">The Collection</p>
          <h1 className="display-c mt-3 text-[32px]">
            {sp.q
              ? `Results for “${sp.q}”`
              : activeCategory
                ? activeCategory.name
                : "All furniture"}
          </h1>
          {activeCategory?.description ? (
            <p className="mt-3 max-w-xl text-[17px] text-sand">{activeCategory.description}</p>
          ) : null}
        </div>
        <Suspense fallback={null}>
          <SortSelect />
        </Suspense>
      </header>

      {dbError ? (
        <p className="panel-c mt-10 p-6 text-[16px] text-sand">
          The catalogue is resting — the database is unreachable. Run <code>npm run seed</code> and
          refresh.
        </p>
      ) : (
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[250px_1fr]">
          <Suspense fallback={null}>
            <ShopFilters data={{ categories, variantFacets: facets }} />
          </Suspense>

          <div>
            <p className="text-[15px] text-sand">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
            {products.length === 0 ? (
              <div className="panel-c mt-4 p-10 text-center">
                <p className="font-display text-[22px] font-medium text-cream">
                  Nothing matches that search
                </p>
                <p className="mt-2 text-[16px] text-sand">
                  Try a different word, or clear a filter or two.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={String(p._id)} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
