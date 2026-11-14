# November 2026: Lumen Draft launch, performance, security and SEO

The Lumen Draft redesign replaced the previous site at the root on this date. This note
records how it was measured, what was found, and what changed before launch.

## Method

- Production builds (`next build && next start`), Lighthouse 13.4 with simulated mobile
  throttling (Moto G Power, slow 4G), plus Chrome traces and CPU profiles taken with
  Playwright at 412 × 823 and 4× CPU slowdown.
- The machine was shared with a long video render during this work, so absolute numbers
  swing by several hundred milliseconds. Comparisons below are **interleaved**: the
  previous design (built from `main` in a worktree) and the new one were audited
  alternately, five times each, and the medians compared.

## Findings, and what changed

| # | Finding | Change | Effect |
| - | --- | --- | --- |
| 1 | The portrait downloaded the 960 px file at every size (99 KB). | `srcset` with 520/640/960 widths and real `sizes`; a `<head>` preload with `fetchpriority=high`. | Desktop 47 KB, phones 31 KB. |
| 2 | The first project screenshot was preloaded with high priority while sitting far below the fold. | Sheet images are lazy. | Removed ~7 KB of competing bytes before LCP. |
| 3 | Torn-paper edges repeated the same long `clip-path` polygon in every layer, in both the HTML and the hydration payload. | Each edge is written once per sheet as a CSS variable; fewer, rounded points. | Home HTML 199 → 135 KB raw (36 → 27 KB gzip), with no visible change. |
| 4 | A second, hidden copy of the cover letter rendered for the "letter before the work" tweak. | One letter; the tweak now offers In Contact or Off. | ~11 KB less HTML and ~120 fewer nodes to hydrate. |
| 5 | Fonts were 124 KB: two variable fonts with weight and width axes, Google's full Latin set. | Self-hosted subsets covering only the characters the site renders (`app/fonts/`), with a unit test that fails if new text needs a missing glyph. | 92 KB (−26%), same rendering, both axes kept. |
| 6 | The contact form read `offsetHeight` on mount, forcing a full-page layout during hydration (~90 ms of forced reflow in Lighthouse). | Heights come from a `ResizeObserver`; measuring happens only when the form actually changes. | Forced reflow on load removed. |
| 7 | The lab's storyboard study shipped with the page although it only runs after a click. | Both studies load on interest (hover, focus or click). | ~3 KB gzip off the home bundle. |
| 8 | Header and footer links back to the home page prefetched the home page itself. | `prefetch={false}` on links to `/` and `/#…`. | Three redundant RSC fetches (~20 KB) gone. |
| 9 | The tweak panel would have shipped to every visitor. | Only the launcher ships (≈1 KB); the panel, its CSS, the colour picker and the toys load on first open (≈17 KB gzip in total). | Initial JS unchanged by the new features. |

Tried and rejected, with numbers: `experimental.inlineCss` (the CSS was written into the
HTML twice; HTML grew to 451 KB and every metric got worse), and not preloading the text
face (LCP −130 ms, FCP +215 ms).

## Result

Interleaved medians, simulated mobile, same machine and load:

| Page | Metric | Previous design | Lumen Draft |
| --- | --- | ---: | ---: |
| Home | First Contentful Paint | 1,289–1,305 ms | 948–950 ms |
| Home | Largest Contentful Paint | 2,590–2,606 ms | 2,759–3,136 ms |
| Home | Total Blocking Time | 397–464 ms | 323–685 ms |
| Projects | First Contentful Paint | 1,086–1,152 ms | 926–929 ms |
| Case study | First Contentful Paint | 1,273 ms | 948 ms |
| All | Cumulative Layout Shift | 0 | 0 |
| All | Accessibility (axe and Lighthouse) | 1.00 | 1.00, both themes |

The new design paints first about a quarter sooner on every page. Its LCP element is the
portrait (the previous design's was text), so LCP depends on every byte requested before
first paint: about 342 KB on a phone (framework JS 171 KB, fonts 92 KB, the portrait,
CSS and HTML) against about 272 KB before. That is why simulated LCP is a few hundred
milliseconds higher and sits near the 3.2 s budget in `lighthouserc.json` on a busy
machine. Remaining levers are design decisions: one variable font instead of two, or a
text-led hero.

## Security

- Contact API: refuses cross-site posts (`Sec-Fetch-Site`, `Origin` against `Host`) and
  non-JSON bodies, on top of the existing size cap, validation, honeypot and per-IP and
  per-email quotas. Unit-tested.
- Removed the old assistant's server action and its Gemini integration, and the image
  optimiser's unused remote hosts (placehold.co, GitHub avatars, Twitter, LinkedIn), from
  both `remotePatterns` and the CSP.
- Headers: wider `Permissions-Policy`, `Cross-Origin-Resource-Policy: same-site`,
  `worker-src` and `manifest-src` in the CSP, `no-store` on API responses.
- Tweak settings from storage or a pasted JSON are sanitised (known keys only, choices from
  their options, ranges clamped, colours as `#rrggbb`); the pre-paint script only writes
  `--ldt-*` properties and `data-ldt-*` attributes with plain values. JSON-LD escapes `<`.

## SEO

- The site is indexable again (the review build was `noindex`); `/review/*` redirects
  permanently to the same page at the root.
- Every page has its own canonical URL. Before, children inherited the root's `/`.
- JSON-LD: `WebSite` and `Person` on every page, and `CreativeWork` plus `BreadcrumbList`
  on each case study.
- Open Graph images rebuilt in the new look, plus one per case study; favicon, `.ico` and
  Apple icon redrawn.
- `sitemap.xml` with `lastModified`; `robots.txt` allows everything but `/api/`.
