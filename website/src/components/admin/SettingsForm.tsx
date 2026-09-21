"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SettingsDoc } from "@/lib/types";

export function SettingsForm({ settings }: { settings: SettingsDoc }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business: {
          name: f.get("name"),
          tagline: f.get("tagline"),
          address: f.get("address"),
          phone: f.get("phone"),
          whatsapp: f.get("whatsapp"),
          email: f.get("email") || undefined,
          hours: f.get("hours") || undefined,
          mapUrl: f.get("mapUrl") || undefined,
        },
        shippingNote: f.get("shippingNote"),
        announcement: f.get("announcement"),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      setError("Save failed — check the values and try again.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 grid max-w-4xl gap-8 lg:grid-cols-2">
      <section className="panel-c space-y-4 p-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-sand text-cream">
          Business details
        </h2>
        <Field label="Name"><input name="name" defaultValue={settings.business.name} className="input-c" /></Field>
        <Field label="Tagline"><input name="tagline" defaultValue={settings.business.tagline} className="input-c" /></Field>
        <Field label="Address"><textarea name="address" rows={2} defaultValue={settings.business.address} className="input-c" /></Field>
        <Field label="Phone (display)"><input name="phone" defaultValue={settings.business.phone} className="input-c" /></Field>
        <Field label="Hours"><input name="hours" defaultValue={settings.business.hours ?? ""} className="input-c" /></Field>
        <Field label="Email (optional)"><input name="email" type="email" defaultValue={settings.business.email ?? ""} className="input-c" /></Field>
        <Field label="Maps URL (optional)"><input name="mapUrl" defaultValue={settings.business.mapUrl ?? ""} className="input-c" /></Field>
      </section>

      <section className="panel-c space-y-4 p-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-sand text-cream">
          WhatsApp & notices
        </h2>
        <Field label="WhatsApp number (checkout target)">
          <input name="whatsapp" required defaultValue={settings.business.whatsapp} className="input-c" placeholder="923118550000" />
          <span className="mt-1.5 block text-[13px] text-sand">
            Country code + number, digits only. Every checkout and chat bubble opens this number.
          </span>
        </Field>
        <Field label="Shipping note (cart)">
          <textarea name="shippingNote" rows={2} defaultValue={settings.shippingNote} className="input-c" />
        </Field>
        <Field label="Top bar announcement">
          <input name="announcement" defaultValue={settings.announcement} className="input-c" placeholder="Eid delivery bookings now open" />
          <span className="mt-1.5 block text-[13px] text-sand">
            Shown in the maroon bar above the header. Offers have their own banner in the Offers tab.
          </span>
        </Field>

        {error ? <p className="rounded-btn bg-terra-veil px-3 py-2 text-[14px] text-terra">{error}</p> : null}
        {saved ? <p className="text-[14px] font-medium text-terra">Saved ✓</p> : null}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </section>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-c">{label}</span>
      {children}
    </label>
  );
}
