import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import type { Product } from "@/lib/types";
import { toPlainList } from "@/lib/serialize";

/**
 * Public endpoint powering the personalized "Recently viewed" strip.
 * Returns active products matching the given slugs, in the order given,
 * capped at 8. Slugs come from the visitor's own localStorage history.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slugsParam = url.searchParams.get("slugs") ?? "";
    const slugs = slugsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);

    if (!slugs.length) return NextResponse.json({ products: [] });

    const col = await getCollection<Product>("products");
    const docs = await col
      .find({ slug: { $in: slugs }, active: true })
      .toArray();

    // Preserve the visitor's recency order
    const bySlug = new Map(docs.map((d) => [d.slug, d]));
    const ordered = slugs.map((s) => bySlug.get(s)).filter(Boolean) as Product[];

    return NextResponse.json({ products: toPlainList(ordered) });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
