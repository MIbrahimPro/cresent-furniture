"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { buildWhatsAppMessage, buildWhatsAppUrl, formatPKR, optionsLabel } from "@/lib/format";
import type { SettingsDoc } from "@/lib/types";

export function CartView({ settings }: { settings: SettingsDoc }) {
  const { items, setQty, removeItem, clear, ready, total } = useCart();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");

  async function checkout() {
    const message = buildWhatsAppMessage(items, {
      customerName: name,
      phone,
      address,
      city,
      note,
    });

    // Record the order for the CRM before opening WhatsApp
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: { name, phone, address, city: city || undefined, note: note || undefined },
        }),
      });
    } catch {
      // Never block the customer on a logging failure
    }

    const url = buildWhatsAppUrl(settings.business.whatsapp, message);
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  if (!ready) {
    return <p className="py-16 text-center text-sand">Opening your selection…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="panel-c mx-auto max-w-lg p-12 text-center">
        <h2 className="font-display text-[22px] font-medium text-cream">
          Your selection is empty
        </h2>
        <p className="mt-3 text-[16px] text-sand">
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
                className="h-24 w-28 shrink-0 overflow-hidden rounded-card bg-walnut-2"
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
                      className="font-display text-[15px] font-semibold text-cream hover:text-terra"
                    >
                      {item.name}
                    </Link>
                    {Object.keys(item.options).length ? (
                      <p className="mt-0.5 text-[14px] text-sand">{optionsLabel(item.options)}</p>
                    ) : null}
                  </div>
                  <p className="whitespace-nowrap font-display text-[15px] font-semibold text-cream">
                    {formatPKR(item.unitPrice * item.qty)}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center rounded-btn border border-line bg-walnut-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.productId, item.options, item.qty - 1)}
                      className="grid h-9 w-9 place-items-center text-cream hover:text-terra"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-[15px] font-medium">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.productId, item.options, item.qty + 1)}
                      className="grid h-9 w-9 place-items-center text-cream hover:text-terra"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.options)}
                    className="text-[14px] text-sand underline underline-offset-4 hover:text-terra"
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
          className="mt-5 text-[14px] text-sand underline underline-offset-4 hover:text-terra"
        >
          Clear selection
        </button>
      </div>

      {/* Summary + checkout */}
      <div>
        <div className="panel-c sticky top-24 p-6">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brass">
            Your commission
          </h2>
          <div className="mt-4 space-y-2 text-[16px]">
            <Row label={`Pieces (${items.reduce((s, i) => s + i.qty, 0)})`} value={formatPKR(total)} />
            <Row label="Delivery" value="Included locally" muted />
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-sand">
              Estimated total
            </span>
            <span className="font-display text-[20px] font-semibold text-cream">
              {formatPKR(total)}
            </span>
          </div>
          <p className="mt-2 text-[13.5px] italic text-sand">{settings.shippingNote}</p>

          {!open ? (
            <button type="button" onClick={() => setOpen(true)} className="btn btn-primary mt-6 w-full">
              Begin commission on WhatsApp
            </button>
          ) : (
            <form
              className="mt-6 space-y-3 border-t border-line pt-5"
              onSubmit={(e) => {
                e.preventDefault();
                checkout();
              }}
            >
              <p className="text-[14px] leading-snug text-sand">
                Your order opens in WhatsApp with everything already written — just press send.
              </p>
              <div>
                <label className="label-c" htmlFor="ck-name">Your name</label>
                <input id="ck-name" required value={name} onChange={(e) => setName(e.target.value)} className="input-c" autoComplete="name" />
              </div>
              <div>
                <label className="label-c" htmlFor="ck-phone">Phone</label>
                <input id="ck-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} className="input-c" type="tel" autoComplete="tel" placeholder="03xx xxxxxxx" />
              </div>
              <div>
                <label className="label-c" htmlFor="ck-address">Delivery address</label>
                <input id="ck-address" required value={address} onChange={(e) => setAddress(e.target.value)} className="input-c" autoComplete="street-address" />
              </div>
              <div>
                <label className="label-c" htmlFor="ck-city">City</label>
                <input id="ck-city" value={city} onChange={(e) => setCity(e.target.value)} className="input-c" autoComplete="address-level2" />
              </div>
              <div>
                <label className="label-c" htmlFor="ck-note">Note for the workshop (optional)</label>
                <textarea id="ck-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="input-c" />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Open WhatsApp with my order
              </button>
              <button type="button" onClick={() => setOpen(false)} className="w-full text-[14px] text-sand underline underline-offset-4">
                Back
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-[13px] text-sand">
            No online payment — the workshop confirms everything with you personally.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sand">{label}</span>
      <span className={muted ? "text-sand" : "font-medium text-sand"}>{value}</span>
    </div>
  );
}
