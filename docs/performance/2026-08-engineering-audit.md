# Portfolio Engineering and Performance Audit

Date: 2026-08-16  
Scope: current local branch at commit `2c7b66a`, reviewed without modifying application code

## Implementation update

The recommendations in this report were implemented in the working tree on
2026-08-16. The measurements below remain the original baseline; the final
three-run median production mobile verification is:

| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Initial JS | DOM |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Home | 93 | 100 | 100 | 100 | 0.9 s | 2.7 s | 206 ms | 0 | 166.9 KiB | 509 |
| Projects | 96 | 100 | 100 | 100 | 0.8 s | 2.6 s | 96 ms | 0 | 166.3 KiB | 224 |

Compared with the original mobile baseline, home improved from 50 to 93 and
projects from 58 to 96. Home LCP improved from 4.9 s to 2.7 s, home TBT from
2,070 ms to 206 ms, and home DOM size from 887 to 509. Projects TBT improved
from 1,190 ms to 96 ms. Lighthouse results vary with the local runner, so CI
uses three runs and evaluates the median.

Implemented areas include framework/security upgrades, durable abuse limits,
bounded external AI requests, removal of unused public proxy routes, database
index/retention setup, server-visible essential content, removal of GSAP and
the blocking loader, intent-only bot and project detail loading, bounded media
galleries, static social links, accessible dialogs/forms/navigation, reduced
motion, typed shared configuration, static case-study routes and metadata,
unit/route/E2E/axe coverage, dependency automation, and CI performance budgets.

Two production inputs remain deployment-owned rather than code-owned:

- Run `pnpm db:indexes` after configuring MongoDB, and configure a strong
  `RATE_LIMIT_HASH_SECRET`.
- Real-user telemetry was not silently added because it requires an approved
  analytics destination and privacy/retention decision. Lighthouse CI now
  provides synthetic regression protection without collecting visitor data.

## Executive assessment

The portfolio is visually ambitious and already contains several thoughtful optimizations, but it is over-engineered on the client and under-protected on the server. Desktop performance is good; slow-mobile performance is poor. The most important problems are:

1. The installed Next.js version has current high-severity advisories, including advisories relevant to this app's Server Action and image-optimizer usage.
2. The initial loader and hero animations deliberately hide the LCP text, turning a fast network response into a 4.9-second mobile LCP.
3. Mobile devices hydrate and process desktop-only UI, unused scroll-smoothing code, the bot, and many GSAP effects.
4. The AI chat and social-refresh surfaces can be abused to consume third-party API quota.
5. Contact throttling is process-local and therefore ineffective across serverless instances; it also leaks memory in a long-running process.
6. Dialogs, forms, headings, the bot launcher, and the comparison control have substantial keyboard and screen-reader problems.
7. There are no automated tests or CI performance/accessibility budgets.

Recommended order: patch dependencies and public API abuse first, remove LCP visibility gates second, then reduce mobile hydration/animation work, fix modal/form accessibility, and finally simplify architecture.

## Measured baseline

All tests used the production build (`pnpm build`, `next start`). Lighthouse 12.8.2 used its standard mobile throttling unless marked desktop. These results are not directly comparable to `performance_load.md`, whose tests explicitly used no CPU or network throttling.

| Page/profile | Performance | FCP | LCP | TBT | CLS | Main thread | Long tasks |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home, mobile | 50 | 1.1 s | 4.9 s | 2,070 ms | 0.014 | 10.2 s | 20 |
| Projects, mobile | 58 | 1.0 s | 4.4 s | 1,190 ms | 0.003 | 7.9 s | 20 |
| Home, desktop | 92 | 0.4 s | 1.0 s | 170 ms | 0 | 2.3 s | 6 |

Additional evidence:

