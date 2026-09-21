import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const p = product;
  const onSale = p.comparePrice && p.comparePrice > p.price;
  const badge =
    p.kind === "in-stock" ? "In stock" : p.featured ? "Bespoke" : "Made to order";

  return (
    <Link href={`/product/${p.slug}`} className="card-c group block p-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-walnut-2">
        {p.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.images[0]}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="grid h-full place-items-center text-mute">No image</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-deep/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brass backdrop-blur-sm">
          {badge}
        </span>
        {onSale ? (
          <span className="absolute right-3 top-3 rounded-full bg-sale px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream">
            Offer
          </span>
        ) : null}
      </div>
      <div className="px-3 pb-4 pt-4">
        <h3 className="font-display text-[17px] font-medium leading-snug text-cream transition-colors group-hover:text-terra">
          {p.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-mute">{p.tagline}</p>
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="font-display text-[16px] font-semibold text-cream">
            {formatPKR(p.price)}
          </span>
          {onSale ? (
            <span className="text-[13px] text-mute line-through">{formatPKR(p.comparePrice!)}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
