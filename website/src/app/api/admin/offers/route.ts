import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import type { OfferBanner, SettingsDoc } from "@/lib/types";

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { text?: string; href?: string; active?: boolean };
    if (!body.text?.trim()) {
      return NextResponse.json({ error: "Offer text is required" }, { status: 400 });
    }
    const banner: OfferBanner = {
      id: "sitewide",
      text: body.text.trim().slice(0, 160),
      href: body.href,
      active: Boolean(body.active),
    };
    const col = await getCollection<SettingsDoc>("settings");
    await col.updateOne(
      { _id: "site" as unknown as never },
      { $set: { offerBanner: banner, updatedAt: new Date() } },
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
