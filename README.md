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

The full product surface is clickable: the landing page, sign-up, Today, Companion, Circles, Activities and Resources. These screens use sample data from `src/lib/fixtures.ts`. Accounts, saved data, live chat and the real AI companion are planned in [PLAN.md](PLAN.md).
