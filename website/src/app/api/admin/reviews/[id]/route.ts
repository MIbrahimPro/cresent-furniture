import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongo";
import { revalidateStorefront } from "@/lib/admin";
import type { Review } from "@/lib/types";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { approved } = (await req.json()) as { approved?: boolean };
    const col = await getCollection<Review>("reviews");
    const res = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { approved: Boolean(approved) } },
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
    const col = await getCollection<Review>("reviews");
    await col.deleteOne({ _id: new ObjectId(id) });
    revalidateStorefront();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
