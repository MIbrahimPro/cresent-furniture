// Shared formatting + WhatsApp helpers (safe on client and server)

export function formatPKR(n: number): string {
  return `PKR ${n.toLocaleString("en-PK")}`;
}

import type { CartItem } from "./types";

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

/** "Walnut / 8-seater" from an options record */
export function optionsLabel(options: Record<string, string>): string {
  return Object.values(options).join(" / ");
}

export interface WhatsAppOrderInfo {
  customerName?: string;
  phone?: string;
  address?: string;
  city?: string;
  note?: string;
}

export function buildWhatsAppMessage(
  items: CartItem[],
  info: WhatsAppOrderInfo = {},
): string {
  const lines: string[] = [];
  lines.push("Assalam-o-Alaikum, Crescent!");
  lines.push("");
  lines.push("I would like to commission the following pieces:");
  lines.push("");

  items.forEach((item, i) => {
    const opts = optionsLabel(item.options);
    const opt = opts ? ` (${opts})` : "";
    lines.push(
      `${i + 1}. ${item.name}${opt} × ${item.qty} — ${formatPKR(item.unitPrice * item.qty)}`,
    );
  });

  lines.push("");
  lines.push(`Order total: ${formatPKR(cartTotal(items))}`);
  lines.push("(Final pricing and delivery to be confirmed by the workshop.)");

  if (info.customerName || info.phone || info.address) {
    lines.push("");
    lines.push("My details:");
    if (info.customerName) lines.push(`Name: ${info.customerName}`);
    if (info.phone) lines.push(`Phone: ${info.phone}`);
    if (info.address) lines.push(`Address: ${info.address}${info.city ? `, ${info.city}` : ""}`);
    if (info.note) lines.push(`Note: ${info.note}`);
  }

  lines.push("");
  lines.push("— Sent from the Crescent website");

  return lines.join("\n");
}

export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = number.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Quick enquiry bubble message (single product or general) */
export function buildEnquiryUrl(number: string, productName?: string): string {
  const msg = productName
    ? `Assalam-o-Alaikum, Crescent! I have a question about the ${productName}.`
    : "Assalam-o-Alaikum, Crescent! I have a question about your furniture.";
  return buildWhatsAppUrl(number, msg);
}
