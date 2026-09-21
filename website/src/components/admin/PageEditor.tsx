"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CustomPage, PageSection } from "@/lib/types";

type Offer = Extract<PageSection, { type: "offer-grid" }>["offers"][number];

export function PageEditor({ page }: { page?: CustomPage }) {
  const router = useRouter();
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [intro, setIntro] = useState(page?.intro ?? "");
  const [published, setPublished] = useState(page?.published ?? false);
  const [showInNav, setShowInNav] = useState(page?.showInNav ?? false);
  const [navOrder, setNavOrder] = useState(page?.navOrder ?? 10);
  const [sections, setSections] = useState<PageSection[]>(page?.sections ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(page?._id);

  async function save(overrides?: { published?: boolean }) {
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = { title, slug, intro, published, showInNav, navOrder, sections };
    const res = await fetch(isEdit ? `/api/admin/pages/${page!._id}` : "/api/admin/pages", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, ...overrides }),
    });
    setSaving(false);
    if (res.ok) {
      if (!isEdit) {
        router.push("/admin/pages");
        router.refresh();
      } else {
        router.refresh();
      }
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Save failed");
    }
  }

  function updateSection(i: number, patch: Partial<PageSection>) {
    setSections((ss) => ss.map((s, idx) => (idx === i ? ({ ...s, ...patch } as PageSection) : s)));
  }

  function addSection(type: PageSection["type"]) {
    if (type === "rich-text") setSections((s) => [...s, { type, heading: "", body: "" }]);
    if (type === "offer-grid") setSections((s) => [...s, { type, heading: "", intro: "", offers: [] }]);
    if (type === "gallery") setSections((s) => [...s, { type, heading: "", images: [] }]);
    if (type === "banner") setSections((s) => [...s, { type, text: "", label: "See more" }]);
  }

  return (
    <div className="mt-8 max-w-4xl space-y-8">
      <section className="panel-c space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-c">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-c" placeholder="Eid Deals" />
          </label>
          <label className="block">
            <span className="label-c">Slug</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="input-c" placeholder="eid-deals" />
          </label>
        </div>
        <label className="block">
          <span className="label-c">Intro (optional)</span>
          <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={2} className="input-c" />
        </label>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 text-[15px]">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-[#E5624D]" />
            Published
          </label>
          <label className="flex items-center gap-2.5 text-[15px]">
            <input type="checkbox" checked={showInNav} onChange={(e) => setShowInNav(e.target.checked)} className="h-4 w-4 accent-[#E5624D]" />
            Show in storefront navigation
          </label>
          <label className="flex items-center gap-2.5 text-[15px]">
            Nav order
            <input type="number" value={navOrder} onChange={(e) => setNavOrder(Number(e.target.value))} className="input-c w-20 min-h-0 py-1.5" />
          </label>
        </div>
      </section>

      {sections.map((section, i) => (
        <section key={i} className="panel-c space-y-4 p-6">
          <div className="flex items-center justify-between">
            <p className="font-display text-[12px] font-semibold uppercase tracking-[0.2em] text-coral-dark">
              {section.type.replace("-", " ")}
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setSections((ss) => ss.filter((_, x) => x !== i))} className="text-[14px] text-muted hover:text-coral-dark">
                Remove section
              </button>
            </div>
          </div>

          {section.type === "rich-text" ? (
            <>
              <input
                value={section.heading ?? ""}
                onChange={(e) => updateSection(i, { heading: e.target.value })}
                className="input-c"
                placeholder="Heading (optional)"
              />
              <textarea
                value={section.body}
                onChange={(e) => updateSection(i, { body: e.target.value })}
                rows={6}
                className="input-c"
                placeholder="Paragraph text. Separate paragraphs with a blank line."
              />
            </>
          ) : null}

          {section.type === "banner" ? (
            <>
              <input
                value={section.text}
                onChange={(e) => updateSection(i, { text: e.target.value })}
                className="input-c"
                placeholder="Banner text"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={section.href ?? ""}
                  onChange={(e) => updateSection(i, { href: e.target.value })}
                  className="input-c"
                  placeholder="Link (optional)"
                />
                <input
                  value={section.label ?? ""}
                  onChange={(e) => updateSection(i, { label: e.target.value })}
                  className="input-c"
                  placeholder="Button label"
                />
              </div>
            </>
          ) : null}

          {section.type === "gallery" ? (
            <>
              <input
                value={section.heading ?? ""}
                onChange={(e) => updateSection(i, { heading: e.target.value })}
                className="input-c"
                placeholder="Heading (optional)"
              />
              <textarea
                value={section.images.join("\n")}
                onChange={(e) => updateSection(i, { images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                rows={4}
                className="input-c"
                placeholder="One image URL per line"
              />
            </>
          ) : null}

          {section.type === "offer-grid" ? (
            <>
              <input
                value={section.heading ?? ""}
                onChange={(e) => updateSection(i, { heading: e.target.value })}
                className="input-c"
                placeholder="Heading (optional)"
              />
              <input
                value={section.intro ?? ""}
                onChange={(e) => updateSection(i, { intro: e.target.value })}
                className="input-c"
                placeholder="Intro line (optional)"
              />
              <div className="space-y-3">
                {section.offers.map((offer, oi) => (
                  <div key={oi} className="rounded-card border border-line p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        value={offer.title}
                        onChange={(e) => {
                          const offers = [...section.offers];
                          offers[oi] = { ...offer, title: e.target.value };
                          updateSection(i, { offers });
                        }}
                        className="input-c"
                        placeholder="Deal title"
                      />
                      <input
                        value={offer.badge ?? ""}
                        onChange={(e) => {
                          const offers = [...section.offers];
                          offers[oi] = { ...offer, badge: e.target.value };
                          updateSection(i, { offers });
                        }}
                        className="input-c"
                        placeholder="Badge (e.g. 20% OFF)"
                      />
                      <input
                        value={offer.image ?? ""}
                        onChange={(e) => {
                          const offers = [...section.offers];
                          offers[oi] = { ...offer, image: e.target.value };
                          updateSection(i, { offers });
                        }}
                        className="input-c"
                        placeholder="Image URL"
                      />
                      <input
                        value={offer.href ?? ""}
                        onChange={(e) => {
                          const offers = [...section.offers];
                          offers[oi] = { ...offer, href: e.target.value };
                          updateSection(i, { offers });
                        }}
                        className="input-c"
                        placeholder="Link (optional)"
                      />
                      <input
                        type="number"
                        value={offer.price ?? ""}
                        onChange={(e) => {
                          const offers = [...section.offers];
                          offers[oi] = { ...offer, price: e.target.value ? Number(e.target.value) : undefined };
                          updateSection(i, { offers });
                        }}
                        className="input-c"
                        placeholder="Price (PKR)"
                      />
                      <input
                        type="number"
                        value={offer.comparePrice ?? ""}
                        onChange={(e) => {
                          const offers = [...section.offers];
                          offers[oi] = { ...offer, comparePrice: e.target.value ? Number(e.target.value) : undefined };
                          updateSection(i, { offers });
                        }}
                        className="input-c"
                        placeholder="Was price (optional)"
                      />
                    </div>
                    <textarea
                      value={offer.description ?? ""}
                      onChange={(e) => {
                        const offers = [...section.offers];
                        offers[oi] = { ...offer, description: e.target.value };
                        updateSection(i, { offers });
                      }}
                      rows={2}
                      className="input-c mt-3"
                      placeholder="Short description (optional)"
                    />
                    <button
                      type="button"
                      onClick={() => updateSection(i, { offers: section.offers.filter((_, x) => x !== oi) })}
                      className="mt-2 text-[13.5px] text-muted hover:text-coral-dark"
                    >
                      Remove deal
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const offer: Offer = { title: "" };
                    updateSection(i, { offers: [...section.offers, offer] });
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Add deal
                </button>
              </div>
            </>
          ) : null}
        </section>
      ))}

      <section className="panel-c flex flex-wrap items-center gap-3 p-6">
        <span className="label-c mb-0">Add section:</span>
        <button type="button" onClick={() => addSection("rich-text")} className="btn btn-secondary btn-sm">Text</button>
        <button type="button" onClick={() => addSection("offer-grid")} className="btn btn-secondary btn-sm">Offer grid</button>
        <button type="button" onClick={() => addSection("gallery")} className="btn btn-secondary btn-sm">Gallery</button>
        <button type="button" onClick={() => addSection("banner")} className="btn btn-secondary btn-sm">Banner</button>
      </section>

      {error ? <p className="rounded-btn bg-coral-tint px-3 py-2 text-[14px] text-coral-dark">{error}</p> : null}

      <div className="flex items-center gap-4">
        <button type="button" onClick={() => save()} disabled={saving} className="btn btn-primary">
          {saving ? "Saving…" : isEdit ? "Save page" : "Create page"}
        </button>
        {isEdit ? (
          <button
            type="button"
            onClick={() => {
              setPublished(true);
              save({ published: true });
            }}
            disabled={saving}
            className="btn btn-secondary"
          >
            Save & publish
          </button>
        ) : null}
      </div>
    </div>
  );
}
