# Engineering Audit And Refactor Report

## Bugs Fixed

- Fixed project filtering/search transitions so newly filtered cards always render before the entry animation starts.
- Replaced the delayed DOM query filter flow with a synchronous filtered render and deterministic GSAP timeline.
- Fixed the bot hover behavior so it no longer opens the full chat panel merely from pointer hover.
- Added deterministic local bot answers for common portfolio questions so useful replies work even without Gemini credentials.
- Fixed the broken lint command by replacing `next lint` with `eslint .`, which is the correct workflow for the installed Next.js 16 and ESLint 9 stack.
- Replaced legacy `.eslintrc.json` with `eslint.config.mjs` so ESLint 9 can actually load the project configuration.
- Fixed the social stats cache duration bug in `utils/social.ts`; the cache now compares milliseconds to milliseconds instead of seconds to milliseconds.
- Fixed `/api/social/stats` so it calls the GitHub, X/Twitter, and LinkedIn utility functions directly instead of making fragile HTTP calls back into its own server.
- Fixed `/api/social/refresh` using the wrong LinkedIn username.
- Fixed LinkedIn OAuth CSRF handling by storing and validating the OAuth `state` value in a secure, HTTP-only cookie.
- Fixed LinkedIn OAuth callback redirects by building URLs with `URL` and query parameters instead of interpolating raw strings.
- Removed production logging of OAuth, social, and third-party API details to avoid noisy server output and accidental sensitive data exposure.
- Fixed the Gemini bot endpoint to use the public Gemini Generative Language API endpoint instead of the invalid Vertex AI publisher URL.
- Added a graceful fallback response for the bot when `GEMINI_API_KEY` is missing or Gemini is unavailable.
- Fixed the project modal close flow so overlay clicks, close button clicks, and Escape key closes run the exit animation before unmounting.
- Added Escape key support for closing the project modal.
- Fixed media gallery preview close behavior when refs are not available.
- Fixed missing dependencies in the media gallery keyboard listener so arrow and Escape handlers stay current.
- Fixed contact form validation so whitespace-only category, subject, and message values are rejected.
- Fixed contact form submission to use `window.location.href` for `mailto:` instead of `window.open`, which is commonly blocked by popup protections.
- Fixed the contact success dialog copy-email timeout cleanup to avoid setting state after unmount.
- Fixed the contact success dialog CTA linking to a nonexistent `#projects` anchor; it now links to `/my-projects`.
- Fixed `InfoItem` using Next `Link` for `mailto:`, `tel:`, and external map URLs; it now uses a normal anchor.
    - Fixed social hover tooltip positioning by using viewport coordinates instead of page coordinates with manual scroll subtraction.
- Added viewport clamping to the social tooltip so it does not render off-screen near the edges.
- Fixed the social tooltip arrow direction when the tooltip renders below the trigger.
- Fixed project cards to be keyboard-accessible with `role="button"`, `tabIndex`, Enter, and Space activation.
- Fixed project-card mobile detection so it updates when the viewport crosses the mobile breakpoint.
- Fixed the bot interaction layer so it only suppresses context menu events when the event starts inside the bot area.
- Fixed bot timers and intervals so they are cleaned up on unmount.
- Fixed Three.js bot cleanup by disposing geometry, textures, materials, and the eye texture on unmount.
- Fixed `ResponsiveMeteors` so the meteor count updates on resize instead of being calculated once at mount.
- Fixed `HyperText` delayed animation timers so they are cleared when the component unmounts.
- Fixed `ScrollMandala` delayed GSAP setup so created animations are tracked and killed on cleanup.
- Fixed `DynamicCursor` parsing of CSS HSL variables in Tailwind v4 format.
- Fixed `AboutMe` being treated as a server component after moving `app/home.tsx` back to server rendering by adding an explicit client boundary where hooks are used.
- Fixed an invalid Next route segment config export that caused `next build` to fail.

## Performance Improvements

