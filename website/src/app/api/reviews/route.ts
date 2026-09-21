import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import type { Review } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Review>;
    const { productSlug, name, rating, title, body: text } = body;

    if (!productSlug || !name || !text || typeof rating !== "number") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const col = await getCollection<Review>("reviews");
    await col.insertOne({
      productSlug,
      name: String(name).slice(0, 80),
      rating: Math.round(rating),
      title: title ? String(title).slice(0, 120) : undefined,
      body: String(text).slice(0, 2000),
      approved: false, // moderated in the CRM
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
