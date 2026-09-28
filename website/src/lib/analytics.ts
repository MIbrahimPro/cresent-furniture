import "server-only";
import { getCollection } from "./mongo";
import type { TrackingEvent } from "./types";

/**
 * CRM analytics: aggregated views over tracking_events.
 * All queries are bounded (default 30 days) and failure-tolerant —
 * a down DB returns empty stats rather than throwing into pages.
 */

export interface AnalyticsSummary {
  rangeDays: number;
  totals: {
    visitors: number;
    sessions: number;
    pageviews: number;
    productViews: number;
    cartAdds: number;
    checkouts: number;
    enquiries: number;
  };
  bySource: { source: string; count: number }[];
  topPages: { path: string; count: number }[];
  topProducts: { label: string; count: number }[];
  scrollDepth: { bucket: string; count: number }[];
  searches: { label: string; count: number }[];
  recent: {
    type: string;
    path: string;
    label?: string;
    source?: string;
    createdAt: string;
  }[];
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function getAnalyticsSummary(rangeDays = 30): Promise<AnalyticsSummary> {
  const empty: AnalyticsSummary = {
    rangeDays,
    totals: { visitors: 0, sessions: 0, pageviews: 0, productViews: 0, cartAdds: 0, checkouts: 0, enquiries: 0 },
    bySource: [],
    topPages: [],
    topProducts: [],
    scrollDepth: [],
    searches: [],
    recent: [],
  };

  try {
    const col = await getCollection<TrackingEvent>("tracking_events");
    const since = daysAgo(rangeDays);

    const [
      visitors,
      sessions,
      pageviews,
      productViews,
      cartAdds,
      checkouts,
      enquiries,
      bySource,
      topPages,
      topProducts,
      scrollBuckets,
      searches,
      recent,
    ] = await Promise.all([
      col.distinct("visitorId", { createdAt: { $gte: since } }),
      col.distinct("sessionId", { createdAt: { $gte: since } }),
      col.countDocuments({ type: "pageview", createdAt: { $gte: since } }),
      col.countDocuments({ type: "product_view", createdAt: { $gte: since } }),
      col.countDocuments({ type: "cart_add", createdAt: { $gte: since } }),
      col.countDocuments({ type: "checkout_whatsapp", createdAt: { $gte: since } }),
      col.countDocuments({ type: "enquiry", createdAt: { $gte: since } }),
      col
        .aggregate<{ _id: string; count: number }>([
          { $match: { type: "pageview", createdAt: { $gte: since } } },
          { $group: { _id: "$source", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ])
        .toArray(),
      col
        .aggregate<{ _id: string; count: number }>([
          { $match: { type: "pageview", createdAt: { $gte: since } } },
          { $group: { _id: "$path", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ])
        .toArray(),
      col
        .aggregate<{ _id: string; count: number }>([
          { $match: { type: "product_view", createdAt: { $gte: since } } },
          { $group: { _id: "$label", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ])
        .toArray(),
      col
        .aggregate<{ _id: number | null; count: number }>([
          { $match: { type: "scroll", createdAt: { $gte: since } } },
          {
            $bucket: {
              groupBy: "$value",
              boundaries: [0, 25, 50, 75, 101],
              default: "unknown",
              output: { count: { $sum: 1 } },
            },
          },
        ])
        .toArray(),
      col
        .aggregate<{ _id: string; count: number }>([
          { $match: { type: "search", createdAt: { $gte: since } } },
          { $group: { _id: { $toLower: "$label" }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ])
        .toArray(),
      col
        .find({ createdAt: { $gte: since } }, { sort: { createdAt: -1 }, limit: 12 })
        .toArray(),
    ]);

    return {
      rangeDays,
      totals: {
        visitors: visitors.length,
        sessions: sessions.length,
        pageviews,
        productViews,
        cartAdds,
        checkouts,
        enquiries,
      },
      bySource: bySource.filter((s) => s._id).map((s) => ({ source: s._id, count: s.count })),
      topPages: topPages.map((p) => ({ path: p._id, count: p.count })),
      topProducts: topProducts.filter((p) => p._id).map((p) => ({ label: p._id, count: p.count })),
      scrollDepth: scrollBuckets.map((b) => ({
        bucket:
          typeof b._id === "number"
            ? b._id === 100
              ? "100% (full)"
              : `${b._id}–${Math.min(b._id + 24, 100)}%`
            : "unknown",
        count: b.count,
      })),
      searches: searches.filter((s) => s._id).map((s) => ({ label: s._id, count: s.count })),
      recent: recent.map((e) => ({
        type: e.type,
        path: e.path,
        label: e.label,
        source: e.source,
        createdAt: e.createdAt.toISOString(),
      })),
    };
  } catch {
    return empty;
  }
}