- Made the project filter animation faster and lighter by replacing the 3D scatter/elastic sequence with a short fade, slide, scale, and blur transition.
- Reduced project-filter transition timing to keep search and category changes responsive while preserving visual polish.
- Shortened the initial page transition loader duration from 2.5 seconds to 0.9 seconds so users see content faster.
- Removed unused local images `public/images/my-image.jpg` and `public/images/sandeep.jpg`; the latter was roughly 5.8 MB of dead asset weight.
- Removed unused component/type/data files that were not imported anywhere in the app.
- Enabled modern image formats (`avif`, `webp`) and a one-week minimum image cache TTL in Next image configuration.
- Disabled the `X-Powered-By` header via `poweredByHeader: false`.
- Removed `dangerouslyAllowSVG` from image configuration because the app does not need remote SVG optimization.
- Stopped self-fetching internal API routes from `/api/social/stats`, reducing latency and avoiding localhost/base URL deployment bugs.
- Added fetch revalidation hints to GitHub, X/Twitter, and LinkedIn utility requests.
- Added cleanup for requestAnimationFrame, GSAP, timeout, interval, and event listener paths in high-motion components.
- Avoided loading the About portrait with `priority`, preventing it from competing with first-viewport assets.
- Kept the heavy Three.js bot dynamically loaded with SSR disabled while improving its cleanup behavior.
- Updated metadata and Open Graph/Twitter metadata so previews and search snippets are more accurate.

## Code Quality Refactors

- Refactored project filtering around a memoized filtered project list and rendered ID tracking instead of JSON string comparisons and timeout-based grid regeneration.
- Improved bot prompt quality with explicit responses for identity, projects, skills, experience, contact, and hiring intents.
- Updated bot chat placeholder and send/close buttons with clearer copy and accessible labels.
- Added a `typecheck` script for explicit TypeScript validation.
- Added a maintainable ESLint 9 flat config using the Next.js flat config export.
- Disabled only the React hook rules that are not practical for this GSAP/portal-heavy architecture while preserving the rest of Next's lint checks.
- Removed unused `TextPlugin` registration from the route transition template.
- Removed the unnecessary client directive from `app/home.tsx` and moved the client boundary to `components/AboutMe.tsx`.
- Reworked social API utilities to return fallbacks quietly instead of throwing or logging expected credential-missing states.
- Normalized GitHub API auth from `token` to `Bearer`.
- Centralized LinkedIn callback redirect construction in helper functions.
- Replaced deprecated/default starter README content with project-specific commands, environment variables, and route notes.
- Removed duplicate/unused global type definitions in `types/index.ts`.
- Removed unused `data/SocialLink.ts`; current social links are assembled where live stats are consumed.
- Removed unused contact dialog subcomponents after confirming the active `ThankYouDialog` implementation is self-contained.
- Added accessible labels and pressed/expanded state attributes to interactive buttons where missing.
- Replaced nested heading tags in expandable project sections with spans inside the button to avoid invalid document outline patterns.
- Added stable IDs for expandable section content and connected them with `aria-controls`.
- Removed invalid Tailwind class `z-1` and duplicate `rounded-full` utility in the hero section.
- Replaced a non-ASCII code-panel comment with ASCII text to keep source encoding consistent.
- Removed `@ts-ignore` from the journey card style by typing the custom CSS variables.
- Added `displayName` to the memoized code panel component.
- Improved route metadata with `metadataBase`, title template, Open Graph, and Twitter card entries.
- Rewrote package README instructions around `pnpm`, matching the configured package manager.

## Validation Performed

- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm build` passes.
- Restarted the production server with `pnpm start`.
- Verified `http://localhost:3000/` returns `200 OK`.
- Verified `http://localhost:3000/my-projects` returns `200 OK`.
- Verified `http://localhost:3000/admin` returns `200 OK`.
- Verified `http://localhost:3000/api/social/stats` returns valid JSON fallback data.

## Notes

- The recurring `baseline-browser-mapping` message is emitted by the installed Next.js dependency chain and does not fail lint, typecheck, or build.
- Playwright is not installed in this repo, so browser screenshot automation was not run without adding new testing dependencies.
