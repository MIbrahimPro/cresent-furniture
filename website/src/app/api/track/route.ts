import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import type { TrackingEvent, TrackingEventType } from "@/lib/types";

/**
 * Fire-and-forget analytics ingest. Accepts one event per POST.
 * Deliberately tolerant: tracking must never break the storefront,
 * so every failure resolves to 204.
 */

const KNOWN: TrackingEventType[] = [
  "pageview",
  "product_view",
  "scroll",
  "dwell",
  "click",
  "search",
  "cart_add",
  "cart_remove",
  "checkout_whatsapp",
  "newsletter",
  "enquiry",
  "review_submit",
];

const MAX_LABEL = 300;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<TrackingEvent> & { v?: string };
    if (!body.visitorId || !body.sessionId || !body.type || !body.path) {
      return new NextResponse(null, { status: 204 });
    }

    const doc: TrackingEvent = {
      visitorId: String(body.visitorId).slice(0, 64),
      sessionId: String(body.sessionId).slice(0, 64),
      type: KNOWN.includes(body.type as TrackingEventType) ? body.type : "click",
      path: String(body.path).slice(0, 300),
      ...(body.referrer ? { referrer: String(body.referrer).slice(0, 300) } : {}),
      ...(body.source ? { source: String(body.source).slice(0, 40) } : {}),
      ...(body.utm ? { utm: body.utm } : {}),
      ...(body.label ? { label: String(body.label).slice(0, MAX_LABEL) } : {}),
      ...(typeof body.value === "number" && Number.isFinite(body.value)
        ? { value: body.value }
        : {}),
      ...(body.meta && typeof body.meta === "object" ? { meta: body.meta } : {}),
      createdAt: new Date(),
    };

    const col = await getCollection<TrackingEvent>("tracking_events");
    await col.insertOne(doc);
  } catch {
    // Swallow — analytics never blocks the shop
  }
  return new NextResponse(null, { status: 204 });
}
