// Settings, media, pages, users, reviews

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
