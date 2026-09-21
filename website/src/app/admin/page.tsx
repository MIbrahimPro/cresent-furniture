import Link from "next/link";
import { getCollection } from "@/lib/mongo";
import type { Order, Review } from "@/lib/types";
import { formatPKR } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let recent: Order[] = [];
  let pendingReviews = 0;
  let newCount = 0;
  let revenue = 0;
  let dbError = false;

  try {
    const orders = await getCollection<Order>("orders");
    recent = await orders.find().sort({ createdAt: -1 }).limit(8).toArray();
    newCount = await orders.countDocuments({ status: "new" });
    const pipeline = [
      { $match: { status: { $nin: ["cancelled"] } } },
      { $group: { _id: null, sum: { $sum: "$total" } } },
    ];
    const agg = await orders.aggregate<{ sum: number }>(pipeline).toArray();
    revenue = agg[0]?.sum ?? 0;

    const reviews = await getCollection<Review>("reviews");
    pendingReviews = await reviews.countDocuments({ approved: false });
  } catch {
    dbError = true;
  }

  return (
    <div>
      <header>
        <h1 className="display-c text-[26px]">Dashboard</h1>
        <p className="mt-1.5 text-[16px] text-sand">The workshop at a glance.</p>
      </header>

      {dbError ? (
        <p className="panel-c mt-8 p-6 text-sand">
          Database unreachable. Start MongoDB and refresh.
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="New orders" value={String(newCount)} href="/admin/orders" accent />
            <StatCard label="Commission value" value={formatPKR(revenue)} href="/admin/orders" />
            <StatCard label="Reviews to moderate" value={String(pendingReviews)} href="/admin/reviews" />
          </div>

          <div className="panel-c mt-8">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-sand text-cream">
                Recent orders
              </h2>
              <Link href="/admin/orders" className="text-[14px] text-terra hover:underline">
                View all
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="px-5 py-8 text-[15px] text-sand">
                No orders yet. They appear here when a customer begins a commission on WhatsApp.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((o) => (
                  <li key={String(o._id)} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-display text-[14px] font-semibold text-cream">
                        {o.number} · {o.customer.name}
                      </p>
                      <p className="truncate text-[14px] text-sand">
                        {o.items.length} piece{o.items.length === 1 ? "" : "s"} ·{" "}
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-[14px] font-semibold">{formatPKR(o.total)}</span>
                      <span className="rounded-full bg-walnut-2 px-3 py-1 text-[12px] font-medium text-cream">
                        {STATUS_LABELS[o.status]}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link href={href} className={`card-c block p-6 ${accent ? "border-terra" : ""}`}>
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">
        {label}
      </p>
      <p className={`mt-2 font-display text-[26px] font-semibold ${accent ? "text-terra" : "text-cream"}`}>
        {value}
      </p>
    </Link>
  );
}