- Home loads about 232 KiB of compressed JavaScript (714 KiB decoded) during the Lighthouse window.
- Projects loads about 246 KiB compressed (767 KiB decoded).
- The home DOM reaches 887 elements, depth 20, and 60 children under one node.
- The LCP element is the `Sandeep Kumar` heading. About 90% of its measured LCP time is render delay, not download time.
- Mobile main-thread work on home includes about 3.0 s script evaluation and 2.7 s style/layout.
- Lighthouse attributed more than 200 ms of forced reflow to the GSAP-heavy startup path.
- The optional Three.js chunk is correctly deferred, but it is still 519,815 bytes raw / about 131 KiB gzip when activated.
- Opening the Mirror modal fetched all 10 gallery images immediately. OmniMart has 21 gallery images and uses the same rendering strategy.
- The production HTML is about 119 KiB uncompressed on home and 73 KiB on projects.

Verification status:

| Check | Result |
|---|---|
| `pnpm lint` | Pass |
| `pnpm typecheck` | Pass |
| `pnpm build` | Pass |
| Production routes | Home and projects prerender; APIs dynamic |
| Tests | No test files or test script exist |
| Dependency audit | Fail: 39 unique advisories (18 high, 17 moderate, 4 low) in the current installed graph |

The raw audit reported 43 vulnerability paths because local `node_modules` contains a stale, undeclared `next-auth` installation. It is absent from `package.json` and the lockfile importer, so a clean install should remove that duplicate path. It does not remove the direct vulnerabilities in Next.js, PostCSS, Sharp, and Nano ID.

## Priority 0: security and abuse risks

### 1. Upgrade the vulnerable framework/toolchain immediately

Evidence: `package.json` pins Next.js 16.0.10. The current audit reports direct Next.js Server Action, RSC, image optimizer, cache, and denial-of-service advisories; the relevant patched line is at least 16.2.11, while the registry currently reports 16.3.1. PostCSS is 8.5.6 while 8.5.26 is current; Sharp 0.34.5 is affected through Next.js.

Why it matters here: the app uses a Server Action (`app/actions/chat.ts`), remote image optimization, broad `remotePatterns`, and App Router RSC endpoints. Some listed middleware/WebSocket advisories are not reachable because those features are not used, but the Server Action and image-related advisories are directly relevant.

Improve it:

1. Upgrade `next`, `react`, `react-dom`, and `eslint-config-next` together in a focused branch; align exact Next/eslint-config versions.
2. Upgrade direct PostCSS and regenerate the lockfile from a clean install.
3. Re-run lint, typecheck, build, API integration tests, both Lighthouse profiles, and `pnpm audit --prod`.
4. Add an automated dependency audit to CI and renovate/dependabot-style update PRs.
5. Do not use `--force` audit fixes without reviewing framework migrations.

### 2. Protect the AI chat action from cost and resource abuse

Evidence: `app/actions/chat.ts:64-164` accepts any string, has no length limit, durable rate limit, per-user quota, concurrency guard, or request timeout. It can try two Gemini keys sequentially. A stalled upstream fetch can retain a server worker, and anonymous visitors can spend API quota.

Improve it:

- Validate input on the server (for example, 1-500 normalized characters) and reject oversized action bodies at the platform/framework boundary.
- Add a shared Redis/KV-backed IP and session quota, plus a global concurrency cap.
- Add `AbortSignal.timeout(...)` or an `AbortController` around Gemini requests.
- Deduplicate identical configured keys and cap total retry time rather than retrying indefinitely/sequentially.
- Validate the Gemini response shape instead of reading untyped nested properties.
- Prefer the provider's API-key header when supported instead of placing credentials in the URL.
- Record latency, upstream status class, fallback use, and quota rejection without logging prompts or keys.
- Consider a conventional route handler for clearer HTTP limits and observability; a Server Action is not an authorization boundary.

### 3. Remove or secure quota-amplifying social endpoints

Evidence:

- `app/api/social/refresh/route.ts:6-37` exposes an unauthenticated GET endpoint that invokes credentialed third-party APIs.
- `app/api/social/twitter/route.ts:5-20` accepts an arbitrary, unvalidated username.
- The “refresh” endpoint still calls helpers configured with `next: { revalidate: 3600 }`, so its force-refresh claim is misleading.

Improve it:

