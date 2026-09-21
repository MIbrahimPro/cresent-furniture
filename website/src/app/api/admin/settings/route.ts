import { NextResponse } from "next/server";
import { updateSettings } from "@/lib/settings";
import type { SettingsDoc } from "@/lib/types";

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Partial<SettingsDoc>;
    // Only whitelisted parts are updatable
    await updateSettings({
      business: body.business,
      shippingNote: body.shippingNote,
      announcement: body.announcement,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
