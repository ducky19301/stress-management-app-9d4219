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

## Milestone 2 — Accounts and profiles

- Netlify Identity sign-up and log-in (email and Google). Protect the `/today`, `/companion`, `/circles`, `/activities` and `/resources` routes.
- Profile table in Netlify Database: anonymous handle, focus areas from onboarding, companion preferences, time zone.
- A generator for anonymous handles, and settings to change them.

## Milestone 3 — Check-ins and journal persistence

- Tables for `mood_checkins` and `journal_entries`, private to each user, through TanStack Start server functions.
- Real weekly mood strip, streaks and the "your week" stats.
- Data export and delete-my-data controls.

## Milestone 4 — Live peer circles

- Tables for `circles`, `circle_members`, `messages`, `reactions` and `reports`.
- Real-time delivery over a WebSocket or streaming endpoint, with polling as a fallback.
- Moderation: peer guide roles (Identity roles), a report queue, automatic safety screening of messages with the AI Gateway, and slow mode.
- Buddy matching on focus area and time zone, with request and accept flows and 1:1 chat.

## Milestone 5 — AI companion (AI Gateway)

- Streaming chat endpoint that uses Netlify AI Gateway, with a system prompt for each approach and tone.
- "Auto" mode classifies the concern and picks the best-fit approach, then explains the choice to the user.
- Conversation memory saved in the database (opt-in, respecting the toggle).
- Safety layer: detect crisis language, show the crisis sheet, and never claim to be a licensed clinician.
- **Mirror mode**: private selfie upload to Netlify Blobs, an optional stylized "kinder you" portrait made by an image model, and compassion-focused prompts that speak in the user's own voice. Strict privacy: users can delete it in one tap.
- Later: voice conversations.

## Milestone 6 — Activities and resources, live

- Activities and books move into the database with an admin editor.
- "Start now" timers, completion tracking, and invites to a partner or circle members.
- Local free events (park yoga, support groups) by location.
- Therapist directory with sliding-scale filters and consult requests (for example through Netlify Forms).

## Milestone 7 — Polish and care

- Gentle reminders and notifications, and a dark "night mode" for 3am use.
- Accessibility audit, localization, and an installable PWA.
- Privacy policy, terms, and a clinical-advisor review of the companion prompts.