- Delete `/api/social/refresh` if it is not used. Otherwise make it an authenticated POST-only admin endpoint, disable public caching, add CSRF/origin checks, and explicitly bypass the data cache.
- Do not expose a general username proxy when the UI only needs one account. Hard-code/allow-list the portfolio username.
- If arbitrary lookup is genuinely required, validate the platform handle format, encode the path segment, rate-limit it, and bound upstream time.
- Return generic public errors and keep sanitized diagnostics server-side.

## Priority 0: mobile performance

### 4. Stop hiding the LCP and core content behind JavaScript

Evidence:

- `app/template.tsx:270-273` renders `.page-content` with inline `opacity: 0`; `app/globals.css:220-222` repeats the hidden default.
- The loader enforces at least 520 ms (`app/template.tsx:14-17`, `143-147`) and then animates out.
- `components/HeroSectionComponents/HeroContent.tsx:72-80` renders hero groups at opacity 0.
- `components/HeroSectionComponents/Title.tsx:52-77` animates the H1 in.
- Lighthouse identifies that H1 as LCP and attributes about 4.4 s of one mobile run to render delay.

This also creates a catastrophic no-JavaScript failure mode: the page content remains invisible if hydration or the loader effect fails.

Improve it:

- Render the H1, primary CTA, and main content visible in the server HTML.
- Make the loader non-blocking decoration, remove it on repeat visits, or remove it entirely. Never wait for social stats to reveal content.
- Animate only decorative layers or use transforms that do not change whether the LCP is paintable.
- Do not place inline `opacity: 0` on essential content. If an enhancement class is required, add it only after JavaScript starts and always provide a short fail-safe.
- Use one short entrance animation at most; the page currently stacks loader, content, group, and title animations.

Expected result: this is the highest-leverage LCP fix because the bottleneck is render delay rather than network transfer.

### 5. Do not render desktop-only CodeDisplay on mobile

Evidence: `components/HeroSection.tsx:23-28` hides CodeDisplay with `hidden lg:block`, but React still renders and hydrates the entire component. CodeDisplay is 552 source lines, duplicates two syntax-highlighted panels, registers effects, and adds a large share of the 887-node mobile DOM.

Improve it:

- Put CodeDisplay behind a client media-query boundary and dynamically import it only when `(min-width: 1024px)` matches.
- Do not server-render the hidden desktop decoration on mobile. A small static fallback is enough if layout balance requires one.
- Mark decorative code content `aria-hidden="true"`; it currently adds noisy non-content text to the accessibility tree.
- If retained, convert the control to Pointer Events with pointer capture and a keyboard-operable range/slider semantic.

### 6. Lazy-load desktop-only GSAP plugins and the bot implementation

Evidence:

- `components/SmoothScroller.tsx:4-9` statically imports ScrollSmoother even though lines 19-25 immediately disable it for touch and reduced-motion users.
- `components/LazyBot.tsx:4-10` uses `dynamic(..., { ssr: false })`, but mounts it immediately, so the bot chunk still downloads on every visit. Browser evidence showed the bot chunk on initial home and projects loads.
- Twenty-three source files reference GSAP, and the root layout makes several GSAP dependencies route-wide.

Improve it:

- Dynamically import ScrollSmoother only after the desktop/fine-pointer/reduced-motion checks pass.
- Replace GSAP scrolling in Header/Footer with native `scrollIntoView`/`scrollTo` where possible; dynamically load advanced scrolling only where it changes the experience materially.
- Server-render a lightweight, accessible SVG bot button. Load the full chat/bot state only on click or intentional hover; keep Three.js behind the existing second intent boundary.
- Centralize GSAP plugin registration and consolidate animation timelines.

### 7. Reduce hydration and ScrollTrigger startup work

Evidence:

- 26 of 66 TypeScript source modules are client modules.
- Reusable `ui/Title` creates up to four ScrollTriggers per instance (`components/ui/Title.tsx:34-112`). It is used across the page.
- Multiple components call `ScrollTrigger.refresh()` independently.
- The home page spends about 2.7 s in mobile style/layout and Lighthouse reports forced reflows.

