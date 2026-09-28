"use client";

import type { AnalyticsSummary } from "@/lib/analytics";

export function AnalyticsDashboard({ data }: { data: AnalyticsSummary }) {
  const t = data.totals;
  const conversion = t.productViews ? Math.round((t.checkouts / t.productViews) * 100) : 0;
  const maxScroll = Math.max(1, ...data.scrollDepth.map((s) => s.count));

  return (
    <div className="mt-8 space-y-8">
      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Visitors" value={t.visitors} />
        <Metric label="Sessions" value={t.sessions} />
        <Metric label="Pageviews" value={t.pageviews} />
        <Metric label="Product views" value={t.productViews} />
        <Metric label="Cart adds" value={t.cartAdds} />
        <Metric label="WhatsApp checkouts" value={t.checkouts} />
        <Metric label="Enquiries" value={t.enquiries} />
        <Metric label="View → checkout" value={`${conversion}%`} accent />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Traffic sources */}
        <Panel title="Where visitors came from">
          {data.bySource.length ? (
            <BarList
              items={data.bySource.map((s) => ({ label: s.source, count: s.count }))}
            />
          ) : (
            <Empty />
          )}
        </Panel>

        {/* Most viewed products */}
        <Panel title="Most-viewed pieces">
          {data.topProducts.length ? (
            <BarList
              items={data.topProducts.map((p) => ({ label: p.label, count: p.count }))}
            />
          ) : (
            <Empty />
          )}
        </Panel>

        {/* Top pages */}
        <Panel title="Busiest pages">
          {data.topPages.length ? (
            <BarList items={data.topPages.map((p) => ({ label: p.path, count: p.count }))} />
          ) : (
            <Empty />
          )}
        </Panel>

        {/* Searches */}
        <Panel title="What people search for">
          {data.searches.length ? (
            <BarList items={data.searches.map((s) => ({ label: s.label, count: s.count }))} />
          ) : (
            <Empty />
          )}
        </Panel>
      </div>

      {/* Scroll depth */}
      <Panel title="How far visitors scroll">
        {data.scrollDepth.length ? (
          <div className="space-y-3">
            {data.scrollDepth.map((s) => (
              <div key={s.bucket}>
                <div className="flex items-center justify-between text-[13px] text-sand">
                  <span>{s.bucket}</span>
                  <span className="text-sand/70">{s.count}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-walnut-2">
                  <div
                    className="h-full rounded-full bg-terra transition-all"
                    style={{ width: `${Math.max(4, (s.count / maxScroll) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty />
        )}
      </Panel>

      {/* Live feed */}
      <Panel title="Latest events">
        {data.recent.length ? (
          <ul className="divide-y divide-line">
            {data.recent.map((e, i) => (
              <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-[13.5px]">
                <span className="rounded-full bg-walnut-2 px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-cream">
                  {e.type}
                </span>
                <span className="text-sand">{e.path}</span>
                {e.label ? <span className="truncate text-sand/70">— {e.label}</span> : null}
                {e.source ? <span className="text-sand/50">via {e.source}</span> : null}
                <span className="ml-auto shrink-0 text-[12px] text-sand/50">
                  {new Date(e.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <Empty />
        )}
      </Panel>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className="panel-c p-5">
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">
        {label}
      </p>
      <p className={`mt-2 font-display text-[30px] font-semibold ${accent ? "text-terra" : "text-cream"}`}>
        {value}
      </p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="panel-c p-6">
      <h2 className="font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-cream">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function BarList({ items }: { items: { label: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.label}>
          <div className="flex items-center justify-between gap-3 text-[13.5px]">
            <span className="truncate text-sand">{i.label}</span>
            <span className="shrink-0 text-sand/70">{i.count}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-walnut-2">
            <div
              className="h-full rounded-full bg-terra/80"
              style={{ width: `${Math.max(4, (i.count / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Empty() {
  return (
    <p className="py-6 text-center text-[14px] text-sand/60">
      No data yet — it appears as visitors browse the site.
    </p>
  );
}
