import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongo";
import { getSessionUser } from "@/lib/auth";
import type { Order, OrderEvent, OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/types";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, note } = (await req.json()) as { status?: OrderStatus; note?: string };
    if (!status || !ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const user = await getSessionUser();
    const col = await getCollection<Order>("orders");
    const event: OrderEvent = { status, at: new Date(), note, by: user?.name };
    const res = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() }, $push: { events: event } },
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
    const col = await getCollection<Order>("orders");
    await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
