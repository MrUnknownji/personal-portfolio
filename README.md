# Sandeep Kumar Portfolio

A production-focused personal portfolio built with Next.js App Router,
TypeScript, Tailwind CSS, GSAP, Three.js, and MongoDB-backed contact handling.

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
- Real contact API route with server-side validation, basic spam honeypot,
  rate limiting, MongoDB persistence, and user-facing loading/error states.
- Three.js/GSAP assistant bot with local navigation commands, project actions,
  contextual right-click summaries, and optional Gemini fallback.
- Social stats API routes with graceful fallback behavior when external tokens
  are not configured.
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
  api/contact/route.ts       MongoDB-backed contact submissions
  api/social/*/route.ts      Optional social stat endpoints with fallbacks
  actions/chat.ts            Krypton local/Gemini response action
  my-projects/page.tsx       Curated project gallery

components/
  Bot/                       Three.js assistant scene, chat UI, interactions
  ProjectModal*              Gallery, tech stack, expandable case-study notes
  ContactSectionComponents/  Contact form and contact information

data/
  data.tsx                   Skills, selected projects, archive data

lib/
  mongodb.ts                 Cached MongoDB client
```

## Environment

Create `.env.local` for local development. The contact form needs MongoDB to
store submissions.

```bash
MONGO_DB_URI=
MONGO_DB_NAME=portfolio

GITHUB_TOKEN=
TWITTER_BEARER_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000

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
```

## Contact Flow

1. The client form validates name, email, category, subject, and message.
2. `/api/contact` repeats validation on the server.
3. A hidden honeypot field silently drops obvious bot submissions.
4. A simple per-IP/email rate limit blocks repeated abuse.
5. Valid messages are stored in the `contact_messages` MongoDB collection with
   status, user-agent, hashed IP, and timestamps.

Email notifications are not bundled yet because no email provider credential is
configured. The stored messages are ready for a later Resend, EmailJS, or
admin-dashboard integration.

## Deployment Notes

- Deploy on Vercel or another Node-capable Next.js host.
- Configure `MONGO_DB_URI` in the production environment.
- Add `NEXT_PUBLIC_SITE_URL` so metadata resolves with the production origin.
- Add `GEMINI_API_KEY` only if Krypton should use the remote Gemini fallback.

## Known Limitations

- Contact messages are persisted, but there is no admin inbox UI yet.
- Social routes rely on optional tokens and return fallback data when missing.
- Case-study notes are concise in-modal summaries, not separate long-form pages.

## Roadmap

- Add email notifications for new contact submissions.
- Add an authenticated admin view for MongoDB contact messages.
- Add Lighthouse/accessibility evidence to the README after production audits.
- Split more of the bot command and navigation logic into dedicated hooks.
