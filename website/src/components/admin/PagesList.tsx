"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CustomPage } from "@/lib/types";

export function PagesList({ pages }: { pages: CustomPage[] }) {
  const router = useRouter();

  async function togglePublished(page: CustomPage) {
    await fetch(`/api/admin/pages/${page._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !page.published }),
    });
    router.refresh();
  }

  async function remove(page: CustomPage) {
    if (!confirm(`Delete page "${page.title}"?`)) return;
    await fetch(`/api/admin/pages/${page._id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="panel-c mt-8 max-w-4xl divide-y divide-line">
      <p className="border-b border-line bg-parchment px-5 py-3 text-[13.5px] text-muted">
        Draft pages are not shown on the storefront. To preview a draft, tick “Published” and save —
        the page then renders at /p/your-slug; untick it again when you are done.
      </p>
      {pages.length === 0 ? (
        <p className="p-6 text-[15px] text-muted">
          No pages yet. Create one — for example an “Eid Deals” page you can publish when ready.
        </p>
      ) : (
        pages.map((p) => (
          <div key={String(p._id)} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="font-medium text-maroon">{p.title}</p>
              <p className="truncate text-[13.5px] text-muted">
                /p/{p.slug} · {p.sections.length} section{p.sections.length === 1 ? "" : "s"} ·{" "}
                {p.published ? "published" : "draft"}
                {p.showInNav ? " · in navigation" : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {p.published ? (
                <Link href={`/p/${p.slug}`} className="text-[14px] text-coral-dark hover:underline">
                  View
                </Link>
              ) : null}
              <Link href={`/admin/pages/${p._id}`} className="text-[14px] font-medium text-coral-dark hover:underline">
                Edit
              </Link>
              <button
                type="button"
                onClick={() => togglePublished(p)}
                className="rounded-btn border border-line px-3 py-1.5 text-[13px] font-medium text-maroon hover:border-coral"
              >
                {p.published ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => remove(p)}
                className="text-[14px] text-muted hover:text-coral-dark hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
