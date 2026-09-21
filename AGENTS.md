# AGENTS.md — Working Conventions

Rules for any AI agent or developer contributing to this repository.

## Project

- **Crescent Bespoke Furniture House** — Next.js 16 (App Router) e-commerce site + CRM for a handcrafted furniture business in Rawalpindi, Pakistan. App lives in `website/`.
- Owner files: `documents/brand-guidelines.md` is the **branding source of truth**. `assets/` holds logo SVGs/PNGs, favicons, and fonts. Do not modify them.
- `.env` at the repo root holds `PEXELS_API` and `MONGODB_URI`. Never commit real secrets; `.env.example` (root and `website/`) documents the shape.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4 (CSS-first `@theme` in `website/src/app/globals.css`; base styles live in `@layer base` so utility classes can override them).
- MongoDB native driver (no Mongoose) — one shared client in `website/src/lib/mongo.ts`. Database defaults to `"crescent"` in code; `MONGODB_DB` env overrides (the group URI may point at a shared cluster).
- Auth: HMAC-signed HTTP-only cookie. Signing/verification is **Web Crypto only** (`src/lib/session.ts`) because `src/middleware.ts` runs on the Edge runtime; password hashing is scrypt in `src/lib/auth.ts` (Node runtime, `server-only`). CRM admins are seeded by `npm run init-db` from `CRM_ADMIN_EMAIL`/`CRM_ADMIN_PASSWORD`.
- Fonts are local (`src/fonts/`, Cinzel + EB Garamond, OFL); design tokens mirror brand guidelines §11.

## Commands

Run inside `website/`:

- `npm run dev` — dev server (env `PORT=0` may be set; pass `PORT` explicitly to pin one)
- `npm run build` && `npm start` — production
- `npm run typecheck` — `tsc --noEmit` (run after every change)
- `npm run lint` — ESLint
- `npm run init-db` — indexes + settings doc + first CRM admin (idempotent)
- `npm run seed` — catalog from `data/catalog*.json`; resolves `pexels:<token>` image references via the Pexels API (cached in `data/pexels-cache.json`), sets 3 hero videos (idempotent)
- `npm run seed-offer-page` — upserts the draft "Offer Deals" page (idempotent)

Source the root `.env` before running scripts: `set -a && source ../.env && set +a`.

## Conventions

- Server Components by default; `"use client"` only where interactivity is needed (cart context, filters, forms, hero player, CRM managers).
- All DB access goes through `src/lib/mongo.ts` (`getCollection`, `getDB`). Scripts open their own client but also honor `MONGODB_DB`.
- Collections: `products`, `categories`, `orders`, `settings` (single doc `_id: "site"`), `crm_media`, `crm_users`, `reviews`, `newsletter_subscribers`, `custom_pages`, `counters`.
- Money is **whole PKR integers** (no floats).
- Product variants: `[{ name: "Finish", options: ["Walnut", "Teak"], priceDeltas: [0, 15000] }]` — cart items embed the chosen options and the delta-adjusted unit price.
- Product `slug` is the public identifier in URLs; `_id` only inside the CRM.
- Order flow = WhatsApp checkout only (no online payment, by business decision). Checkout POSTs to `/api/orders` (number format `CRM-XXXXX`) then opens `wa.me` with items, variants, quantities, total, and customer details pre-filled.
- CRM pages live at `/admin/*`, gated by `src/middleware.ts` (cookie check, Edge-safe). Login is outside the admin layout at `(auth)/admin/login` to avoid a redirect loop.
- Custom pages are typed sections (`PageSection` in `src/lib/site-types.ts`: rich-text, offer-grid, gallery, banner) rendered by `(storefront)/p/[slug]`. Sections/layout are code-configured; the CRM edits content only. Unpublished pages 404 on the storefront.
- Runtime uploads POST base64 data URLs to `/api/admin/media` → written to `public/uploads/` and served by the `src/app/uploads/[...path]` route handler (not static — `next start` won't serve post-build files). Handler rejects traversal.
- Destructive deletes in the CRM always `confirm()` first — keep it that way.
- `revalidateStorefront()` in `src/lib/admin.ts` drops cached storefront paths after CRM mutations.

## Never

- Never commit `.env`, node_modules, `.next`, or `public/uploads/` contents.
- Never run `git push` unless the user explicitly asks.
- Never add online payment gateways — WhatsApp checkout is the only conversion path by business decision.
- Never hardcode the WhatsApp number in components — read it from settings (`SettingsDoc.business.whatsapp`).
- Never modify `assets/`, `documents/`, or `branding/` brand files.
- Never remove `confirm()` guards from destructive CRM actions.

## Commit style

Short imperative subject lines, one logical step per commit ("Add product detail page", "Fix hero heading color"). The user wants granular history — commit after each completed change, never one giant monolith. End commit messages with the Codebuff footer.

## Verification habit

`npm run typecheck` after every change; `npm run build` before declaring done; exercise changed flows against a running server (`npm start` with an explicit `PORT`) rather than trusting code reading.