Improve it:

- Keep static section markup as Server Components and isolate small interactive/motion islands.
- Replace most below-fold entrance GSAP with CSS plus one shared IntersectionObserver.
- Use one timeline and one trigger per section instead of separate triggers for title, subtitle, and decoration.
- Batch reads before writes; avoid repeated `getBoundingClientRect`/`offsetHeight` around global refreshes.
- Add `content-visibility: auto` and a sensible intrinsic size to large below-fold sections after testing anchor scrolling.
- Avoid `HyperText` for semantic headings. It mutates text 30 times per second with proportional glyphs, causing layout work and unstable screen-reader text.

### 8. Delay project-detail code until real intent

Evidence: `components/ProjectsPage.tsx:325-358` preloads the complete project dataset and modal shortly after the loader signals ready. Lighthouse sees additional detail/modal chunks during the projects audit, while early browser inspection before the idle callback did not.

Improve it:

- Remove the automatic post-loader preload on slow/mobile devices.
- Preload on pointer hover, focus, or pointer down (already wired on cards), or after LCP using a longer idle window on capable devices.
- Split selected project details from archived data. The current dynamic import loads the 1,017-line `data/data.tsx` module even though the public page contains six projects.
- Reset cached dynamic-import promises after rejection and show a loading/error state instead of rendering `null` during first-open delay.

### 9. Do not mount every gallery image at modal open

Evidence: `MediaGallery.tsx:156-204` renders every gallery item. Opening Mirror fetched every one of its 10 images. Current project gallery sizes range from 8 to 21 images.

Improve it:

- Render only the hero image plus the first 4-6 thumbnails; paginate or add “show more.”
- In full-screen preview, render only the selected image and a small virtualized thumbnail window.
- Add `sizes` to the full-screen `fill` image at `MediaGallery.tsx:258-264`.
- Use `preload="metadata"` and posters for video.
- Measure modal-open transferred bytes and interaction latency in a dedicated performance test.

### 10. Remove permanent layer promotion

Evidence: project cards promote card, image, overlay, and CTA with `will-change`; CodeDisplay and the global background also keep promoted layers. On touch devices those hover layers never need promotion.

Improve it:

- Apply `will-change` immediately before an animation and clear it afterward.
- Restrict hover promotions to `@media (hover: hover) and (pointer: fine)`.
- Remove unused 3D perspective/`transform-style` from the project grid unless a real 3D transform uses it.
- Re-measure raster memory and scroll smoothness on a mid-range Android device.

## High-priority server and data correctness

### 11. Replace the contact form's in-memory rate limiter

Evidence: `app/api/contact/route.ts:26,44-60` uses a module-level `Map`. It resets on cold starts, is not shared across replicas, and never sweeps expired keys. The combined `IP:email` key also lets one IP rotate email addresses indefinitely.

Improve it:

- Use a durable atomic limiter (Redis/KV/database) with independent IP and normalized-email buckets.
- Trust forwarded IP headers only from the hosting platform's documented proxy chain.
- Return `Retry-After` with 429 responses.
- Add a body-size limit, bot challenge for suspicious traffic, and abuse metrics.
- Use HMAC with a secret salt for stored IP pseudonyms; plain SHA-256 of an IP is easy to dictionary-match.
- Define and enforce a retention policy for messages, user agents, and IP pseudonyms.

### 12. Make Mongo connection/index initialization recoverable

Evidence:

- `lib/mongodb.ts:16-23` caches a rejected connection promise forever in a warm process.
- `app/api/contact/route.ts:101-113` similarly caches a rejected index promise.
- Index creation happens in the user request path.

Improve it:

- Clear cached promises on rejection so later requests can recover.
- Create indexes in a migration/deployment step, not on the first visitor submission.
- Add explicit connect/write timeouts and structured health telemetry.
- Share the contact schema and validation types between client and server, but keep server validation authoritative.

### 13. Add timeouts and runtime validation to all external APIs

Evidence: GitHub, Twitter, and Gemini fetches have no abort timeout. Their JSON is treated as `any`, despite `strict: true`.

