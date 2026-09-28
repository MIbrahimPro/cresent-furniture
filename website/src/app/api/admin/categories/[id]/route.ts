import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongo";
import type { Category } from "@/lib/types";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<Category>;
    const { _id: _omitId, createdAt: _omitCreated, ...rest } = body;
    const col = await getCollection<Category>("categories");
    const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: rest });
    if (!res.matchedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const col = await getCollection<Category>("categories");
    await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
