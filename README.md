# Softground

Softground is a softer place to land when love, work or life gets heavy. It brings together:

- **An always-free AI companion.** You choose the therapy approach (CBT, DBT, ACT, EFT, compassion-focused, solution-focused) or let it pick, set the tone, and choose how it looks, including **Mirror mode**, where the companion takes on your own face to support self-esteem.
- **Peer circles.** Moderated, anonymous group chats and 1:1 buddies for breakups, burnout, family, grief and more.
- **Activities.** Mostly free walks, art, breathwork, movement and couples check-ins, done solo or with others.
- **Resources.** Hand-picked books, affordable in-person therapy, and crisis lines.

## Tech

- TanStack Start (React 19, TanStack Router) on Netlify
- Tailwind CSS 4 and shadcn/ui (Radix)
- Fraunces and Instrument Sans fonts; illustrations generated with Netlify AI Gateway and served through Netlify Image CDN

## Run locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

## Status

The full product surface is clickable: the landing page, sign-up, Today, Companion, Circles, Activities, Resources and Settings. These screens use sample content from `src/lib/fixtures.ts`, plus a local-first layer in `src/lib/store.ts`: your profile, mood check-ins, journal entries, completed activities, circle posts and night-mode preference are stored in this browser's localStorage — nothing leaves the device.

Also done, client-side: activity timers with completion tracking, an installable PWA manifest, and night mode. Still genuinely needing backend services (see [PLAN.md](PLAN.md)): Netlify Identity for real accounts and Google sign-in, Netlify Database for synced data and live circles, and the AI Gateway for a real companion. The companion's replies are canned, circle posts are local-only, and the therapist search shows clearly-labelled sample listings.
