# Simple Logistics Limited — Corporate Website & CMS

A unified, production-grade web platform for **Simple Logistics Limited**, a UK company
operating two divisions under one brand:

1. **Logistics** — driver supply, warehouse staffing, courier crews, managed workforce programmes
2. **Healthcare** — care assistants, support workers, NMC-registered nurses, permanent recruitment

Built with Next.js (App Router, RSC, Server Actions), strict TypeScript, Tailwind CSS +
shadcn/ui, Framer Motion, Supabase (PostgreSQL + Auth + RLS), React Hook Form + Zod, and
TanStack Table.

---

## Architecture

| Layer          | Implementation                                                                 |
| -------------- | ------------------------------------------------------------------------------ |
| Public site    | Server Components reading through a cached query layer (`lib/queries.ts`)      |
| Caching / ISR  | `unstable_cache` + content tags; admin mutations call `revalidateTag`/`Path`   |
| Admin portal   | `/admin` — Supabase Auth, gated by `proxy.ts` **and** re-verified in the layout |
| Mutations      | Server Actions in `lib/actions/*`, validated end-to-end with shared Zod schemas |
| Database       | Supabase Postgres with strict RLS (`supabase/migrations/0001_init.sql`)        |
| SEO            | Per-page metadata + canonical URLs, OG/Twitter cards, JSON-LD (Organization, JobPosting, BlogPosting, FAQPage, BreadcrumbList), `sitemap.xml`, `robots.txt` |

### Route map

```
/                                  Homepage (hero, division split, counters, testimonials, latest)
/services/logistics                Division hub          ─┐ statically generated,
/services/healthcare               Division hub           │ revalidated on publish
/services/[division]/[slug]        Service detail        ─┘
/jobs                              Job board (indexable search: q, location, type, industry)
/jobs/[slug]                       Job detail + admin-configured application flow
/blog                              Insights index
/blog/[slug]                       Post + related-article algorithm (shared tags × 2 + category)
/workforce-request                 Multi-step B2B workforce request (3 steps → Supabase)
/contact                           Contact system → lead tracking table
/admin                             Dashboard (auth required)
/admin/services/{division}         CRUD  ·  /admin/jobs  ·  /admin/posts  ·  /admin/testimonials
/admin/inquiries                   Lead queue  ·  /admin/workforce
/admin/settings                    Global settings engine (single-row table, id = 1)
```

### Row Level Security

- **anon** — `SELECT` on published content + settings; `INSERT`-only on the two lead tables
- **authenticated** — full CMS access; only admins can read leads

---

## Getting started

### 1. Install & configure

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
```

### 2. Provision the database

Run in the Supabase SQL editor (or `supabase db push` with the CLI):

1. `supabase/migrations/0001_init.sql` — schema, enums, triggers, RLS policies
2. `supabase/seed.sql` — settings row, 8 services, 6 jobs, 4 posts, 4 testimonials

### 3. Create the admin user

Supabase Dashboard → **Authentication → Users → Add user** (email + password,
auto-confirm). Any authenticated user is an admin — the portal is invite-only by design;
keep sign-ups disabled in Supabase Auth settings.

### 4. Run

```bash
npm run dev      # http://localhost:3000  ·  admin at /admin
npm run build    # production build
```

> The public site builds and renders with graceful fallbacks even before Supabase is
> configured; the admin portal returns 503 until env vars are present.

---

## Editorial design system

- **Type**: Fraunces (display serif) / Archivo (body) / IBM Plex Mono (labels, references)
- **Palette**: warm paper ground, deep ink navy, **freight amber** (logistics) and
  **care teal** (healthcare) as division accents — defined as CSS variables in
  `app/globals.css`
- **Signature moves**: numbered section kickers, asymmetric offset grids, corner-accent
  panels, the hero role ticker, count-up stat rails

## Key conventions

- No business detail is hardcoded: everything display-critical flows from the
  `site_settings` row merged over `lib/settings.ts` defaults.
- Job applications are email-based by design (no uploads): per-job email/instructions
  override the global defaults from Settings.
- CMS rich text is authored in Tiptap (admin-only, behind auth) and rendered through the
  `.rich-text` editorial styles.
