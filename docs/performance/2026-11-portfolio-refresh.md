# November 2026 refresh: performance notes

Lighthouse 13.4, simulated mobile throttling, production build, median of three runs
(`pnpm lighthouse`). The same machine measured before and after. Lighthouse's
simulated numbers vary by a few hundred milliseconds between runs; single runs are
not meaningful, medians are. "After" shows the range of medians across the final runs.
The site quotes the conservative end (home LCP 3,842 → 2,726 ms, 29% faster).

| Page | Metric | Before | After |
| --- | --- | ---: | ---: |
| Home | Performance score | 0.87 | 0.94–0.96 |
| Home | Largest Contentful Paint | 3,842 ms | 2,438–2,726 ms |
| Home | Total Blocking Time | 149 ms | 222 ms |
| Projects | Performance score | 0.90 | 0.93–0.97 |
| Projects | Largest Contentful Paint | 3,642 ms | 2,361–2,661 ms |
| Both | Cumulative Layout Shift | 0 | ≤ 0.001 |
| Home | CSS shipped (raw / gzip) | 184 KB / 32 KB | 100 KB / 19 KB |

Before this work, both pages failed the 3.2 s LCP budget in `lighthouserc.json`.
TBT varies between about 70 and 350 ms from run to run on this machine and stays well
inside the 600 ms budget.

## What changed

1. **Removed `app/loading.tsx`.** Every route is statically prerendered, but the
   loading boundary made the server stream the fallback first and reveal the page a
   few hundred milliseconds later. The filmstrip showed the loading screen covering
   the hero, and the LCP element painted only after the reveal. Navigations are
   prefetched, so the fallback was not buying anything. (Home LCP 3.8 s → 3.0 s.)
2. **Fonts and the portrait stop competing with the LCP text.** The small mono label
   font is no longer preloaded, and the hero portrait is fetched with low priority.
   (Home LCP about 2.9 s → 2.4 s, median of five runs.)
3. **Pruned and scoped CSS.** About 220 dead rules and 10 keyframe sets from removed
   components are gone, duplicate selectors were merged, and route-only stylesheets
   (case study, projects index, 1-page profile, print, motion) load only on their
   routes. Every step was checked with full-page screenshot diffs at 390 and 1440 px.
4. **Measured `contain-intrinsic-size` values.** Below-the-fold sections use
   `content-visibility: auto`. The placeholder sizes were far from the real heights,
   so Back navigation restored the wrong scroll position. They are now measured per
   breakpoint.
5. **Smaller client payloads.** Client components receive project summaries as props
   instead of importing the full project data module, and the home showcase no longer
   serializes galleries and case-study text.

## Things tried and reverted

- `experimental.inlineCss`: no measurable LCP change once the loading boundary was the
  real bottleneck, and it duplicates CSS in the RSC payload.
- Preloading the Barlow Condensed latin-ext subset (needed for "₹"): no change.

## Adding FrameRelay Studio (9 November)

The fourth home showcase row plays a muted loop of the studio reel. Its first version
used the video `poster` attribute; the browser fetched that image with the first
screen, and simulated home LCP rose to about 3.4 s. The poster is now a lazy
`next/image` behind the video, the video uses `preload="none"`, and it plays only while
on screen (never automatically with reduced motion or data saver). Home went back to
2.7 s (median of three), inside the 3.2 s budget.

The projects index alternated between about 2.1 s and 3.1 s LCP from run to run while
the machine was under load. Removing the new card gave the same split (2.4 / 3.1 /
3.1 s), so the spread is measurement noise, not a regression from the card. The
card uses an 8 KB reel frame instead of the 37 KB painted screenshot, which stays in
the gallery.
