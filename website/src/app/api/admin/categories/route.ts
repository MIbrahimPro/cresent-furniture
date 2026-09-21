import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import type { Category } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string; slug?: string };
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }
    const col = await getCollection<Category>("categories");
    const existing = await col.countDocuments();
    await col.insertOne({
      name: body.name.trim(),
      slug: body.slug.trim(),
      order: existing + 1,
      active: true,
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const dup = e instanceof Error && e.message.includes("duplicate");
    return NextResponse.json(
      { error: dup ? "That slug already exists" : "Server error" },
      { status: dup ? 409 : 500 },
    );
  }
}
