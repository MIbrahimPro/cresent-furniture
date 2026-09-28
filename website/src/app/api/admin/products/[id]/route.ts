import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongo";
import type { Product } from "@/lib/types";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<Product>;
    const col = await getCollection<Product>("products");
    const { _id: _omitId, createdAt: _omitCreated, ...rest } = body as Product;
    const res = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...rest, updatedAt: new Date() } },
    );
    if (!res.matchedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const col = await getCollection<Product>("products");
    await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
