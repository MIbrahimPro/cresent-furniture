# Crescent — Bespoke Furniture House

E-commerce website + CRM for **Crescent**, a bespoke handcrafted furniture house in Rawalpindi, Pakistan. Every piece is made to order — so "checkout" means a WhatsApp conversation with the workshop, not a payment gateway.

![Crescent](assets/png/crescent-logo-maroon-2000.png)

## Stack & layout

- **Next.js 16 App Router** (React 19, TypeScript strict, Tailwind v4) in `website/`
- **MongoDB** via the native `mongodb` driver (no ODM)
- Route groups: `(storefront)` public site, `admin` CRM, `(auth)` login
- Brand tokens from `documents/brand-guidelines.md`; logos/fonts mirrored into `website/src` and `website/public`

```
website/
  src/app/(storefront)/   home, shop, category, product, cart, contact, about, bespoke, p/[slug]
  src/app/admin/          CRM pages (products, categories, orders, hero, offers, pages, reviews, subscribers, settings)
  src/app/api/            public APIs + /api/admin/* (session-guarded by src/middleware.ts)
  src/app/uploads/        route handler serving runtime-uploaded media from disk
  src/components/         storefront UI (HeroVideo, ProductCard, ShopFilters, CartProvider, WhatsAppFab…)
  src/components/admin/   CRM UI
  src/lib/                mongo, session/auth, settings, catalog queries, pexels, format, types
  scripts/                init-db, seed, seed-offer-page
  data/                   catalog seed JSON + Pexels query map and cache
```

## Setup

Environment lives in the group `.env` at the repo root (see `.env.example`):

- `PEXELS_API` — Pexels API key (hero video samples, seed imagery)
- `MONGODB_URI` — connection string
- `MONGODB_DB` — optional; the code defaults to the `crescent` database, so a shared-cluster URI never touches another app's data

```bash
cd website
npm install
npm run init-db          # indexes + settings doc + first CRM admin
npm run seed             # catalog + Pexels images + 3 hero videos
npm run seed-offer-page  # draft "Offer Deals" page (unpublished)
npm run dev              # http://localhost:3000
```

CRM login comes from `CRM_ADMIN_EMAIL` / `CRM_ADMIN_PASSWORD` at `init-db` time (defaults `owner@crescent.local` / `crescent-admin` — change them). Log in at `/admin/login`.

Other scripts: `build`, `start`, `lint`, `typecheck`.

## Storefront

- **Home hero** — CRM-managed background media plays sequentially and loops; dark maroon overlay with the heading above it; pause control; Pexels attribution shown
- **Shop** — full-text search, category/price/variant/availability filters and sorting, all URL-synced; category landing pages at `/category/[slug]`
- **Product pages** — image gallery, variant groups with per-option price deltas, quantity, per-product WhatsApp enquiry, reviews
- **Cart** — localStorage-persisted, variant-aware
- **WhatsApp checkout** — collects name/phone/address, records the order (CRM-XXXXX number) and opens `wa.me` with every product, variant, quantity, total, and customer details pre-written to the CRM-configured number; no online payment exists by business decision
- **WhatsApp FAB** — floating enquiry bubble on every page
- **Contact / About / Bespoke** — workshop address, phone, hours, map link
- **Custom pages** — CRM-composed pages at `/p/[slug]`

## CRM (`/admin`)

- **Products** — CRUD, variant builder, featured/live flags, image URL list
- **Categories** — add, show/hide, delete (drives nav + filters)
- **Orders** — status pipeline (new → confirmed → in production → ready → delivered, or cancelled) with event history, expandable detail, per-customer WhatsApp deep link
- **Hero media** — ordered playlist; upload videos/images or pull Pexels samples; reorder; removal asks for confirmation
- **Offers** — one sitewide banner with live preview and show/hide
- **Pages** — compose pages from sections (rich text, offer grid, gallery, banner); publish toggle; optional storefront nav entry
- **Reviews** — moderate storefront-submitted notes
- **Settings** — business details, WhatsApp checkout number, shipping note, top-bar announcement
- **Subscribers** — newsletter inbox

## Template components vs CRM content

Layout, sections, and their rendering are **code-configured** (`PageSection` types in `src/lib`, components in `src/components`) — the CRM only fills content. A sample **Offer Deals** page is seeded as an **unpublished draft**: it never appears on the storefront or nav until published; to preview, publish it from CRM Pages, view `/p/offer-deals`, then unpublish (the CRM hint explains this).

## Operational notes

- **Uploads** are written to `public/uploads/` at runtime and served by the `/uploads/[...path]` route handler — `next start` does not serve files added to `public/` after build. Path traversal is rejected.
- **Auth** uses an HMAC-signed session cookie; signing/verification is Web Crypto (`src/lib/session.ts`) so `src/middleware.ts` runs on the Edge runtime. Password hashing is scrypt (Node runtime only).
- **Destructive deletes** (products, categories, pages, reviews, hero clips) always ask for confirmation.
- Prices are whole PKR integers; final pricing is confirmed on commission.

## Business info

**Crescent Bespoke Furniture House**
M36M+3QH, Murree Rd, Gulistan-e-Jinnah Colony Faizabad, Rawalpindi
Phone: 0311 8550000 · https://www.crescentfurnitures.com/

See `AGENTS.md` for coding conventions and data-model notes.
