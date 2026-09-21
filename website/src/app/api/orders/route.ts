import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import type { CartItem, Order, OrderEvent, OrderStatus } from "@/lib/types";
import { cartTotal } from "@/lib/format";

/**
 * Called by the cart just before WhatsApp opens so the CRM has a record
 * of the order even if the customer never presses send.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      items?: CartItem[];
      customer?: Order["customer"];
    };
    const items = body.items ?? [];
    const customer = body.customer;

    if (!items.length || !customer?.name || !customer?.phone) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }

    const col = await getCollection<Order>("orders");

    // Human-friendly order number for the WhatsApp conversation
    const seq = Math.floor(10000 + Math.random() * 89999);
    const number = `CRM-${seq}`;
    const now = new Date();
    const firstEvent: OrderEvent = { status: "new" as OrderStatus, at: now };

    await col.insertOne({
      number,
      items,
      total: cartTotal(items),
      customer,
      status: "new",
      events: [firstEvent],
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ ok: true, number });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
