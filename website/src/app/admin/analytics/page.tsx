import Link from "next/link";
import { getAnalyticsSummary } from "@/lib/analytics";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const sp = await searchParams;
  const days = [7, 30, 90].includes(Number(sp.days)) ? Number(sp.days) : 30;
  const data = await getAnalyticsSummary(days);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-medium text-cream">Analytics</h1>
          <p className="mt-1.5 text-[16px] text-sand">
            What visitors did in the last {days} days — where they came from, what they looked at,
            where they dropped off.
          </p>
        </div>
        <nav className="flex gap-2" aria-label="Date range">
          {[7, 30, 90].map((d) => (
            <Link
              key={d}
              href={`/admin/analytics?days=${d}`}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                d === days ? "bg-terra text-deep" : "bg-walnut-2 text-sand hover:text-cream"
              }`}
            >
              {d}d
            </Link>
          ))}
        </nav>
      </header>

      <AnalyticsDashboard data={data} />
    </div>
  );
}
