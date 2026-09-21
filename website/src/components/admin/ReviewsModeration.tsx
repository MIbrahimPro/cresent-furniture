"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Review } from "@/lib/types";

export function ReviewsModeration({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setApproved(review: Review, approved: boolean) {
    setBusyId(String(review._id));
    await fetch(`/api/admin/reviews/${review._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(review: Review) {
    if (!confirm(`Delete the note from ${review.name}?`)) return;
    setBusyId(String(review._id));
    await fetch(`/api/admin/reviews/${review._id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  if (reviews.length === 0) {
    return <p className="panel-c mt-8 p-8 text-center text-muted">No reviews submitted yet.</p>;
  }

  return (
    <div className="panel-c mt-8 max-w-4xl divide-y divide-line">
      {reviews.map((r) => {
        const busy = busyId === String(r._id);
        return (
          <div key={String(r._id)} className="px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-[14px] font-semibold text-maroon">
                  {r.name} <span className="text-coral">{"★".repeat(r.rating)}</span>
                </p>
                <p className="text-[13px] text-muted">
                  {r.productSlug} · {new Date(r.createdAt).toLocaleDateString()}
                  {r.orderNumber ? ` · order ${r.orderNumber}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {r.approved ? (
                  <span className="rounded-full bg-coral-tint px-3 py-1 text-[12px] font-medium text-coral-dark">
                    Published
                  </span>
                ) : (
                  <button type="button" onClick={() => setApproved(r, true)} disabled={busy} className="btn btn-primary btn-sm">
                    Approve
                  </button>
                )}
                {r.approved ? (
                  <button type="button" onClick={() => setApproved(r, false)} disabled={busy} className="text-[14px] text-muted hover:underline">
                    Unpublish
                  </button>
                ) : null}
                <button type="button" onClick={() => remove(r)} disabled={busy} className="text-[14px] text-muted hover:text-coral-dark hover:underline">
                  Delete
                </button>
              </div>
            </div>
            {r.title ? <p className="mt-2 font-medium text-ink">{r.title}</p> : null}
            <p className="mt-1 text-[15px] text-ink/85">{r.body}</p>
          </div>
        );
      })}
    </div>
  );
}
