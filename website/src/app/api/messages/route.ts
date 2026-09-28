import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import type { ContactMessage } from "@/lib/types";

/**
 * Contact-form submissions land in the CRM inbox (mongo `messages`),
 * mirrored by a tracking "enquiry" event for the analytics view.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      subject?: string;
      body?: string;
    };

    if (!body.name?.trim() || !body.body?.trim()) {
      return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
    }

    const col = await getCollection<ContactMessage>("messages");
    await col.insertOne({
      name: body.name.trim().slice(0, 120),
      ...(body.phone?.trim() ? { phone: body.phone.trim().slice(0, 40) } : {}),
      ...(body.email?.trim() ? { email: body.email.trim().slice(0, 160) } : {}),
      ...(body.subject?.trim() ? { subject: body.subject.trim().slice(0, 200) } : {}),
      body: body.body.trim().slice(0, 4000),
      handled: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
