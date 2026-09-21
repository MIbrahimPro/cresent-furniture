import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const p = product;
  const onSale = p.comparePrice && p.comparePrice > p.price;

  return (
    <Link href={`/product/${p.slug}`} className="card-c group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-walnut-2">
        {p.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.images[0]}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center text-mute">No image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h3 className="font-display text-[17px] leading-snug text-cream transition-colors group-hover:text-terra [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] min-h-[2.6em] [overflow:hidden]">
          {p.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-mute">
          {p.tagline}
        </p>
        <div className="mt-auto flex items-baseline gap-2.5 pt-2.5">
          <span className="font-display text-[16px] font-semibold text-cream">
            {formatPKR(p.price)}
          </span>
          {onSale ? (
            <span className="text-[13px] text-mute line-through">
              {formatPKR(p.comparePrice!)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
