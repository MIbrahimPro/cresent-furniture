# AGENTS.md — Working Conventions

Working rules for any AI agent or developer contributing to this repository.

## Project

- **Crescent Bespoke Furniture House** — Next.js 15 (App Router) e-commerce site + CRM for a handcrafted furniture business in Rawalpindi, Pakistan.
- Owner files: `documents/brand-guidelines.md` is the **branding source of truth**. `assets/` holds logo SVGs/PNGs, favicons, and fonts. Do not modify those.
- `.env` holds `PEXELS_API` and `MONGODB_URI`. Never commit real secrets; `.env.example` documents the shape.

## Stack

- Next.js 15 App Router, React 19, TypeScript (strict), Tailwind CSS v4 (CSS-first config in `src/app/globals.css`).
- MongoDB native driver (no Mongoose) — one shared client in `src/lib/mongo.ts`.
- Auth: signed HTTP-only cookie sessions (`src/lib/auth.ts`), credentials in `CRM_USERS` env var (`name:email:password` comma-separated).
- All design tokens (colors, fonts, radii, shadows) come from the brand guidelines §11 — already mirrored in `globals.css` and `tailwind` theme block.

## Commands

- `npm run dev` — start dev server on :3000
- `npm run build && npm start` — production
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run seed` — seeds MongoDB from `data/catalog.json` (run once after `init-db`)
- `npm run init-db` — creates indexes + CRM admin user
- Media migration: `curl -s http://localhost:3000/api/media/migrate | head -c 2000`

## Conventions

- Server Components by default; add `"use client"` only where interactivity is needed (cart context, filters, forms, media players).
- All DB access goes through `src/lib/mongo.ts` (`getCollection`, `getDB`) — never open clients elsewhere.
- Collections: `products`, `categories`, `orders`, `settings` (single doc `_id: "site"`), `crm_media` (background media), `crm_users`, `reviews`, `sessions`, `newsletter_subscribers`.
- Money is stored as **whole PKR integers** (no floats).
- Product variants: `[{ name: "Finish", options: ["Walnut", "Teak"] }]` — cart items embed the chosen options.
- Product `slug` is the public identifier in URLs; `_id` only inside the CRM.
- Order flow = WhatsApp checkout only (no online payment). Order numbers are human-readable `CRM-XXXXX` for phone reference.
- Uploads: POST base64 `dataUrl` to `/api/admin/media` → saved under `public/uploads/` (gitignored).
- CRM pages live at `/admin/*`, gated by `src/middleware.ts` (cookie session check) — non-admins bounce to `/admin/login`.

## Commit style

Short imperative subject lines, one logical step per commit ("Add product detail page"). Commit after each completed feature chunk — never one giant monolith. When asked to commit, end messages with the Codebuff footer per user preference.

## Never

- Never commit `.env`, node_modules, `.next`, or `public/uploads/`.
- Never run `git push` unless the user explicitly asks.
- Never add online payment gateways — WhatsApp checkout is the only conversion path by business decision.
- Never hardcode the WhatsApp number in components — always read from settings (`SettingsDoc`).
- Never modify `assets/` or `documents/` brand files.
