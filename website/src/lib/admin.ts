import "server-only";
import { revalidatePath } from "next/cache";
import { getCollection } from "./mongo";

/** Drop cached storefront pages after CRM changes */
export function revalidateStorefront() {
  for (const p of ["/", "/shop", "/cart", "/contact", "/about", "/bespoke"]) {
    revalidatePath(p);
  }
  revalidatePath("/admin", "layout");
}

export async function nextOrderNumber(): Promise<string> {
  const counters = await getCollection<{ _id: string; seq: number }>("counters");
  const doc = await counters.findOneAndUpdate(
    { _id: "order" },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return `CRM-${10000 + (doc?.seq ?? 0)}`;
}
