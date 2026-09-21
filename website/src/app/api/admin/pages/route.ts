import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import { revalidateStorefront } from "@/lib/admin";
import type { CustomPage } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CustomPage>;
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }
    const col = await getCollection<CustomPage>("custom_pages");
    const now = new Date();
    await col.insertOne({
      slug: body.slug.trim(),
      title: body.title.trim(),
      intro: body.intro,
      sections: body.sections ?? [],
      published: body.published ?? false,
      showInNav: body.showInNav ?? false,
      navOrder: body.navOrder ?? 10,
      createdAt: now,
      updatedAt: now,
    });
    revalidateStorefront();
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const dup = e instanceof Error && e.message.includes("duplicate");
    return NextResponse.json(
      { error: dup ? "That slug already exists" : "Server error" },
      { status: dup ? 409 : 500 },
    );
  }
}
