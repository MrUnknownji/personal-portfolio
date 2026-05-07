# Sandeep Kumar Portfolio

A production-focused personal portfolio built with Next.js App Router,
TypeScript, Tailwind CSS, GSAP, and Three.js.

## Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm start
```

## Environment

Optional API integrations use graceful fallbacks when credentials are missing.

```bash
GITHUB_TOKEN=
TWITTER_BEARER_TOKEN=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_ACCESS_TOKEN=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash-lite
```

## Notes

- `/` renders the hero, about, skills, and contact sections.
- `/my-projects` renders the searchable/filterable project gallery.
- Social API routes return cached fallback data when external APIs are not
  configured or are unavailable.
- LinkedIn OAuth is available from `/admin` when credentials and redirect URLs
  are configured.
