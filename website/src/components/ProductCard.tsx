import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const p = product;
  const onSale = p.comparePrice && p.comparePrice > p.price;
  const badge =
    p.kind === "in-stock" ? "In stock" : p.featured ? "Bespoke" : "Made to order";

  return (
    <Link href={`/product/${p.slug}`} className="card-c group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-walnut-2">
        {p.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.images[0]}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-sand">No image</div>
        )}
        <span className="absolute left-3 top-3 rounded-btn bg-cream/95 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-terra">
          {badge}
        </span>
        {onSale ? (
          <span className="absolute right-3 top-3 rounded-btn bg-terra px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-deep">
            Offer
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <h3 className="font-display text-[16px] font-semibold tracking-[0.02em] text-cream">
          {p.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[15px] leading-snug text-sand">{p.tagline}</p>
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="font-display text-[15px] font-semibold text-cream">
            {formatPKR(p.price)}
          </span>
          {onSale ? (
            <span className="text-[14px] text-sand line-through">{formatPKR(p.comparePrice!)}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