Improve it:

- Validate responses with a small runtime schema or explicit type guards.
- Abort after a bounded duration and distinguish timeout, quota, authentication, and upstream errors.
- Add `server-only` imports to server utility modules so future refactors cannot accidentally bundle secret-bearing code.
- Separate server social fetchers from the client cache module; `utils/social.ts` currently mixes server constants/headers and browser fetch state.

### 14. Fix social API semantics and credibility

Evidence:

- `app/api/social/twitter/route.ts:15-18` repeats the same call in `catch`; the helper already catches internally, so the branch is effectively dead.
- All upstream helpers silently return fallback data, causing `/refresh` to report success even when no live refresh occurred.
- The UI includes fabricated static metrics such as GitHub stars, LinkedIn views, and X likes, and fallback live metrics are indistinguishable from verified values.
- SocialLinks server-renders only skeletons, so the actual profile links require JavaScript.

Improve it:

- Render the three static profile links in server HTML immediately; enhance statistics later.
- Return `{ data, source: "live" | "cache" | "fallback", updatedAt }`.
- Do not show invented metrics as live facts. Label estimates explicitly or remove them.
- Let fetch helpers return typed success/error results instead of swallowing all errors.

## Accessibility findings

Lighthouse accessibility scored 90, but automated checks found six contrast failures, five unlabeled fields, invalid heading order, and an accessible-name mismatch. Manual review found additional issues automated testing did not cover.

### 15. Associate every form control and error message

Evidence: `Form.tsx:142-161` creates labels with no `htmlFor`, while inputs at lines 185 onward have no IDs. Lighthouse failed all five visible fields.

Improve it:

- Give each control an ID and each label a matching `htmlFor` (or wrap the control).
- Add `aria-invalid` and `aria-describedby` linking field errors.
- Make error containers live only when a new error is shown.
- Focus the first invalid field after submit.
- Give the projects search input a visible or screen-reader label and use `type="search"`.

### 16. Repair heading semantics and duplicated accessible text

Evidence:

- `/my-projects` starts at H2; it has no H1.
- Skills jumps from H2 to H4, which Lighthouse flags.
- The hero H1 contains two or sometimes three `Sandeep Kumar` spans (`Title.tsx:154-186`), producing the accessible name twice.
- Expandable section titles render three visual copies, and only the spacer is hidden from assistive technology (`ExpandableSection.tsx:86-106`). Browser inspection showed repeated titles.

Improve it:

- Allow the shared Title component to choose `h1`/`h2`; use H1 for each route's page title.
- Follow a sequential hierarchy based on document structure, not visual size.
- Expose one semantic text node and mark decorative duplicates `aria-hidden="true"`.
- Do not scramble the actual text node of a heading. Animate an `aria-hidden` visual copy while retaining stable screen-reader text.

### 17. Implement real dialog behavior

Evidence: `components/ui/Dialog.tsx:19-49` accepts `onClose` but does not use it, has no title association, initial focus, focus trap, background inerting, or focus restoration. Project, media, and thank-you dialogs each add partial keyboard logic independently. Browser inspection showed focus remaining on `body` after opening a project.

Improve it:

- Use one tested dialog primitive or implement: labelled title/description, initial focus, Tab/Shift+Tab containment, Escape, backdrop behavior, background `inert`, and focus restoration.
- Centralize scroll locking with reference counting; several dialogs currently overwrite `body.style.overflow` and can unlock each other.
- Mark collapsed accordion content hidden/inert after the close animation. Height zero alone does not remove it from the accessibility tree.

### 18. Make all interactions keyboard-operable

Evidence:

- The bot launcher is a clickable `div` plus an invisible hit-area `div` (`Bot/index.tsx:604-633`), with no button semantics or keyboard handler.
- The chat input has no accessible label and responses are not in a live region.
- CodeDisplay's comparison slider has no slider role, value, or keyboard support.
- Project cards emulate buttons with a `div role="button"` instead of using a native button/link.
- Closed mobile-menu links remain in the tab order because the menu is only height 0 and opacity 0.

