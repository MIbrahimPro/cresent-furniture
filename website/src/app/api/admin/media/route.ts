import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { getCollection } from "@/lib/mongo";
import type { CrmMedia } from "@/lib/types";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 60 * 1024 * 1024; // 60 MB

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_API_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

/** Extract the public_id from a Cloudinary delivery URL (for future deletes). */
function publicIdFromUrl(url: string): string | undefined {
  const m = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/.exec(url);
  return m?.[1];
}

/** Upload a file to Cloudinary when configured, else to local disk. */
export async function POST(req: Request) {
  try {
    const { dataUrl, filename, folder } = (await req.json()) as {
      dataUrl?: string;
      filename?: string;
      folder?: string;
    };
    if (!dataUrl?.startsWith("data:")) {
      return NextResponse.json({ error: "dataUrl (base64 data URL) required" }, { status: 400 });
    }

    const match = /^data:([\w.+-]+\/[\w.+-]+)?;base64,(.+)$/.exec(dataUrl);
    if (!match) return NextResponse.json({ error: "Invalid data URL" }, { status: 400 });

    const mime = match[1] || "application/octet-stream";
    const isVideo = mime.startsWith("video/");
    const isImage = mime.startsWith("image/");
    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Only video and image uploads are supported" },
        { status: 415 },
      );
    }

    const buffer = Buffer.from(match[2], "base64");
    if (buffer.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 60 MB)" }, { status: 413 });
    }

    const col = await getCollection<CrmMedia>("crm_media");
    const addedAt = new Date();

    // --- Cloudinary path (CDN URLs, works on any host) ---
    if (cloudinaryConfigured()) {
      const result = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: folder || "crescent",
              resource_type: isVideo ? "video" : "image",
              unique_filename: true,
              overwrite: false,
            },
            (error, uploaded) =>
              error || !uploaded
                ? reject(error ?? new Error("Cloudinary upload failed"))
                : resolve(uploaded as unknown as { secure_url: string; public_id: string }),
          );
          stream.end(buffer);
        },
      );

      const media: CrmMedia = {
        id: `cl-${result.public_id}`,
        type: isVideo ? "video" : "image",
        url: result.secure_url,
        filename: filename || result.public_id,
        addedAt,
      };
      await col.insertOne(media);
      void publicIdFromUrl(result.secure_url); // kept for future delete support
      return NextResponse.json({ ok: true, media });
    }

    // --- Local fallback (public/uploads + disk route) ---
    await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
    const ext =
      (filename && path.extname(filename).slice(0, 8)) ||
      (isVideo ? ".mp4" : mime === "image/png" ? ".png" : ".jpg");
    const name = `${crypto.randomBytes(8).toString("hex")}${ext}`;
    await fs.promises.writeFile(path.join(UPLOAD_DIR, name), buffer);

    const media: CrmMedia = {
      id: `up-${name}`,
      type: isVideo ? "video" : "image",
      url: `/uploads/${name}`,
      filename: filename || name,
      addedAt,
    };
    await col.insertOne(media);

    return NextResponse.json({ ok: true, media });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
