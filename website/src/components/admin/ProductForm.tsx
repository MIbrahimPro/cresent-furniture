"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category, Product, VariantGroup } from "@/lib/types";

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [imageInput, setImageInput] = useState("");
  const [variants, setVariants] = useState<VariantGroup[]>(
    product?.variants ?? [{ name: "Finish", options: ["Walnut", "Natural Teak"], priceDeltas: [0, 0] }],
  );

  const isEdit = Boolean(product?._id);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    setError("");
    const payload = {
      name: f.get("name"),
      slug: f.get("slug"),
      categorySlug: f.get("categorySlug"),
      tagline: f.get("tagline"),
      description: f.get("description"),
      price: Number(f.get("price")),
      comparePrice: f.get("comparePrice") ? Number(f.get("comparePrice")) : undefined,
      kind: f.get("kind"),
      stock: Number(f.get("stock")),
      featured: f.get("featured") === "on",
      active: f.get("active") === "on",
      materials: String(f.get("materials") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      leadTime: f.get("leadTime"),
      dimensions: f.get("dimensions") || undefined,
      images,
      variants: variants
        .filter((v) => v.name && v.options.length)
        .map((v) => ({ ...v, priceDeltas: v.options.map((_, i) => v.priceDeltas?.[i] ?? 0) })),
    };

    const res = await fetch(
      isEdit ? `/api/admin/products/${product!._id}` : "/api/admin/products",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Save failed");
      setSaving(false);
    }
  }

  function addVariant() {
    setVariants((v) => [...v, { name: "", options: [""], priceDeltas: [0] }]);
  }

  function updateVariant(i: number, patch: Partial<VariantGroup>) {
    setVariants((vs) => vs.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  }

  function removeVariant(i: number) {
    setVariants((vs) => vs.filter((_, idx) => idx !== i));
  }

  return (
    <form onSubmit={submit} className="mt-8 grid max-w-4xl gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <section className="panel-c space-y-4 p-6">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-maroon">
            Basics
          </h2>
          <Field label="Name">
            <input name="name" required defaultValue={product?.name} className="input-c" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug (URL)">
              <input name="slug" required defaultValue={product?.slug} className="input-c" placeholder="shalimar-dining-table" />
            </Field>
            <Field label="Category">
              <select name="categorySlug" defaultValue={product?.categorySlug} className="input-c">
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Tagline (card text)">
            <input name="tagline" required defaultValue={product?.tagline} className="input-c" />
          </Field>
          <Field label="Description">
            <textarea name="description" required rows={5} defaultValue={product?.description} className="input-c" />
          </Field>
        </section>

        <section className="panel-c space-y-4 p-6">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-maroon">
            Pricing & availability
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price (PKR)">
              <input name="price" type="number" min={0} required defaultValue={product?.price} className="input-c" />
            </Field>
            <Field label="Compare-at price (optional)">
              <input name="comparePrice" type="number" min={0} defaultValue={product?.comparePrice ?? ""} className="input-c" />
            </Field>
            <Field label="Stock (if in-stock)">
              <input name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} className="input-c" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kind">
              <select name="kind" defaultValue={product?.kind ?? "made-to-order"} className="input-c">
                <option value="made-to-order">Made to order</option>
                <option value="in-stock">In stock / ready to deliver</option>
              </select>
            </Field>
            <Field label="Lead time">
              <input name="leadTime" required defaultValue={product?.leadTime ?? "6-8 weeks"} className="input-c" />
            </Field>
          </div>
          <Field label="Materials (comma separated)">
            <input name="materials" defaultValue={product?.materials?.join(", ")} className="input-c" placeholder="Solid sheesham, Brass pins" />
          </Field>
          <Field label="Dimensions (optional)">
            <input name="dimensions" defaultValue={product?.dimensions} className="input-c" placeholder="240 × 110 × 76 cm" />
          </Field>
        </section>

        <section className="panel-c space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-maroon">
              Variants
            </h2>
            <button type="button" onClick={addVariant} className="btn btn-secondary btn-sm">
              Add group
            </button>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="rounded-card border border-line p-4">
              <div className="flex items-center gap-3">
                <input
                  value={v.name}
                  onChange={(e) => updateVariant(i, { name: e.target.value })}
                  placeholder="Group name (e.g. Finish)"
                  className="input-c flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-[14px] text-muted hover:text-coral-dark"
                  aria-label={`Remove ${v.name || "variant group"}`}
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {v.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      value={opt}
                      onChange={(e) => {
                        const options = [...v.options];
                        options[oi] = e.target.value;
                        updateVariant(i, { options });
                      }}
                      placeholder={`Option ${oi + 1}`}
                      className="input-c flex-1"
                    />
                    <input
                      type="number"
                      value={v.priceDeltas?.[oi] ?? 0}
                      onChange={(e) => {
                        const priceDeltas = [...(v.priceDeltas ?? v.options.map(() => 0))];
                        priceDeltas[oi] = Number(e.target.value);
                        updateVariant(i, { priceDeltas });
                      }}
                      title="Price delta for this option (PKR)"
                      className="input-c w-32"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateVariant(i, {
                          options: v.options.filter((_, x) => x !== oi),
                          priceDeltas: (v.priceDeltas ?? v.options.map(() => 0)).filter((_, x) => x !== oi),
                        })
                      }
                      className="px-2 text-muted hover:text-coral-dark"
                      aria-label={`Remove option ${opt || oi + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateVariant(i, {
                      options: [...v.options, ""],
                      priceDeltas: [...(v.priceDeltas ?? v.options.map(() => 0)), 0],
                    })
                  }
                  className="text-[14px] text-coral-dark hover:underline"
                >
                  + option
                </button>
              </div>
            </div>
          ))}
          <p className="text-[13.5px] text-muted">
            The number column is the price added for that option (can be negative). Base price is
            the product price.
          </p>
        </section>

        <section className="panel-c space-y-4 p-6">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-maroon">
            Images
          </h2>
          {images.length ? (
            <div className="flex flex-wrap gap-3">
              {images.map((src, i) => (
                <div key={src + i} className="relative h-24 w-32 overflow-hidden rounded-card border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((ims) => ims.filter((_, x) => x !== i))}
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-deep/80 text-[13px] text-cream"
                    aria-label={`Remove image ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-muted">No images yet.</p>
          )}
          <div className="flex gap-2">
            <input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Paste an image URL"
              className="input-c flex-1"
            />
            <button
              type="button"
              onClick={() => {
                if (imageInput.trim()) {
                  setImages((ims) => [...ims, imageInput.trim()]);
                  setImageInput("");
                }
              }}
              className="btn btn-secondary btn-sm shrink-0"
            >
              Add
            </button>
          </div>
        </section>
      </div>

      {/* Side rail */}
      <div className="space-y-5">
        <div className="panel-c sticky top-6 space-y-4 p-6">
          <Toggle name="active" label="Live on the storefront" defaultChecked={product?.active ?? true} />
          <Toggle name="featured" label="Featured on home page" defaultChecked={product?.featured ?? false} />
          {error ? (
            <p className="rounded-btn bg-coral-tint px-3 py-2 text-[14px] text-coral-dark">{error}</p>
          ) : null}
          <button type="submit" disabled={saving} className="btn btn-primary w-full">
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
          <button type="button" onClick={() => router.back()} className="w-full text-[14px] text-muted underline underline-offset-4">
            Cancel
          </button>
        </div>
      </div>
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

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 text-[15px] text-ink">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[#E5624D]" />
      {label}
    </label>
  );
}