Improve it:

- Use native `<button>` and `<a>` elements first.
- Give the chat input a label, the response `aria-live="polite"`, and processing state `aria-busy`.
- Add range/slider semantics and Arrow/Home/End controls to CodeDisplay.
- Mark the closed mobile menu `hidden`/`inert` or conditionally render it after the close animation.
- Preserve visible focus rings; several controls use `focus:outline-none` without an equivalent focus-visible style.

### 19. Respect reduced motion consistently

Evidence: reduced-motion handling exists in SmoothScroller, background motion, CodeDisplay, ClickSpark, and parts of the bot, but not in the loader, route fade, shared Title, HyperText, most ScrollTriggers, CSS infinite animations, or the hero title's touch interval. MagneticText still runs its entrance animation before returning for reduced motion.

Improve it:

- Add a global `prefers-reduced-motion` rule that disables nonessential CSS animation/transition and smooth scrolling.
- Wrap GSAP animation creation in `gsap.matchMedia()` with a nonanimated visible state.
- Stop timers/animations when offscreen or `document.hidden`.
- Never use reduced motion as a reason to leave elements at opacity 0.

### 20. Fix contrast and accessible naming

Evidence: Lighthouse reports footer text contrast ratios around 2.2-2.8:1 at `Footer.tsx:166-190`. It also reports the mobile logo link's `aria-label="Homepage"` does not contain its visible `Sandeep` text.

Improve it:

- Raise footer text to at least 4.5:1 for normal 12px text; do not rely on low opacity for hierarchy.
- Use an accessible name such as `Sandeep — homepage`, and make the decorative logo image alt empty to avoid repetition.

## Architecture and maintainability

### 21. Break up state-heavy monoliths by responsibility

Largest modules include `Bot/index.tsx` (660 lines), `ProjectsPage.tsx` (578), `CodeDisplay.tsx` (552), `ProjectModal.tsx` (393), and `MediaGallery.tsx` (348). Size alone is not the defect; each combines rendering, animation, async loading, global events, accessibility, and business rules.

Improve it:

- Bot: use a reducer/state machine for chat/eye/visual lifecycle; separate launcher, context menu, chat transport, and presentation.
- Projects: separate filter state, grid transition, project repository/loading, and modal route.
- Media: separate gallery grid, selected-media viewer, and dialog shell.
- Loader: keep DOM and controller together rather than manipulating `InitialLoader` through IDs/classes from `app/template.tsx`.

### 22. Replace brittle global DOM coupling

Evidence:

- The bot infers global modal state by observing body style mutations (`Bot/index.tsx:259-277`).
- Components communicate through scattered `portfolio:*` window events.
- Bot commands poll DOM readiness up to 50 times and click elements based on text (`useBotCommands.ts:41-58`, `166-235`).
- Scroll locks, cursor changes, and overflow are written directly by multiple components.

Improve it:

- Use a small typed UI context/store for modal count, route commands, and bot project context.
- Centralize event names/types if DOM events remain necessary.
- Replace polling with router completion/state and explicit component APIs.
- Use a shared scroll-lock hook that preserves prior styles and supports nested consumers.

### 23. Remove duplicated portfolio configuration

Evidence: project facts appear in `data/data.tsx` and `data/bot-projects.ts`; skills, email, usernames, and profile links are repeated across chat, routes, header/contact components, and README.

Improve it:

- Create a typed `siteConfig` for identity/contact/social metadata.
- Derive the bot's compact project index from selected project source data at build time or maintain a deliberately minimal shared schema.
- Split archived projects from selected project details so client imports remain small.
- Rename `data/data.tsx` to a descriptive `.ts` module; it contains data rather than JSX.

### 24. Strengthen type and lint guardrails

Evidence:

- External JSON is effectively `any`.
- Form errors use unrestricted `Record<string, string>`.
- `SocialLink.icon` is a `ReactNode` and is cast before `cloneElement`.
- Client code uses `NodeJS.Timeout`.
- ESLint globally disables `react-hooks/set-state-in-effect` and `react-hooks/refs`.

