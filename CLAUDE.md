# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint (Next.js config)
```

No test suite is configured. There is no TypeScript — all files use `.js` / `.jsx`.

### Database migration (run once)

```bash
npm run migrate
```

Requires `.env.local` with Vercel Postgres credentials. Copy `.env.local.example` and fill in values, or run `vercel env pull .env.local` after connecting Vercel Postgres. The migrate script uses `node --env-file=.env.local` (Node 20+) — no `dotenv` package needed.

## Architecture

This is a **Vietnamese wedding invitation app** built with Next.js 14 App Router. It has two surfaces:

- **Public invitation** (`/`) — guests land here via a personalized URL `/?id=<UUID>`. The page walks through an envelope-opening animation, then shows the invitation card, photo gallery, and a wishes section.
- **Admin dashboard** (`/admin`, `/admin/dashboard`) — password-protected panel to manage guests and edit wedding settings.

### Data layer

**Vercel Postgres** (`@vercel/postgres`) with three tables:

| Table | Purpose |
|---|---|
| `guests` | Guest list; each row holds a `url` = `NEXT_PUBLIC_APP_URL/?id=<UUID>` |
| `wishes` | Messages left by guests |
| `wedding_settings` | Single row (id=1) storing all wedding info as a JSONB blob |

All DB access goes through `lib/db.js` — the only file that imports `@vercel/postgres`. API routes call `lib/db.js`; components never call `lib/db.js` directly.

### State management

`contexts/WeddingContext.jsx` (`WeddingProvider`) fetches settings, guests, and wishes in parallel on mount and exposes them plus mutation functions to the whole tree. Components consume data via `useWedding()`. There is no external state library.

### API routes

| Route | Methods | Notes |
|---|---|---|
| `/api/guests` | GET, POST | POST accepts `{ name, group }` or `{ bulk: true, names: [] }` |
| `/api/guests/[id]` | PUT, DELETE | |
| `/api/wishes` | GET, POST | |
| `/api/settings` | GET, PUT | Reads/writes the JSONB blob |
| `/api/auth` | POST | Checks `ADMIN_PASSWORD` env var; no JWT — admin state lives in `sessionStorage` |

### Frontend flow

`InvitationPage` drives a three-phase state machine (`envelope` → `invitation` → `full`). Guest identity comes from the `?id` query param and is resolved via `getGuestById` from context.

Admin auth is client-side only: `sessionStorage.adminAuth` set on login, checked by `ProtectedRoute`.

### Styling

- Global CSS variables (colors, fonts) in `app/globals.css`; fonts: Dancing Script (script), Cormorant Garamond (serif), Be Vietnam Pro (body)
- Each component has a co-located `.css` file — no CSS modules, no Tailwind
- UI components from Ant Design 6; `AntdRegistry` wraps the tree for SSR compatibility

### Path alias

`@/` maps to the repo root (configured in `jsconfig.json`).

### Image assets

Slide photos live in `public/slide/` (originals) and `public/slide-compressed/`. `next.config.js` allows remote images from `drive.google.com` and `lh3.googleusercontent.com`. `utils/imageUtils.js` converts Google Drive share URLs to direct-image URLs.

### Wedding settings shape

The JSONB blob stored in `wedding_settings` contains: `bride`, `groom`, `ceremony`, `reception` objects, `coverPhotos` array (paths under `/slide/`), and `photoAlbumUrl`. The migration in `scripts/migrate.mjs` seeds the initial values.
