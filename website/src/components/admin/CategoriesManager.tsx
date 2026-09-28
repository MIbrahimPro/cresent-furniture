"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/types";
import { api } from "@/lib/api";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    await fetch(api("/api/") + "admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }),
    });
    setName("");
    setSlug("");
    setBusy(false);
    router.refresh();
  }

  async function toggle(cat: Category) {
    await fetch(api("/api/") + `admin/categories/${cat._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !cat.active }),
    });
    router.refresh();
  }

  async function remove(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"? Products in it will need a new category.`)) return;
    await fetch(api("/api/") + `admin/categories/${cat._id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mt-8 grid max-w-4xl gap-8 lg:grid-cols-[1fr_320px]">
      <div className="panel-c divide-y divide-line">
        {categories.length === 0 ? (
          <p className="p-6 text-[15px] text-sand">No categories yet.</p>
        ) : (
          categories.map((c) => (
            <div key={String(c._id)} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="font-medium text-cream">{c.name}</p>
                <p className="truncate text-[13.5px] text-sand">
                  /{c.slug} · order {c.order} · {c.active ? "visible" : "hidden"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggle(c)}
                  className="rounded-btn border border-line px-3 py-1.5 text-[13px] font-medium text-cream hover:border-terra"
                >
                  {c.active ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(c)}
                  className="text-[14px] text-sand hover:text-terra hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={addCategory} className="panel-c h-fit space-y-4 p-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-sand text-cream">
          Add category
        </h2>
        <div>
          <label className="label-c" htmlFor="cat-name">Name</label>
          <input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} required className="input-c" placeholder="Outdoor" />
        </div>
        <div>
          <label className="label-c" htmlFor="cat-slug">Slug (optional)</label>
          <input id="cat-slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="input-c" placeholder="outdoor" />
        </div>
        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? "Adding…" : "Add category"}
        </button>
      </form>
    </div>
  );
}
