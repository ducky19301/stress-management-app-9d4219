# Softground roadmap

Softground is a calm, free-first support space for stress in relationships, work and personal life. It brings together peer circles, free activities, curated resources and an always-free AI companion.

The product surface comes first so the experience can be seen and refined, and each later milestone swaps sample data for real systems. All sample content lives in `src/lib/fixtures.ts`.

## Milestone 1 — Product surface ✅

- Landing page with the brand, the four "doors" (Companion, Circles, Activities, Resources), Mirror mode, and trust and safety messaging.
- Sign-up and log-in screen with a "what's weighing on you" onboarding step.
- **Today**: mood check-in, 60-second breathing orb, suggestions that change with mood, private journal prompt, weekly mood strip, upcoming live circles.
- **Companion**: chat with typing state and starter prompts, approach picker (Auto, CBT, DBT, ACT, EFT, Compassion-focused, Solution-focused), tone, appearance (orb, Mirror mode with a local selfie preview, custom guide), and a memory toggle.
- **Circles**: searchable and filterable group circles, a chat room with "heard you" reactions and reporting, and buddy matching.
- **Activities**: filters for type, solo or together, and 10 minutes or less, plus a detail dialog with steps and an invite option.
- **Resources**: a free AI therapy card, a therapist search, free and low-cost therapy options, books by topic, and crisis lines.
- A "Get help now" crisis sheet on every screen.

## Milestone 2 — Accounts and profiles (local profile ✅ · real accounts still need Netlify Identity)

- Local profile (name, anonymous handle, focus areas, time zone) stored in this browser's localStorage — sign-up saves it, every screen reads it, and Settings edits it. See `src/lib/store.ts`.
- Netlify Identity sign-up and log-in (email and Google). Protect the `/today`, `/companion`, `/circles`, `/activities` and `/resources` routes.
- Profile table in Netlify Database: anonymous handle, focus areas from onboarding, companion preferences, time zone.
- A generator for anonymous handles, and settings to change them.

## Milestone 3 — Check-ins and journal persistence (local ✅ · server tables still need Netlify Database)

- Mood check-ins and journal entries persist in localStorage, private to this browser. The weekly mood strip, streak and "your week" stats are driven by that stored data.
- Data export (JSON download) and delete-my-data controls live in Settings.
- Tables for `mood_checkins` and `journal_entries`, private to each user, through TanStack Start server functions — still needed for sync across devices.

## Milestone 4 — Live peer circles (local posting ✅ · live chat still needs a backend)

- Messages you post in a circle room and "heard you" hugs are saved on this device, so they survive a reload. They are not shared with anyone yet.
- Tables for `circles`, `circle_members`, `messages`, `reactions` and `reports`.
- Real-time delivery over a WebSocket or streaming endpoint, with polling as a fallback.
- Moderation: peer guide roles (Identity roles), a report queue, automatic safety screening of messages with the AI Gateway, and slow mode.
- Buddy matching on focus area and time zone, with request and accept flows and 1:1 chat.

## Milestone 5 — AI companion (canned replies expanded ✅ · real AI still needs the AI Gateway)

- Canned replies now cover four responses per approach, plus short keyword nudges (sleep, anxiety, money, grief) that point to real exercises and circles. Replies can use the user's first name.
- Streaming chat endpoint that uses Netlify AI Gateway, with a system prompt for each approach and tone.
- "Auto" mode classifies the concern and picks the best-fit approach, then explains the choice to the user.
- Conversation memory saved in the database (opt-in, respecting the toggle).
- Safety layer: detect crisis language, show the crisis sheet, and never claim to be a licensed clinician.
- **Mirror mode**: private selfie upload to Netlify Blobs, an optional stylized "kinder you" portrait made by an image model, and compassion-focused prompts that speak in the user's own voice. Strict privacy: users can delete it in one tap.
- Later: voice conversations.

## Milestone 6 — Activities and resources, live (timers & tracking ✅ · live data still needs a backend)

- "Start now" timers (5 / 10 / full length) and completion tracking, stored locally and counted in the weekly stats.
- Activities and books move into the database with an admin editor.
- Local free events (park yoga, support groups) by location.
- Therapist directory with sliding-scale filters and consult requests (for example through Netlify Forms). The current search shows clearly-labelled sample listings.

## Milestone 7 — Polish and care (night mode & PWA ✅ · the rest still open)

- Night mode (dark theme) toggle in the sidebar and mobile header, remembered on this device, applied before first paint.
- Installable PWA: `public/manifest.webmanifest`, theme-color meta and app icons.
- Gentle reminders and notifications.
- Accessibility audit and localization.
- Privacy policy, terms, and a clinical-advisor review of the companion prompts.
