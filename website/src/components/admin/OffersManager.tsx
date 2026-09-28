"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OfferBanner } from "@/lib/types";
import { api } from "@/lib/api";

export function OffersManager({ banner }: { banner: OfferBanner | null }) {
  const router = useRouter();
  const [text, setText] = useState(banner?.text ?? "");
  const [href, setHref] = useState(banner?.href ?? "");
  const [active, setActive] = useState(banner?.active ?? false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(nextActive = active) {
    setSaving(true);
    setSaved(false);
    const res = await fetch(api("/api/") + "admin/offers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        href: href || undefined,
        active: nextActive,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setActive(nextActive);
      router.refresh();
    }
  }

  return (
    <div className="mt-8 max-w-2xl">
      {/* Live preview */}
      <p className="label-c">Preview</p>
      <div className={`mt-2 rounded-card px-4 py-3 text-center transition-opacity ${active ? "bg-ink" : "bg-walnut-2"}`}>
        {text ? (
          <p className={`font-display text-[11px] font-semibold uppercase tracking-[0.22em] ${active ? "text-terra" : "text-sand"}`}>
            {text}
          </p>
        ) : (
          <p className="font-display text-[11px] uppercase tracking-[0.22em] text-sand">
            Your offer text appears here
          </p>
        )}
      </div>
      <p className="mt-2 text-[13.5px] text-sand">
        {active ? "The banner is live above the header." : "The banner is currently hidden."}
      </p>

      <div className="panel-c mt-6 space-y-4 p-6">
        <label className="block">
          <span className="label-c">Offer text</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-c"
            placeholder="Eid collection: 15% off dining sets until March 1"
          />
        </label>
        <label className="block">
          <span className="label-c">Link (optional)</span>
          <input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            className="input-c"
            placeholder="/p/eid-deals"
          />
        </label>
        <label className="flex items-center gap-3 text-[15px]">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => {
              setActive(e.target.checked);
              save(e.target.checked);
            }}
            className="h-4 w-4 accent-[#E5624D]"
          />
          Show banner sitewide
        </label>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => save()} disabled={saving} className="btn btn-primary">
            {saving ? "Saving…" : "Save offer"}
          </button>
          {saved ? <p className="text-[14px] font-medium text-terra">Saved ✓</p> : null}
        </div>
      </div>
    </div>
  );
}
