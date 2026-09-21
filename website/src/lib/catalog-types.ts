// Catalog domain types

export interface VariantGroup {
  /** e.g. "Finish" */
  name: string;
  /** e.g. ["Walnut", "Natural Teak"] */
  options: string[];
  /** Optional price added per option, aligned with `options` */
  priceDeltas?: number[];
}

export type ProductKind = "ready" | "bespoke";

export interface Product {
  _id?: import("mongodb").ObjectId;
  /** URL identifier */
  slug: string;
  name: string;
  categorySlug: string;
  /** Short line shown on cards */
  tagline: string;
  description: string;
  /** Whole PKR */
  price: number;
  /** Optional "was" price for offers */
  comparePrice?: number;
  images: string[];
  variants: VariantGroup[];
  kind: ProductKind;
  /** Ready-to-ship pieces have finite stock; bespoke are made to order */
  stock: number;
  featured: boolean;
  active: boolean;
  materials: string[];
  /** Workshop lead time, e.g. "6-8 weeks" */
  leadTime: string;
  dimensions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id?: import("mongodb").ObjectId;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  active: boolean;
  createdAt: Date;
}
