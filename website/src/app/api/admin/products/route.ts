import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import type { Product } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Product>;
    if (!body.name || !body.slug || !body.categorySlug) {
      return NextResponse.json({ error: "Name, slug, and category are required" }, { status: 400 });
    }
    const col = await getCollection<Product>("products");
    const now = new Date();
    await col.insertOne({
      ...(body as Product),
      slug: body.slug.trim(),
      stock: body.stock ?? 0,
      featured: body.featured ?? false,
      active: body.active ?? true,
      images: body.images ?? [],
      variants: body.variants ?? [],
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error && e.message.includes("duplicate") ? "That slug already exists" : "Server error";
    return NextResponse.json({ error: msg }, { status: e instanceof Error && e.message.includes("duplicate") ? 409 : 500 });
  }
}
