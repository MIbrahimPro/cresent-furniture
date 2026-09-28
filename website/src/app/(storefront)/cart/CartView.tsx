"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { buildWhatsAppMessage, buildWhatsAppUrl, formatPKR, optionsLabel } from "@/lib/format";
import { trackCheckout } from "@/lib/track";
import type { SettingsDoc } from "@/lib/types";

export function CartView({ settings }: { settings: SettingsDoc }) {
  const { items, setQty, removeItem, clear, ready, total } = useCart();

  async function checkout() {
    const message = buildWhatsAppMessage(items);
    trackCheckout(
      items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
      items.reduce((s, i) => s + i.qty, 0),
    );

    // Record the order for the CRM before opening WhatsApp (no customer
    // details are collected here — the conversation happens on WhatsApp).
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
    } catch {
      // Never block the customer on a logging failure
    }

    const url = buildWhatsAppUrl(settings.business.whatsapp, message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (!ready) {
    return <p className="py-16 text-center text-ink-soft">Opening your selection…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="panel-c mx-auto max-w-lg p-12 text-center">
        <h2 className="font-display text-[22px] font-medium text-ink">
          Your selection is empty
        </h2>
        <p className="mt-3 text-[16px] text-ink-soft">
          Add pieces from the collection and we will start a conversation.
        </p>
        <Link href="/shop" className="btn btn-primary mt-7">
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.productId + JSON.stringify(item.options)} className="flex gap-4 py-5">
              <Link
                href={`/product/${item.slug}`}
                className="h-24 w-28 shrink-0 overflow-hidden rounded-card bg-bone"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : null}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-display text-[15px] font-semibold text-ink hover:text-terra"
                    >
                      {item.name}
                    </Link>
                    {Object.keys(item.options).length ? (
                      <p className="mt-0.5 text-[14px] text-ink-soft">{optionsLabel(item.options)}</p>
                    ) : null}
                  </div>
                  <p className="whitespace-nowrap font-display text-[15px] font-semibold text-ink">
                    {formatPKR(item.unitPrice * item.qty)}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center rounded-btn border border-line bg-bone">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.productId, item.options, item.qty - 1)}
                      className="grid h-9 w-9 place-items-center text-ink hover:text-terra"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-[15px] font-medium">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.productId, item.options, item.qty + 1)}
                      className="grid h-9 w-9 place-items-center text-ink hover:text-terra"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.options)}
                    className="text-[14px] text-ink-soft underline underline-offset-4 hover:text-terra"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={clear}
          className="mt-5 text-[14px] text-ink-soft underline underline-offset-4 hover:text-terra"
        >
          Clear selection
        </button>
      </div>

      {/* Summary + checkout — one tap, straight to WhatsApp */}
      <div>
        <div className="panel-c sticky top-24 p-6">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-terra">
            Your selection
          </h2>
          <div className="mt-4 space-y-2 text-[16px]">
            <Row label={`Pieces (${items.reduce((s, i) => s + i.qty, 0)})`} value={formatPKR(total)} />
            <Row label="Delivery" value="Included locally" muted />
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Estimated total
            </span>
            <span className="font-display text-[20px] font-semibold text-ink">
              {formatPKR(total)}
            </span>
          </div>
          <p className="mt-2 text-[13.5px] italic text-ink-soft">{settings.shippingNote}</p>

          <button
            type="button"
            onClick={checkout}
            data-track="cart-checkout"
            className="btn btn-primary mt-6 w-full"
          >
            Checkout on WhatsApp
          </button>

          <p className="mt-4 text-center text-[13px] text-ink-soft">
            Your order opens in WhatsApp, already written out — no forms, just press send. We
            confirm everything with you personally.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink-soft">{label}</span>
      <span className={muted ? "text-ink-soft" : "font-medium text-ink-soft"}>{value}</span>
    </div>
  );
}
