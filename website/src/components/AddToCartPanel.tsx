"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPKR, buildEnquiryUrl } from "@/lib/format";
import { useCart } from "./CartProvider";

export function ProductDetail({
  product,
  whatsapp,
}: {
  product: Product;
  whatsapp: string;
}) {
  const p = product;
  const { addItem } = useCart();
  const [imageIdx, setImageIdx] = useState(0);
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(p.variants.map((g) => [g.name, g.options[0]])),
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = useMemo(() => {
    let price = p.price;
    for (const g of p.variants) {
      const idx = g.options.indexOf(options[g.name]);
      if (idx >= 0 && g.priceDeltas?.[idx]) price += g.priceDeltas[idx];
    }
    return price;
  }, [p, options]);

  function select(group: string, option: string) {
    setOptions((prev) => ({ ...prev, [group]: option }));
    setAdded(false);
  }

  function addToCart() {
    addItem({
      productId: String(p._id),
      slug: p.slug,
      name: p.name,
      image: p.images?.[0],
      unitPrice,
      qty,
      options,
    });
    setAdded(true);
  }

  const outOfStock = p.kind === "in-stock" && p.stock <= 0;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="card-c aspect-[4/3] overflow-hidden bg-walnut-2">
          {p.images?.[imageIdx] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.images[imageIdx]} alt={p.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-sand">No image yet</div>
          )}
        </div>
        {p.images.length > 1 ? (
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
            {p.images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setImageIdx(i)}
                aria-label={`Image ${i + 1}`}
                className={`h-20 w-24 shrink-0 overflow-hidden rounded-card border-2 transition-colors ${
                  i === imageIdx ? "border-terra" : "border-transparent hover:border-line"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Details + purchase */}
      <div>
        <p className="overline-c text-terra">
          {p.kind === "in-stock" ? "Ready to deliver" : "Made to order"}
        </p>
        <h1 className="display-c mt-3 text-[30px] sm:text-[36px]">{p.name}</h1>
        <p className="mt-3 text-[18px] italic text-sand">{p.tagline}</p>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="font-display text-[24px] font-semibold text-cream">
            {formatPKR(unitPrice)}
          </span>
          {p.comparePrice && p.comparePrice > unitPrice ? (
            <span className="text-[17px] text-sand line-through">{formatPKR(p.comparePrice)}</span>
          ) : null}
        </div>

        {/* Variants */}
        {p.variants.map((g) => (
          <div key={g.name} className="mt-7">
            <p className="label-c">
              {g.name} — <span className="text-terra">{options[g.name]}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {g.options.map((opt) => {
                const idx = g.options.indexOf(opt);
                const delta = g.priceDeltas?.[idx];
                const selected = options[g.name] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => select(g.name, opt)}
                    aria-pressed={selected}
                    className={`min-h-[44px] rounded-btn border px-4 py-2 text-[15px] transition-colors ${
                      selected
                        ? "border-ink bg-ink text-cream"
                        : "border-line bg-walnut-2 text-sand hover:border-terra"
                    }`}
                  >
                    {opt}
                    {delta ? (
                      <span className="ml-1.5 text-[13px] opacity-70">
                        {delta > 0 ? `+${formatPKR(delta)}` : `−${formatPKR(Math.abs(delta))}`}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quantity + add */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-btn border border-line bg-walnut-2">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-[46px] w-11 place-items-center text-cream hover:text-terra"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center font-display text-[15px] font-semibold" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="grid h-[46px] w-11 place-items-center text-cream hover:text-terra"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={outOfStock}
            className="btn btn-primary flex-1 sm:flex-none sm:px-12"
          >
            {outOfStock ? "Sold out" : added ? "Added ✓" : "Add to selection"}
          </button>

          {added ? (
            <Link href="/cart" className="btn btn-secondary">
              Go to selection
            </Link>
          ) : null}
        </div>

        {outOfStock ? (
          <p className="mt-3 text-[15px] text-terra">
            This piece is between commissions — message the workshop on WhatsApp and we will make
            another.
          </p>
        ) : null}

        {/* Direct enquiry */}
        <a
          href={buildEnquiryUrl(whatsapp, p.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-terra hover:text-terra"
        >
          <WhatsGlyph /> Ask about this piece on WhatsApp
        </a>

        {/* Details */}
        <dl className="mt-9 space-y-3 border-t border-line pt-7 text-[16px]">
          <Detail label="Lead time" value={p.leadTime} />
          {p.dimensions ? <Detail label="Dimensions" value={p.dimensions} /> : null}
          {p.materials?.length ? <Detail label="Materials" value={p.materials.join(", ")} /> : null}
          <Detail
            label="Availability"
            value={p.kind === "in-stock" ? `${p.stock} in the workshop` : "Made to order"}
          />
        </dl>

        <div className="mt-8 border-t border-line pt-7">
          <h2 className="font-display text-[20px] font-medium text-cream">
            About this piece
          </h2>
          <p className="mt-3 text-[17px] leading-relaxed text-sand/90">{p.description}</p>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-32 shrink-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-mute">
        {label}
      </dt>
      <dd className="text-sand/90">{value}</dd>
    </div>
  );
}

function WhatsGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.1.6 4.1 1.6 5.9L4 29l8.4-1.6c1.7.9 3.7 1.4 5.6 1.4 6.6 0 12-5.3 12-11.9S22.6 3 16 3Zm6.1 14.7c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2l-1 1.2c-.2.2-.4.3-.7.1a11 11 0 0 1-5.4-4.7c-.4-.7.4-.6 1.1-2 .1-.3 0-.5 0-.7l-1-2.3c-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.5 3.9 6.1 5.4 2.3 1 3.2 1.1 4.3.9.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.2-.6-.4Z" />
    </svg>
  );
}
