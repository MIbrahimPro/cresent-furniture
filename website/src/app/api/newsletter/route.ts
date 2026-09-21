import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    const col = await getCollection("newsletter_subscribers");
    await col.updateOne(
      { email: email.toLowerCase().trim() },
      { $set: { subscribedAt: new Date() } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
