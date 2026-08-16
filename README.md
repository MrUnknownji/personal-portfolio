# Sandeep Kumar Portfolio

A production-focused personal portfolio built with Next.js App Router,
TypeScript, Tailwind CSS, and MongoDB-backed contact handling.

The site is designed to present a small set of selected projects as real product
work, not just visual demos. It includes animated landing sections, a searchable
project gallery, rich project modals, and Krypton, an interactive portfolio
assistant that can answer local portfolio questions or use Gemini when
configured.

## Preview

![BidStrike project screenshot](https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855178/Bid-Strike-Light-Home.png)
![AuraEdit project screenshot](https://res.cloudinary.com/dfwgprzxo/image/upload/v1777116565/AuraEdit-ImageUpload-Web-Light.png)

## Features

- Curated selected-work page with search, category filters, project modals,
  screenshot galleries, source links, live demo links, and case-study notes.
- Real contact API route with shared validation, a spam honeypot, durable
  IP/email rate limits, retention controls, and user-facing error states.
- Lightweight image-based assistant bot with local navigation commands, project
  actions, contextual right-click summaries, and optional Gemini fallback.
- Server-rendered social profile links that do not depend on client JavaScript.
- Responsive App Router layout with animated hero, about, skills, contact, and
  footer sections.

## Selected Projects

- **BidStrike**: real-time AI-powered auction platform using Next.js, Pusher,
  Prisma, and PostgreSQL.
- **YouTube Content OS**: AI workspace for creator scripts, metadata,
  thumbnails, and exports.
- **AuraEdit**: local-first browser image editor with batch processing and
  Canvas-based transformations.
- **AudioVibes**: React Native music player with local playback, Material You
  styling, and Reanimated interactions.
- **OmniMart**: AI-enhanced e-commerce product surface with storefront,
  checkout, support, and admin flows.

Older clone/layout projects remain in the data as archive material, but the main
portfolio experience is intentionally limited to stronger selected work.

## Architecture

```text
app/
  api/contact/route.ts       Validated, rate-limited contact submissions
  api/projects/[id]/route.ts On-demand selected project details
  actions/chat.ts            Krypton local/Gemini response action
  my-projects/[id]/          Indexable project case-study pages

components/
  Bot/                       Lightweight assistant visual, chat UI, commands
  ProjectModal*              Gallery, tech stack, expandable case-study notes
  ContactSectionComponents/  Contact form and contact information

data/
  projects.ts               Selected projects and archive data
  site.ts                   Shared identity/contact configuration

lib/
  mongodb.ts                 Recoverable cached MongoDB client
  server/rateLimit.ts        Atomic MongoDB-backed request quotas
```

## Environment

Create `.env.local` for local development. The contact form needs MongoDB to
store submissions.

```bash
MONGO_DB_URI=
MONGO_DB_NAME=portfolio
RATE_LIMIT_HASH_SECRET=
CONTACT_RETENTION_DAYS=365

NEXT_PUBLIC_SITE_URL=http://localhost:3000

GEMINI_AI_STUDIO_API_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.1-flash-lite-preview
```

## Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm start
pnpm test
pnpm test:e2e
pnpm audit:prod
pnpm db:indexes
```

## Contact Flow

1. The client form validates name, email, category, subject, and message.
2. `/api/contact` repeats validation on the server.
3. A hidden honeypot field silently drops obvious bot submissions.
4. Independent atomic per-IP and per-email limits block repeated abuse across instances.
5. Valid messages are stored in the `contact_messages` MongoDB collection with
   status, user-agent, hashed IP, and timestamps.

Email notifications are not bundled yet because no email provider credential is
configured. The stored messages are ready for a later Resend, EmailJS, or
admin-dashboard integration.

## Deployment Notes

- Deploy on Vercel or another Node-capable Next.js host.
- Configure `MONGO_DB_URI` in the production environment.
- Configure a strong, independent `RATE_LIMIT_HASH_SECRET` and run `pnpm db:indexes` during deployment.
- Add `NEXT_PUBLIC_SITE_URL` so metadata resolves with the production origin.
- Add `GEMINI_AI_STUDIO_API_KEY` for Krypton's preferred free Gemini fallback.
- Add `GEMINI_API_KEY` as the paid fallback if the AI Studio key is unavailable
  or over quota.

## Quality gates

Pull requests run dependency auditing, lint, strict type checking, unit tests,
production build, Playwright desktop/mobile flows, axe accessibility checks, and
Lighthouse budgets. Project details also have server-rendered, shareable routes.
