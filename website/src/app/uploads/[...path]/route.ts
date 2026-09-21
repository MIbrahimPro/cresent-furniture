import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// `next start` only serves files that existed in public/ at build time, so
// media uploaded by the CRM after a deploy would 404. This route serves the
// uploads directory from disk instead.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // Reject traversal: only simple names inside the uploads dir are served
  if (!segments.length || segments.some((s) => s.includes("/") || s.includes("\\") || s.startsWith("."))) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(UPLOAD_DIR, ...segments);
  if (!filePath.startsWith(UPLOAD_DIR) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const data = await fs.promises.readFile(filePath);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "Content-Length": String(data.byteLength),
    },
  });
}
