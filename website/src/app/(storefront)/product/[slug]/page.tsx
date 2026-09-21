import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getSettings } from "@/lib/settings";
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

  const [settings, related] = await Promise.all([
    getSettings(),
    getRelatedProducts(product, 4),
  ]);

  return (
    <div className="container-c py-12">
      <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
        <Link href="/" className="hover:text-coral-dark">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-coral-dark">
          {product.categorySlug}
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="mt-8">
        <ProductDetail product={product} whatsapp={settings.business.whatsapp} />
      </div>

      <ReviewsSection productSlug={slug} />

      {related.length ? (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="display-c text-[24px]">From the same room</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={String(p._id)} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
