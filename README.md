# Kitabi

Your reading life, organized. A Next.js book app, fully localized in English and
Azerbaijani.

> **🚧 Early development.** This is a learning-in-public project and it's being built
> from the ground up. In place today: the design system, layout and navigation, the full
> internationalization setup across `en` / `az`, and authentication in progress. The book
> features themselves aren't built yet — `/my-books` is still a placeholder. Structure and
> APIs will change.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **next-intl 4** for internationalization — `en` / `az`
- **Supabase** — Postgres, auth (email + Google), file storage
- **Zod 4** for input validation in Server Actions
- **Tailwind CSS 4** with shadcn/ui and Base UI primitives
- **Fraunces** via `next/font`

## Architecture decisions

Why the project is built this way, not how to run it. Full walkthrough of the i18n
setup with diagrams: [docs/next-intl.md](docs/next-intl.md).

### `next/root-params` instead of `setRequestLocale`

next-intl 4.13 deprecates `setRequestLocale`, which had to be called by hand at the top
of every layout and page — miss one and static rendering silently breaks. Root params
(Next 16.3) let `i18n/request.ts` read the `[locale]` segment directly, so pages take no
`params` prop and there is no setter to forget. All locale routes still prerender as
static HTML.

### `localePrefix: "as-needed"`

The default locale serves clean URLs (`/my-books`); every other locale is always
prefixed (`/az/my-books`). It's enforced both directions — a redundant `/en/my-books`
redirects back to `/my-books` — so every page has exactly one canonical URL per
language.

The alternative, `always`, is more uniform and doesn't privilege one language, at the
cost of a redirect on `/` and a prefix on the primary market's URLs. Chose the clean
URL, accepting that changing `defaultLocale` later would move which URLs are canonical.

### Locale-free URLs and message keys in `lib/constants.ts`

Nav items store `url: "/my-books"` and `key: "myBooks"` — never a prefixed URL, never
display text. `Link` adds the prefix on the way out and `usePathname` strips it on the
way back (both from `@/i18n/navigation`), so the active-link comparison holds in every
language. Adding a language touches no component code.

### Pages call `useTranslations`, not `getTranslations`

Pages stay synchronous, so a page can gain `"use client"` later without rewriting its
translation calls — `useTranslations` works on both sides of the boundary.
`getTranslations` is reserved for where hooks are illegal, which here is only
`generateMetadata`.

### One proxy, two jobs

`proxy.ts` composes next-intl and Supabase into a single response: next-intl decides the
rewrite or redirect, then `updateSession` writes the refreshed auth cookies onto *that*
response. Building a fresh `NextResponse.next()` — as Supabase's standalone example does —
would discard the locale decision.

Session refresh has to live here because Server Components can't write cookies, and a
plain page load involves nothing else.

### No form or state library

Server Actions plus `useActionState` cover submission, pending state, and errors, and the
forms work before JavaScript loads. Zod validates inside the action and returns *message
keys*, not text, so errors render translated like everything else. Server data lives in
Server Components, so there's no client cache to manage.

### Open Library is the only API we store from

Google's API terms prohibit building databases from their content, so book records come
from Open Library. Search hits the API live; a book is copied into our own table only when
someone shelves it. Azerbaijani coverage is poor in every public API, so the catalog is
designed to grow from real use rather than from a feed.

## Project structure

```
app/[locale]/        every page lives inside the locale segment
i18n/                routing config, request config, navigation helpers
messages/            en.json · az.json
components/layout/   logo, nav links, mobile nav
components/ui/       shadcn/ui primitives
lib/actions/         Server Actions
lib/validation/      Zod schemas
lib/supabase/        browser + server clients, proxy session helper
proxy.ts             locale negotiation + session refresh
```

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase project values
npm run dev
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Open [http://localhost:3000](http://localhost:3000). You'll be served `/` in English, or
redirected to `/az` if your browser prefers Azerbaijani.

Pages live under `app/[locale]/` — the home page is `app/[locale]/page.tsx`. Text comes
from `messages/`, never from the component itself.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build — prerenders every route in every locale |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
