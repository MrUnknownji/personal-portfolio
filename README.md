# Sandeep Kumar — Portfolio

Personal portfolio of Sandeep Kumar, a full-stack developer building web, mobile,
and real-time products, and the founder of
[FrameRelay Studio](https://framerelaystudio.com/). Built with Next.js (App Router), React 19, TypeScript,
and plain CSS, with a MongoDB-backed contact form. The look is "Lumen Draft": pages drawn like
instrument sheets, torn-paper stationery, and a letter that opens on scroll.

- **Case studies, not screenshots.** Each selected project has its own route with
  the problem, the constraint, the decision, the trade-offs, and countable facts
  taken from its repository (API routes, tests, migrations).
- **Facts are checked.** Every stack and number on the site was verified against
  the project's source, and each case study links the files to read first.
  `data/profile.ts` is the single source for experience, skills, and availability;
  the home page, the 1-page profile, and the résumé PDF all read from it.
- **A lab with a real idea in it.** "Two bids, one price" simulates two bidders on
  different network latencies, with timeouts and retries, a lossy network, and
  three server rules. It shows a lost update under last-write-wins, a bidder
  outbidding itself after a lost reply, and how request IDs make retries safe.
  The simulation is a pure, unit-tested module (`components/lab/bidRace.ts`).
- **Make it yours.** The tweak panel (lower right, or Shift+T) exposes every token the design is
  built on (colour, type, layout, surfaces, motion), saves a look in the visitor's browser, and
  has a few toys that act on the whole site: Gravity (each section falls to its own floor as you
  scroll to it), Zero-G (everything floats and still works), Snap, Burn it, Earthquake, and Party
  (a neon-city club whose lights follow the music section by section, on the music's own
  clock; four tracks to switch between, three of them made for it with Google's Lyria 3.5, each
  streamed only after the click). The panel and toys load only when opened, and each toy puts
  the page back exactly.
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
  layout.tsx                  Shell: fonts, metadata, structured data, header, footer
  page.tsx                    Home: hero, work, lab, about, process, letter, contact
  my-projects/[id]/           Statically generated case studies (with their own OG images)
  quick/                      1-page profile (also the résumé PDF source)
  motion/                     Motion and visual work
  api/contact/route.ts        Validated, same-origin, rate-limited contact submissions
  lumen.css                   The design system, in cascade layers (tweaks last)
  fonts/                      Self-hosted, subset variable fonts (see its README)

components/
  lumen/                      Site components: sheets, letter, reply slip, lab, panel
  lumen/tweaks.ts             Tweak schema, the site's default look, sanitiser
  lumen/play.ts               The panel's toys, loaded on first use
  lumen/party.ts              Party: club lights, the city, the crowd, the beat clock
  lumen/partyTracks.ts        Party's tracks and the scene map the lights follow for each
  lab/bidRace.ts              Two-bids simulation (pure, unit-tested logic)

data/
  profile.ts                  Experience, skills, availability, résumé path
  projects.ts                 Selected projects, verified stacks and facts
  projectStories.ts           Case-study narrative and curated screens

lib/
  contactValidation.ts        Shared client/server validation
  server/rateLimit.ts         Atomic MongoDB-backed request quotas
  siteUrl.ts                  Canonical origin for metadata, sitemap and robots

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

Create `.env.local`. The contact form needs MongoDB.

```bash
MONGO_DB_URI=
MONGO_DB_NAME=portfolio
RATE_LIMIT_HASH_SECRET=
CONTACT_RETENTION_DAYS=365

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Contact flow

1. The form validates name, email, category, subject, and message on the client.
2. `/api/contact` refuses cross-site posts and non-JSON bodies, repeats validation on the
   server, and caps the body at 32 KB.
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
- Old `/review/*` addresses redirect permanently to the same page at the root.
