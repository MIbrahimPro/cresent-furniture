import Link from "next/link";
import type { Product } from "@/lib/types";

/**
 * The exact h.html .pcard: 4/5 photo in .ph, hairline caption row with
 * name + flag + price, materials line, and the hover-reveal "Enquire →".
 */
export function ProductCard({ product }: { product: Product }) {
  const p = product;
  const onSale = p.comparePrice && p.comparePrice > p.price;

  return (
    <Link href={`/product/${p.slug}`} className="pcard" data-track={`card-${p.slug}`}>
      <div className="ph w-linen">
        {p.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images[0]} alt={p.name} loading="lazy" />
        ) : (
          <span aria-hidden />
        )}
      </div>
      <div className="pcap2">
        <div className="r1">
          <span className="pn">
            {p.name}
            {onSale ? <i>— Sale</i> : p.tagline && p.tagline.length <= 14 ? <i>— {p.tagline}</i> : null}
          </span>
          <span className="pp">PKR {p.price.toLocaleString("en-PK")}</span>
        </div>
        <div className="pm">{p.tagline || "Solid wood · in store now"}</div>
        <div className="enq" aria-hidden>
          Enquire →
        </div>
      </div>
    </Link>
  );
}