Improve it:

- Use typed API result guards and exact field unions.
- Type icon components/elements directly and use `ReturnType<typeof setTimeout>` in shared/client code.
- Re-enable hook rules and suppress only reviewed, documented lines.
- Add a formatter check; Bot/social files currently use inconsistent quote/indent conventions.
- Consider `noUncheckedIndexedAccess` after the current indexing assumptions are fixed.

### 25. Remove silent no-op CSS utilities and dead CSS

Evidence: `scrollbar-thin`, `scrollbar-thumb-border`, `scrollbar-track-transparent`, and `overscroll-behavior-y-contain` are used in modal code but do not exist in the generated stylesheet. The correct Tailwind overscroll utility is different, and no scrollbar plugin/custom utilities are configured. Several global animation/helper classes also have no consumers.

Improve it:

- Use `overscroll-y-contain`.
- Add minimal custom scrollbar CSS or an intentional plugin, or remove the no-op classes.
- Delete unused keyframes/helpers after confirming with a production CSS build.
- Add visual regression coverage for scroll containers so silent utility failures are caught.

## Correctness and resilience defects

### 26. Fix the project grid's permanently growing minimum height

Evidence: `ProjectsPage.tsx:304-323` stores the maximum grid height ever observed, and lines 518-527 keep it as `minHeight`. After filtering to fewer/no projects, the grid preserves the full prior height and can leave a large empty gap.

Improve it: lock the current height only during the exit/enter transition, animate to the measured next height, then clear the inline minimum. A permanent maximum is not necessary to prevent transition CLS.

### 27. Make the initial/route transition controller safe

Evidence:

- `history.scrollRestoration` is set to `manual` but never restored.
- `document.querySelector(window.location.hash)` can throw on an invalid CSS selector.
- Body cursor/overflow are cleared to empty strings instead of restoring prior values.
- Module-level `hasPlayedInitialLoader` and class/ID queries tightly couple lifecycle across routes.

Improve it:

- Use `getElementById` with safely decoded hashes.
- Save and restore prior history/body state.
- Prefer Next's navigation/scroll behavior and one explicit transition state over global mutable module state.
- Remove broad `suppressHydrationWarning` from `app/layout.tsx:70`; scope any unavoidable mismatch to the exact node.

### 28. Fix resize and background-state staleness

Evidence: Header calculates exact pixel widths from `window.innerWidth` only when scroll/menu state changes; resizing without a state transition leaves stale widths. Global background `maxScroll` updates only on window resize, not when document height changes after filtering or content changes.

Improve it:

- Prefer CSS width/max-width transitions in Header; avoid animating layout width when a transform/background change can express the state.
- Observe relevant size changes or refresh the background bounds from a shared layout event.

### 29. Add failure states for dynamic imports

Evidence: Project modal loading renders `null`; `projectDataPromise` caches failures; a failed detail import causes clicks to appear broken.

Improve it:

- Show a small loading state after user intent and a retryable error if import/data loading fails.
- Reset cached promises on rejection.
- Use a route-level project detail page so browser navigation, refresh, sharing, and errors work naturally.

## SEO and portfolio discoverability

### 30. Correct metadata and add project-level pages

Evidence:

- `app/layout.tsx:32-61` falls back to `http://localhost:3000`; the local production output therefore advertises localhost Open Graph URLs when the environment variable is missing.
- `/my-projects` inherits the generic home title/description and has no H1.
- `summary_large_image` is declared without an Open Graph/Twitter image.
- Project case-study content exists only in client-opened modals and has no stable URL.

Improve it:

- Validate a canonical production site URL at build/deploy time and add canonical metadata.
- Add route-specific metadata for projects.
- Add an optimized 1200x630 Open Graph image.
- Create `/my-projects/[slug]` server-rendered pages (optionally using intercepting routes for modal presentation).
- Add `sitemap.ts`, `robots.ts`, and Person/ProfilePage/CreativeWork structured data.
- Add custom `not-found.tsx` and route/global error boundaries.

