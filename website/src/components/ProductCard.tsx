import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const p = product;
  const onSale = p.comparePrice && p.comparePrice > p.price;

  return (
    <Link
      href={`/product/${p.slug}`}
      className="card-c group flex h-full flex-col p-2"
    >
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
      </div>
      <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
        <h3 className="font-display text-[17px] leading-snug text-cream transition-colors group-hover:text-terra [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] min-h-[2.75em] [overflow:hidden]">
          {p.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-mute">
          {p.tagline}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-[16px] font-semibold text-cream">
              {formatPKR(p.price)}
            </span>
            {onSale ? (
              <span className="text-[13px] text-mute line-through">
                {formatPKR(p.comparePrice!)}
              </span>
            ) : null}
          </div>
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full border border-line-strong text-sand transition-all duration-300 group-hover:border-terra group-hover:bg-terra group-hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
