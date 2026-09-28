import "server-only";
import Link from "next/link";
import { getCollection } from "@/lib/mongo";
import type { Review } from "@/lib/types";
import { ReviewForm } from "./ReviewForm";

export async function ReviewsSection({ productSlug }: { productSlug: string }) {
  let reviews: Review[] = [];
  try {
    const col = await getCollection<Review>("reviews");
    reviews = await col
      .find({ productSlug, approved: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .toArray();
  } catch {
    // DB unreachable — render the form only
  }

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <section id="reviews" className="mt-20 border-t border-line pt-12">
      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 className="display-c text-[24px]">Owners&rsquo; notes</h2>
            {reviews.length ? (
              <span className="text-[15px] text-ink-soft">
                {avg.toFixed(1)} ★ · {reviews.length} {reviews.length === 1 ? "note" : "notes"}
              </span>
            ) : null}
          </div>

          {reviews.length === 0 ? (
            <p className="mt-5 text-[16px] text-ink-soft">
              No notes yet for this piece. Bought it from us before?{" "}
              <Link href="/contact" className="text-terra underline underline-offset-4">
                Tell the workshop
              </Link>{" "}
              and leave the first note.
            </p>
          ) : (
            <ul className="mt-6 space-y-6">
              {reviews.map((r) => (
                <li key={String(r._id)} className="panel-c p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[14px] font-semibold text-ink">
                      {r.name}
                    </p>
                    <Stars value={r.rating} />
                  </div>
                  {r.title ? (
                    <p className="mt-2 font-display text-[15px] font-semibold text-ink-soft">{r.title}</p>
                  ) : null}
                  <p className="mt-2 text-[16px] leading-relaxed text-ink-soft/90">{r.body}</p>
                  {r.orderNumber ? (
                    <p className="mt-3 text-[13px] text-ink-soft">Order {r.orderNumber} · verified</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="font-display text-[20px] font-medium text-ink">
            Leave a note
          </h3>
          <p className="mt-2 text-[15px] text-ink-soft">
            Notes are read by the workshop and published after a quick check.
          </p>
          <ReviewForm productSlug={productSlug} />
        </div>
      </div>
    </section>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span aria-label={`${value} out of 5 stars`} className="whitespace-nowrap text-terra">
      {"★".repeat(Math.round(value))}
      <span className="text-line">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}
