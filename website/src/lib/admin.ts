import "server-only";
import { revalidatePath } from "next/cache";

/** Drop cached storefront pages after CRM changes */
export function revalidateStorefront() {
  for (const p of ["/", "/shop", "/cart", "/contact", "/about", "/bespoke"]) {
    revalidatePath(p);
  }
  revalidatePath("/admin", "layout");
}
