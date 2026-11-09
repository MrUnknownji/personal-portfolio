# Sandeep Kumar — Portfolio

Personal portfolio of Sandeep Kumar, a full-stack developer building web, mobile,
and real-time products, and the founder of
[FrameRelay Studio](https://framerelaystudio.com/). Built with Next.js (App Router), React 19, TypeScript,
and plain CSS, with a MongoDB-backed contact form and a small portfolio assistant.

- **Case studies, not screenshots.** Each selected project has its own route with
  the problem, the constraint, the decision, the trade-offs, and countable facts
  taken from its repository (API routes, tests, migrations).
- **Facts are checked.** Every stack and number on the site was verified against
  the project's source, and each case study links the files to read first.
  `data/profile.ts` is the single source for experience, skills, and availability;
  the home page, the 1-page profile, the résumé PDF, and the assistant all read
  from it.
- **A lab with a real idea in it.** "Two bids, one price" simulates two bidders on
  different network latencies, with timeouts and retries, a lossy network, and
  three server rules. It shows a lost update under last-write-wins, a bidder
  outbidding itself after a lost reply, and how request IDs make retries safe.
  The simulation is a pure, unit-tested module (`components/lab/bidRace.ts`).
- **Measured performance.** Lighthouse budgets run in CI; see
  [docs/performance](docs/performance) for the audits and what changed.

![BidStrike project screenshot](https://res.cloudinary.com/dfwgprzxo/image/upload/v1769855178/Bid-Strike-Light-Home.png)

## Selected projects

| Project            | What it is                                                                | Stack                                   |
| ------------------ | ------------------------------------------------------------------------- | --------------------------------------- |
| BidStrike          | Real-time auctions with server-side bid validation and proxy auto-bidding | Next.js, Socket.io, MongoDB, Stripe     |
| FrameRelay Studio  | My motion studio: WebGL2 site with quality tiers, films in Remotion       | Astro, Three.js, Remotion, Cloudflare   |
| Mirror Wallpapers  | Paired wallpapers: Expo app, Next.js admin, FastAPI AI (private repo)     | React Native, Supabase, FastAPI, Gemini |
| OmniMart           | Store with cart, checkout, support, and admin                             | Next.js, MongoDB, Gemini, Cloudinary    |
| YouTube Content OS | Creator workspace with AI and storage fallbacks                           | React, Vite, Express, MongoDB           |
| AuraEdit           | Browser-only image editor with batch export                               | Next.js, Canvas API, JSZip              |
| AudioVibes         | Local music player                                                        | React Native, Expo, Reanimated          |
| This portfolio     | Verified facts, measured performance, and a tested lab                    | Next.js, Playwright, Vitest, Lighthouse |

## Structure

```text
app/
  page.tsx, home.tsx          Home: hero, work, lab, about, contact
  my-projects/[id]/           Statically generated case-study routes
  quick/                      1-page profile (also the résumé PDF source)
  api/contact/route.ts        Validated, rate-limited contact submissions
  actions/chat.ts             Assistant: local answers first, optional Gemini
  globals.css                 Tailwind entry, tokens, base styles, rendering hints
  styles/                     One stylesheet per feature, imported in cascade order

components/
  InteractiveHero, ProjectShowcase, CreativeLab, Experience, HowIBuild, ...
  lab/                        Two-bids simulation (pure logic + view)
  Bot/                        Assistant launcher, chat, and commands

data/
  profile.ts                  Experience, skills, availability, résumé path
  projects.ts                 Selected projects, verified stacks and facts
  projectStories.ts           Case-study narrative and curated screens
  archive.ts                  Earlier practice projects (assistant only)

lib/
  contactValidation.ts        Shared client/server validation
  server/rateLimit.ts         Atomic MongoDB-backed request quotas

scripts/
  build-resume.mjs            Prints /quick to public/sandeep-kumar-resume.pdf
  run-lighthouse.mjs          Lighthouse budgets (median of three runs)
```

## Development

Use Node.js 24.19.0 (`.nvmrc`) and pnpm 11.22.0.

```bash
pnpm dev            # local development
pnpm test:all       # format check, lint, types, unit, build, e2e
pnpm lighthouse     # performance and accessibility budgets
pnpm resume         # regenerate the résumé PDF after editing data/profile.ts (run after pnpm build)
```

Set `PLAYWRIGHT_CHROME_PATH` or `CHROME_PATH` to use a system Chrome instead of
Playwright's bundled browser.

## Environment

Create `.env.local`. The contact form needs MongoDB; the assistant works without
an API key and uses Gemini only when one is configured.

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

## Contact flow

1. The form validates name, email, category, subject, and message on the client.
2. `/api/contact` repeats validation on the server and caps the body at 32 KB.
3. A hidden honeypot field drops obvious bot submissions.
4. Atomic per-IP and per-email limits in MongoDB block repeated abuse across instances.
5. Messages are stored with a hashed IP and an automatic deletion date.

## Quality gates

Every pull request runs dependency audit, Prettier, ESLint, strict TypeScript,
Vitest unit tests, a production build, Playwright flows on desktop and mobile
(with axe accessibility checks), and Lighthouse budgets. Security headers,
including a Content Security Policy, are set in `next.config.mjs`.

## Deployment

- Deploy on Vercel or any Node-capable Next.js host.
- Configure `MONGO_DB_URI`, a strong `RATE_LIMIT_HASH_SECRET`, and
  `NEXT_PUBLIC_SITE_URL`, then run `pnpm db:indexes` once.
- Optionally add `GEMINI_AI_STUDIO_API_KEY` or `GEMINI_API_KEY` for the assistant.
