import { getCollection } from "@/lib/mongo";
import { formatPKR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminSubscribers() {
  let rows: { email: string; subscribedAt: Date }[] = [];
  try {
    const col = await getCollection<{ email: string; subscribedAt: Date }>("newsletter_subscribers");
    rows = await col.find().sort({ subscribedAt: -1 }).limit(500).toArray();
  } catch {
    // DB unreachable
  }

  return (
    <div>
      <h1 className="display-c text-[26px]">Subscribers</h1>
      <p className="mt-1.5 text-[16px] text-sand">
        {rows.length} workshop-letter {rows.length === 1 ? "reader" : "readers"}.
      </p>
      <div className="panel-c mt-8 max-w-3xl divide-y divide-line">
        {rows.length === 0 ? (
          <p className="p-6 text-[15px] text-sand">Nobody yet — the letter is young.</p>
        ) : (
          rows.map((r) => (
            <div key={r.email} className="flex items-center justify-between px-5 py-3">
              <p className="text-[15px]">{r.email}</p>
              <p className="text-[13.5px] text-sand">
                {new Date(r.subscribedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