### 31. Improve image quality and metadata details

Evidence: the portrait source reports 384x477 intrinsic pixels while rendering around 466x466 CSS pixels in the inspected desktop viewport. It will be visibly soft on high-density displays.

Improve it:

- Replace it with a higher-resolution source or constrain its rendered size.
- Use an appropriate PNG Apple touch icon rather than only SVG metadata.
- Keep existing versioned Cloudinary URLs and Next Image sizing; those are otherwise good practices.

## Testing, CI, and observability gaps

There are no tests and no CI configuration in the repository. Lint/typecheck/build passing is useful but does not cover behavior, abuse controls, keyboard flows, or performance regressions.

Minimum test plan:

1. Unit tests for shared contact validation, rate limiting, project selection, and bot local intent parsing.
2. Route tests for invalid/oversized bodies, 429 behavior, Mongo failure/recovery, social allow-listing, upstream timeouts, and chat quotas.
3. Component accessibility tests for form labels/errors, accordion hidden state, menu focusability, and dialogs.
4. Playwright tests for hash navigation, mobile menu, project filtering, deep-linked project details, dialog focus trap/restoration, and contact success/failure.
5. Lighthouse CI budgets on home and projects using mobile throttling: target LCP under 2.5 s, TBT under 200 ms, CLS under 0.1, accessibility 100.
6. Bundle budgets for initial JS and optional Three.js; fail CI on unexpected route cross-loading.
7. Real-user Web Vitals reporting (LCP, INP, CLS) with device/page segmentation.

## Suggested implementation sequence

### Phase 1: immediate risk reduction

- Upgrade Next/React/eslint-config/PostCSS and re-audit from a clean install.
- Rate-limit and timeout chat; remove/protect social refresh and arbitrary username lookup.
- Add durable contact limits and restrict image `remotePatterns` to exact accounts/paths.
- Add baseline security headers: CSP/frame-ancestors, Referrer-Policy, Permissions-Policy, nosniff, and HSTS at the deployment layer.

### Phase 2: mobile Core Web Vitals

- Remove the blocking loader and all initial opacity gates from LCP/core content.
- Mount CodeDisplay only on desktop; lazy-load ScrollSmoother and full Bot.
- Stop automatic project-detail preload on mobile and paginate modal galleries.
- Consolidate/reduce ScrollTriggers and permanent `will-change`.
- Re-run three Lighthouse samples per profile and report the median.

### Phase 3: accessibility and navigation

- Fix form labels/errors, H1 hierarchy, duplicate accessible text, contrast, and reduced motion.
- Replace the dialog implementation and native-ize bot/card/menu/slider controls.
- Add project slug pages/intercepting modal routes.

### Phase 4: maintainability and regression protection

- Split monoliths, centralize typed site data and scroll/modal coordination.
- Add unit/integration/E2E/a11y tests and CI budgets.
- Add field Web Vitals and sanitized server-side API telemetry.

## Existing strengths worth preserving

- TypeScript strict mode, lint, typecheck, and production build all pass.
- Secrets are read server-side and `.env` is ignored; no tracked secret file was found.
- Images generally use `next/image`, responsive `sizes`, versioned Cloudinary URLs, and useful alt text.
- Three.js is isolated in a true optional dynamic chunk and its render loop is cadence/activity driven.
- Many event listeners, animation frames, timers, observers, GSAP contexts, and Three.js resources have cleanup paths.
- The contact route repeats validation server-side and includes a honeypot.
- Touch and reduced-motion users already avoid ScrollSmoother and several decorative effects.
- The previous optimization work substantially improved desktop behavior; the next pass should focus specifically on throttled mobile and resilience.

## Repository hygiene notes

- `public/bot.svg` was already untracked before this audit and was not modified.
- `i-did.md` is tracked even though `.gitignore` now lists it; adding an ignore rule does not untrack an existing file. Review whether it belongs in source control.
- Local `node_modules` contains stale undeclared packages. Use a clean/frozen install in CI so audits and builds reflect `package.json` and `pnpm-lock.yaml` exactly.
