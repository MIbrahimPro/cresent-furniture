import "server-only";
import { getCollection } from "./mongo";
import type { CustomPage } from "./types";

export async function getPublishedPages(): Promise<CustomPage[]> {
  const col = await getCollection<CustomPage>("custom_pages");
  return col.find({ published: true }).sort({ navOrder: 1 }).toArray();
}

export async function getPageBySlug(slug: string): Promise<CustomPage | null> {
  const col = await getCollection<CustomPage>("custom_pages");
  return col.findOne({ slug, published: true });
}
