import { getCollection } from "./mongo";
import type { SettingsDoc } from "./types";

export const DEFAULT_SETTINGS: Omit<SettingsDoc, "_id" | "updatedAt"> = {
  business: {
    name: "Crescent",
    tagline: "Bespoke Furniture House",
    address: "M36M+3QH, Murree Rd, Gulistan-e-Jinnah Colony Faizabad, Rawalpindi",
    phone: "0311 8550000",
    whatsapp: "923118550000",
    email: undefined,
    hours: "Mon–Sat, 10am–8pm",
    mapUrl: "https://maps.google.com/?q=Crescent+Furniture+Faizabad+Rawalpindi",
  },
  heroMedia: [],
  offerBanner: null,
  shippingNote: "Delivery across Islamabad & Rawalpindi included. Final pricing confirmed on commission.",
  announcement: "",
};

export async function getSettings(): Promise<SettingsDoc> {
  try {
    const col = await getCollection<SettingsDoc>("settings");
    const doc = await col.findOne({ _id: "site" });
    if (doc) {
      return {
        ...DEFAULT_SETTINGS,
        ...doc,
        business: { ...DEFAULT_SETTINGS.business, ...doc.business },
      };
    }
  } catch {
    // DB unavailable (e.g. during a build) — fall back to defaults
  }
  return { ...DEFAULT_SETTINGS, _id: "site", updatedAt: new Date(0) };
}

/** Partial update helper for the CRM settings form */
export async function updateSettings(patch: Partial<SettingsDoc>): Promise<void> {
  const col = await getCollection<SettingsDoc>("settings");
  await col.updateOne(
    { _id: "site" },
    { $set: { ...patch, updatedAt: new Date() }, $setOnInsert: { _id: "site" as const } },
    { upsert: true },
  );
}
