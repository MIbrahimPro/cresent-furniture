import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongo";
import { revalidateStorefront } from "@/lib/admin";
import type { CustomPage } from "@/lib/types";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<CustomPage>;
    const { _id, createdAt, ...rest } = body;
    const col = await getCollection<CustomPage>("custom_pages");
    const res = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...rest, updatedAt: new Date() } },
    );
    if (!res.matchedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateStorefront();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const col = await getCollection<CustomPage>("custom_pages");
    await col.deleteOne({ _id: new ObjectId(id) });
    revalidateStorefront();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
