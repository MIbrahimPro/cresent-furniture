# Crescent — Bespoke Furniture House

E-commerce website + CRM for **Crescent**, a bespoke handcrafted furniture house in Rawalpindi, Pakistan. Every piece is made to order — so "checkout" means a WhatsApp conversation with the workshop, not a payment gateway.

![Crescent](assets/png/crescent-logo-maroon-2000.png)

## Features

### Storefront
- **Cinematic hero** — full-screen background video with maroon dark overlay and display heading
- **Full catalog** — category pages, search, filter by price/variant/availability, sorting
- **Product pages** — image galleries, variant selection (finish, size, fabric…), quantity
- **Cart** — persistent, variant-aware
- **WhatsApp checkout** — one tap opens WhatsApp with the full order pre-filled (products, variants, quantities, total) sent to the workshop's number
- **Reviews** — verified buyers can rate products after an order is marked completed
- **Business info** — address, phone, hours in footer and on a dedicated contact page

### CRM (`/admin`)
- Dashboard with revenue + order stats
- **Products** — full CRUD, variant builder, featured flags, inventory
- **Categories** — CRUD with slugs and ordering
- **Orders** — pipeline (new → confirmed → in production → ready → delivered), WhatsApp deep links per customer
- **Offers** — promotional banners, activatable/instantly applied storewide
- **Custom pages** — CMS-editable pages like the Offers/Deals page (template components are code-configured, content is CRM-configured)
- **Hero background media** — upload custom videos (looping, sequenced playback) or fetch samples from the Pexels API
- **Site settings** — WhatsApp number, business info, shipping note
- **Newsletter inbox**

## Tech Stack

- **Next.js 15** (App Router, RSC) + React 19 + TypeScript
- **Tailwind CSS v4** with the Crescent design tokens from `documents/brand-guidelines.md`
- **MongoDB** (native driver) — products, categories, orders, CRM users, settings, reviews, media
- **Cookie-based auth** for the CRM (HTTP-only, signed)
- **Pexels API** for hero video samples

## Getting Started

```bash
npm install
cp .env.example .env        # fill in MONGODB_URI + PEXELS_API
npm run init-db             # creates indexes + first CRM admin
npm run seed                # loads the catalog into MongoDB
npm run dev                 # http://localhost:3000
```

CRM credentials come from the `CRM_USERS` env var: `Name:email:password` comma-separated. Log in at `/admin/login`.

## Scripts

| Script | What it does |
|---|---|
| `dev` | Next dev server on :3000 |
| `build` / `start` | Production build & serve |
| `seed` | Bulk-loads `data/catalog.json` into MongoDB |
| `init-db` | Indexes + admin user bootstrap |
| `typecheck` | `tsc --noEmit` |
| `lint` | ESLint |

## Business Info

**Crescent Bespoke Furniture House**
M36M+3QH, Murree Rd, Gulistan-e-Jinnah Colony Faizabad, Rawalpindi
Phone: 0311 8550000 · https://www.crescentfurnitures.com/

## Repository Layout

```
src/app/          Routes: storefront pages + /admin CRM
src/components/   Shared UI (Header, Footer, ProductCard, CartDrawer, WhatsAppFab…)
src/lib/          mongo client, auth, settings, cart helpers
scripts/          seed + init-db
data/             Seed catalog JSON
assets/           Brand-supplied logos, fonts, favicons (do not edit)
documents/        Brand guidelines (source of truth for design)
```

See `AGENTS.md` for coding conventions and CRM data-model notes.
