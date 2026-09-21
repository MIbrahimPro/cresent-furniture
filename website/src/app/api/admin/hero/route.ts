import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import { revalidateStorefront } from "@/lib/admin";
import { pexelsKey, searchPexelsVideos } from "@/lib/pexels";
import type { HeroMediaItem, SettingsDoc } from "@/lib/types";

/** Search Pexels for sample hero videos */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "furniture workshop";
  try {
    const videos = await searchPexelsVideos(query, 12);
    return NextResponse.json({ videos });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Pexels search failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/** Replace the hero playlist (ordered) */
export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { media?: HeroMediaItem[] };
    const media = (body.media ?? []).slice(0, 12).map((m) => ({
      id: m.id,
      type: m.type,
      url: m.url,
      credit: m.credit,
      addedAt: m.addedAt instanceof Date ? m.addedAt : new Date(m.addedAt ?? Date.now()),
    }));
    const col = await getCollection<SettingsDoc>("settings");
    await col.updateOne(
      { _id: "site" as unknown as never },
      { $set: { heroMedia: media, updatedAt: new Date() } },
      { upsert: true },
    );
    revalidateStorefront();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
