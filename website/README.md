# Crescent website

Next.js 16 App Router app for the Crescent storefront + CRM. See the repo-root `README.md` for the full feature map and `AGENTS.md` for coding conventions.

## Quick start

From the repo root, source the group `.env` (PEXELS_API, MONGODB_URI), then:

```bash
npm install
npm run init-db          # indexes + settings + first CRM admin
npm run seed             # catalog + Pexels imagery + hero videos
npm run seed-offer-page  # draft "Offer Deals" page
npm run dev              # http://localhost:3000 (set PORT to pin a port)
```

The database defaults to `crescent` in code; set `MONGODB_DB` to override. CRM defaults: `owner@crescent.local` / `crescent-admin` (set `CRM_ADMIN_EMAIL` / `CRM_ADMIN_PASSWORD` before `init-db` to change).

## Scripts

| Script | Purpose |
|---|---|
| `dev` / `build` / `start` | Dev server / production build / serve |
| `typecheck` | `tsc --noEmit` |
| `lint` | ESLint |
| `init-db` | Indexes, settings doc, admin user (idempotent) |
| `seed` | Catalog from `data/`, Pexels image resolution, hero videos (idempotent) |
| `seed-offer-page` | Upsert the unpublished Offer Deals draft page |

## Layout

- `src/app/(storefront)/` — public site; `src/app/admin/` — CRM; `src/app/(auth)/admin/login` — CRM login
- `src/app/api/` — storefront APIs; `src/app/api/admin/` — session-guarded CRM APIs
- `src/app/uploads/[...path]/route.ts` — serves runtime-uploaded media from disk
- `src/components/`, `src/components/admin/` — UI
- `src/lib/` — mongo, session/auth, settings, catalog queries, pexels, format, domain types
- `data/` — seed catalog, Pexels query map + cache
