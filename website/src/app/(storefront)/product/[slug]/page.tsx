import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveCategories, getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getSettings } from "@/lib/settings";
import { toPlainDoc, toPlainList } from "@/lib/serialize";
import { ProductDetail } from "@/components/AddToCartPanel";
import { ProductCard } from "@/components/ProductCard";
import { ReviewsSection } from "@/components/ReviewsSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: { images: product.images?.[0] ? [product.images[0]] : [] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [settings, related, categories] = await Promise.all([
    getSettings(),
    getRelatedProducts(product, 4),
    getActiveCategories(),
  ]);
  const categoryName =
    toPlainList(categories).find((c) => c.slug === product.categorySlug)?.name ??
    product.categorySlug;

  return (
    <div className="container-c py-12">
      <nav aria-label="Breadcrumb" className="crumbs">
        <Link href="/">Home</Link>
        <span aria-hidden>—</span>
        <Link href={`/shop?category=${product.categorySlug}`}>{categoryName}</Link>
        <span aria-hidden>—</span>
        <span className="crumbs-here">{product.name}</span>
      </nav>

      <div className="mt-8">
        <ProductDetail product={toPlainDoc(product)} whatsapp={settings.business.whatsapp} />
      </div>

      {related.length ? (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="display-c text-[24px]">From the same room</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {toPlainList(related).map((p) => (
              <ProductCard key={String(p._id)} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      <ReviewsSection productSlug={slug} />
    </div>
  );
}
