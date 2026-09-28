import { NextResponse } from "next/server";
import { ObjectId } from "@/lib/mongo";
import { getCollection } from "@/lib/mongo";
import type { ContactMessage } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Bad id" }, { status: 400 });
    }
    const body = (await req.json()) as { handled?: boolean };
    const col = await getCollection<ContactMessage>("messages");
    await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { handled: !!body.handled } },
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
