import "server-only";
import { getCollection } from "./mongo";
import type { Category, Product } from "./types";

export async function getActiveCategories(): Promise<Category[]> {
  const col = await getCollection<Category>("categories");
  return col.find({ active: true }).sort({ order: 1, name: 1 }).toArray();
}

export async function getAllCategories(): Promise<Category[]> {
  const col = await getCollection<Category>("categories");
  return col.find().sort({ order: 1, name: 1 }).toArray();
}

export interface CatalogFilter {
  category?: string;
  q?: string;
  min?: number;
  max?: number;
  variant?: string; // "Finish:Walnut"
  availability?: "all" | "in-stock" | "made-to-order";
  featured?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "name" | "newest";
}

export async function searchProducts(filter: CatalogFilter) {
  const col = await getCollection<Product>("products");
  const query: Record<string, unknown> = { active: true };

  if (filter.category) query.categorySlug = filter.category;
  if (filter.featured) query.featured = true;
  if (filter.min !== undefined || filter.max !== undefined) {
    query.price = {};
    if (filter.min !== undefined) (query.price as Record<string, number>).$gte = filter.min;
    if (filter.max !== undefined) (query.price as Record<string, number>).$lte = filter.max;
  }
  if (filter.availability === "in-stock") query.kind = "in-stock";
  if (filter.availability === "made-to-order") query.kind = "made-to-order";
  if (filter.variant) {
    const [groupName, option] = filter.variant.split(":");
    if (groupName && option) {
      query.variants = {
        $elemMatch: { name: groupName, options: option },
      };
    }
  }
  if (filter.q) {
    const rx = new RegExp(filter.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: rx }, { tagline: rx }, { description: rx }, { materials: rx }];
  }

  const sort: Record<string, 1 | -1> =
    filter.sort === "price-asc"
      ? { price: 1 }
      : filter.sort === "price-desc"
        ? { price: -1 }
        : filter.sort === "name"
          ? { name: 1 }
          : filter.sort === "newest"
            ? { createdAt: -1 }
            : { featured: -1, createdAt: -1 };

  return col.find(query).sort(sort).toArray();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const col = await getCollection<Product>("products");
  return col.findOne({ slug, active: true });
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  const col = await getCollection<Product>("products");
  return col.find({ slug: { $in: slugs }, active: true }).toArray();
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const col = await getCollection<Product>("products");
  return col
    .find({ categorySlug: product.categorySlug, active: true, slug: { $ne: product.slug } })
    .limit(limit)
    .toArray();
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const col = await getCollection<Product>("products");
  return col
    .find({ active: true, featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

/** Distinct variant groups across active products, for the filter sidebar */
export async function getVariantFacets(): Promise<Record<string, string[]>> {
  const products = await searchProducts({});
  const facets: Record<string, string[]> = {};
  for (const p of products) {
    for (const g of p.variants ?? []) {
      if (!facets[g.name]) facets[g.name] = [];
      for (const opt of g.options) {
        if (!facets[g.name].includes(opt)) facets[g.name].push(opt);
      }
    }
  }
  return facets;
}
