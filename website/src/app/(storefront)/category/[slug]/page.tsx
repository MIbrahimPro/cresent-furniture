import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveCategories, searchProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getActiveCategories();
  const cat = categories.find((c) => c.slug === slug);
  return { title: cat ? cat.name : "Category" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let categories: { slug: string; name: string; description?: string }[] = [];
  let products: Awaited<ReturnType<typeof searchProducts>> = [];
  try {
    categories = await getActiveCategories();
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) notFound();
    products = await searchProducts({ category: slug, sort: "featured" });
  } catch {
    // DB unreachable
  }

  const cat = categories.find((c) => c.slug === slug);
  const others = categories.filter((c) => c.slug !== slug);

  return (
    <div className="container-c py-12">
      <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
        <Link href="/" className="hover:text-coral-dark">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-coral-dark">Shop</Link>
        <span className="mx-2">/</span>
        <span>{cat?.name ?? slug}</span>
      </nav>

      <header className="mt-4 max-w-2xl">
        <p className="overline-c text-coral-dark">Category</p>
        <h1 className="display-c mt-3 text-[32px]">{cat?.name ?? slug}</h1>
        {cat?.description ? (
          <p className="mt-3 text-[17px] text-muted">{cat.description}</p>
        ) : null}
      </header>

      {products.length === 0 ? (
        <div className="panel-c mt-10 p-10 text-center text-muted">
          No pieces in this category yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={String(p._id)} product={p} />
          ))}
        </div>
      )}

      {others.length ? (
        <div className="mt-14 border-t border-line pt-8">
          <p className="font-display text-[12px] font-semibold uppercase tracking-[0.2em] text-muted">
            Keep browsing
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {others.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="btn btn-secondary btn-sm">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
