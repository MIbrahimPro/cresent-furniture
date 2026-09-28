// Catalog domain types

export interface VariantGroup {
  /** e.g. "Finish" */
  name: string;
  /** e.g. ["Walnut", "Natural Teak"] */
  options: string[];
  /** Optional price added per option, aligned with `options` */
  priceDeltas?: number[];
}

export type ProductKind = "in-stock" | "made-to-order";

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

// ---------- Cart, order, and checkout types ----------

export interface CartItem {
  /** Product hex id */
  productId: string;
  slug: string;
  name: string;
  image?: string;
  /** Whole PKR */
  unitPrice: number;
  qty: number;
  /** Chosen variant options, e.g. { Finish: "Walnut", Size: "6-seater" } */
  options: Record<string, string>;
}

export type OrderStatus =
  | "new"
  | "confirmed"
  | "in_production"
  | "ready"
  | "delivered"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "in_production",
  "ready",
  "delivered",
  "cancelled",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  in_production: "In production",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  city?: string;
  note?: string;
}

export interface OrderEvent {
  status: OrderStatus;
  at: Date;
  note?: string;
  by?: string;
}

export interface Order {
  _id?: import("mongodb").ObjectId;
  /** Human-readable order number, e.g. CRM-48211 */
  number: string;
  items: CartItem[];
  total: number;
  customer: OrderCustomer;
  status: OrderStatus;
  events: OrderEvent[];
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Settings, media, pages, users, reviews ----------

export interface OfferBanner {
  id: string;
  text: string;
  href?: string;
  active: boolean;
}

export interface HeroMediaItem {
  id: string;
  type: "video" | "image";
  url: string;
  /** Pexels attribution when sourced from Pexels */
  credit?: string;
  addedAt: Date;
}

export interface SettingsDoc {
  _id: "site";
  business: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    whatsapp: string;
    email?: string;
    hours?: string;
    mapUrl?: string;
  };
  /** Hero background media in playback order; loops back to the start */
  heroMedia: HeroMediaItem[];
  offerBanner: OfferBanner | null;
  shippingNote: string;
  announcement: string;
  updatedAt: Date;
}

/** CRM media library entries (uploaded or fetched from Pexels) */
export interface CrmMedia {
  _id?: import("mongodb").ObjectId;
  id: string;
  type: "video" | "image";
  url: string;
  /** Original filename for uploads */
  filename?: string;
  credit?: string;
  addedAt: Date;
}

// ---------- CMS custom pages ----------

export interface CustomPage {
  _id?: import("mongodb").ObjectId;
  slug: string;
  title: string;
  intro?: string;
  sections: PageSection[];
  published: boolean;
  showInNav: boolean;
  navOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PageSection =
  | { type: "rich-text"; heading?: string; body: string }
  | {
      type: "offer-grid";
      heading?: string;
      intro?: string;
      offers: {
        title: string;
        description?: string;
        image?: string;
        price?: number;
        comparePrice?: number;
        href?: string;
        badge?: string;
      }[];
    }
  | { type: "gallery"; heading?: string; images: string[] }
  | { type: "banner"; text: string; href?: string; label?: string };

// ---------- Auth ----------

export interface CrmUser {
  _id?: import("mongodb").ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "owner" | "staff";
  createdAt: Date;
}

// ---------- Tracking / analytics ----------

export type TrackingEventType =
  | "pageview"
  | "product_view"
  | "scroll"
  | "dwell"
  | "click"
  | "search"
  | "cart_add"
  | "cart_remove"
  | "checkout_whatsapp"
  | "newsletter"
  | "enquiry"
  | "review_submit";

export interface TrackingEvent {
  _id?: import("mongodb").ObjectId;
  /** Long-lived visitor cookie id (crescent_vid) */
  visitorId: string;
  /** Sliding 30-minute session cookie id (crescent_sid) */
  sessionId: string;
  type: TrackingEventType | string;
  path: string;
  /** document.referrer on first hop of the session */
  referrer?: string;
  /** Derived channel: google | instagram | whatsapp | facebook | direct | … */
  source?: string;
  utm?: Record<string, string>;
  /** Slug, search term, or click target description */
  label?: string;
  /** Scroll %, dwell seconds, qty, etc. */
  value?: number;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

// ---------- CRM inbox (contact form / mails) ----------

export interface ContactMessage {
  _id?: import("mongodb").ObjectId;
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  body: string;
  handled: boolean;
  createdAt: Date;
}

// ---------- Reviews ----------

export interface Review {
  _id?: import("mongodb").ObjectId;
  productSlug: string;
  orderNumber?: string;
  name: string;
  rating: number; // 1-5
  title?: string;
  body: string;
  approved: boolean;
  createdAt: Date;
}
