import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getCollection } from "@/lib/mongo";
import type { CrmMedia } from "@/lib/types";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 60 * 1024 * 1024; // 60 MB

export async function GET() {
  const col = await getCollection<CrmMedia>("crm_media");
  const items = await col.find().sort({ addedAt: -1 }).limit(200).toArray();
  return NextResponse.json({ items });
}

/** Upload a file as a base64 data URL; returns the public path. */
export async function POST(req: Request) {
  try {
    const { dataUrl, filename } = (await req.json()) as { dataUrl?: string; filename?: string };
    if (!dataUrl?.startsWith("data:")) {
      return NextResponse.json({ error: "dataUrl (base64 data URL) required" }, { status: 400 });
    }

    const match = /^data:([\w.+-]+\/[\w.+-]+)?;base64,(.+)$/.exec(dataUrl);
    if (!match) return NextResponse.json({ error: "Invalid data URL" }, { status: 400 });

    const mime = match[1] || "application/octet-stream";
    const isVideo = mime.startsWith("video/");
    const isImage = mime.startsWith("image/");
    if (!isVideo && !isImage) {
      return NextResponse.json({ error: "Only video and image uploads are supported" }, { status: 415 });
    }

    const buffer = Buffer.from(match[2], "base64");
    if (buffer.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 60 MB)" }, { status: 413 });
    }

    await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
    const ext =
      (filename && path.extname(filename).slice(0, 8)) ||
      (isVideo ? ".mp4" : mime === "image/png" ? ".png" : ".jpg");
    const name = `${crypto.randomBytes(8).toString("hex")}${ext}`;
    await fs.promises.writeFile(path.join(UPLOAD_DIR, name), buffer);

    const col = await getCollection<CrmMedia>("crm_media");
    const media: CrmMedia = {
      id: `up-${name}`,
      type: isVideo ? "video" : "image",
      url: `/uploads/${name}`,
      filename: filename || name,
      addedAt: new Date(),
    };
    await col.insertOne(media);

    return NextResponse.json({ ok: true, media });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
