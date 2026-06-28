# Portfolio Performance Load Report

Date: 2026-06-27

## Test Setup

- Build: production (`pnpm build`, `next start -p 3001`)
- Browser: Chrome 149, real headed GPU session
- Desktop viewport: `1440x1000`
- Mobile viewport: `390x844`, touch input
- Motion preference: `no-preference`
- Network/CPU throttling: none
- Cache: disabled for load tests
- Trace categories: Chrome timeline and frame events
- Interactions: real wheel, pointer, hover, and click events

This is a local lab test. Load timings are useful for comparing code changes, but
deployment latency is not represented. Interaction traces are repeated or paired
with equal-duration idle traces where practical.

## Executive Summary

Performance is substantially better than the original audit. Blur, ambient
particle canvases, meteors, scroll-scrubbed decoration, and page-wide pointer
effects are no longer active. The projects page is relatively light.

The remaining load is concentrated in four areas:

1. The 3D bot is the largest optional runtime and bundle cost.
2. Initial hydration/animation produces too many long tasks before LCP.
3. The visible code-comparison autoplay causes continuous layout and paint work.
4. Project and Contact card hovers are bounded but still repaint more than the
   earlier headless-browser profile suggested.

## Current Load Metrics

### Desktop Initial Load: `/`

- TTFB: `17.2ms` on the local server
- DOMContentLoaded: `152.3ms`
- Load event: `622.7ms`
- FCP: `736ms`
- LCP: `2136ms`
- CLS: `0.0099`
- LCP element: hero `H1`
- Long tasks: `10`
- Maximum task: `561.2ms`
- Paint: `1291` events, `277.5ms`
- Raster: `607` tasks, `109.4ms`
- DOM nodes: `935`
- JS heap after settling: `7.83MB`

Transfer:

- Total resources: `538.4KB`
- JavaScript: `388.8KB` across `17` requests
- Images: `21.6KB`
- Largest JS chunk: `134.8KB`
- GSAP chunk: `42.9KB`

The page load event finishes quickly, but LCP occurs much later because the hero
heading is revealed through the loader/startup animation path. The maximum trace
task is a `560.8ms` JavaScript function call. A CPU sample also identifies the
GSAP chunk as the largest named startup function cost (`171ms` self time).

### Mobile Initial Load: `/`

- Load event: `561.3ms`
- FCP: `604ms`
- LCP: `1244ms`
- CLS: `0.0104`
- Long tasks: `6`
- Maximum task: `244.3ms`
- Largest task contents: `138.8ms` layout and `91.8ms` style update
- DOM nodes: `949`
- JS transfer: `388.8KB`
- 3D canvas: not mounted
- SVG bot: mounted

The SVG-only mobile behavior works, but mobile still downloads the same
`388.8KB` of initial JavaScript as desktop, including the chunk containing the
Three.js bot implementation.

### Home Smooth-Scroll Trace

Median of three complete down/up wheel traces:

- Median trace duration: `5.33s`
- Main-thread task time: `3136ms`
- Script: `298.6ms`
- Style recalculation: `582.1ms`
- Layout: `63.9ms`
- Layout count: `88`
- Style recalculation count: `381`
- Paint: `1696` events, `323.3ms`
- Raster: `1403` tasks, `253.6ms`
- Long tasks: median `1`
- Maximum task: median `66ms`

Smooth scrolling remains enabled with `smooth: 0.45`, `effects: false`, and
touch smoothing reduced to `0.12`. The home page is still the heavier scrolling
surface because the full content layer, fixed SVG pattern, header geometry, and
section animations all move through one trace.

### Projects Scroll Trace

- Trace duration: `3.04s`
- Main-thread task time: `811.6ms`
- Script: `76.9ms`
- Style recalculation: `221.1ms`
- Layout: `16.2ms`
- Paint: `113` events, `26.8ms`
- Raster: `319` tasks, `43ms`
- Long tasks: `0`
- Maximum task: `21.5ms`
- DOM nodes: `387`

The projects page is currently in reasonable shape. Its shorter document and
smaller DOM make scrolling much cheaper than the home page.

### Mobile Smooth-Scroll Trace

- Trace duration: `6.39s`
- Main-thread task time: `3900.5ms`
- Script: `370.6ms`
- Style recalculation: `608.3ms`
- Layout: `58.8ms`
- Paint: `1715` events, `329.2ms`
- Raster: `1204` tasks, `211.6ms`
- Long tasks: `0`
- Maximum task: `36.1ms`
- Scroll height: `7208px`

This trace covers a taller document than desktop, so totals are not directly
comparable. Importantly, it has no interaction long tasks and no 3D canvas.

## Remaining Performance Loads

### 1. 3D Bot Bundle and Active Render Loop - High

Relevant code:

- `components/Bot/index.tsx:7` statically imports the 3D scene hook.
- `components/Bot/useBotScene.ts:2` statically imports all of Three.js.
- `components/Bot/useBotScene.ts:266` treats an open chat as an active scene.
- `components/Bot/useBotScene.ts:332` renders and schedules another frame.

Activation trace:

- Duration: `4.52s`
- Script: `1275.5ms`
- Main-thread task time: `3434.8ms`
- Maximum task: `472.9ms`
- Layout: `105.2ms`
- Paint: `183.3ms`
- Raster: `152.9ms`
- Heap increase: `2.9MB`

Five-second idle comparison:

| State | Script | Task time | Paint | Raster |
|---|---:|---:|---:|---:|
| SVG bot, page idle | `96.4ms` | `2446.5ms` | `172.1ms` | `107.3ms` |
| 3D bot, chat open | `818.7ms` | `3581.4ms` | `207.1ms` | `137ms` |
| 3D bot, chat closed | `117ms` | `1831.3ms` | not traced | not traced |

The scene's idle path works after the chat closes. It does not engage while the
chat is open because `chatOpenRef.current` keeps `isActive()` true. Open-chat
script cost is about `8.5x` the SVG idle baseline.

The largest initial JS chunk is `134.8KB` and contains the bot/Three.js code.
Because the import is static, mobile users download it even though mobile never
mounts the 3D scene.

Recommended change:

- Dynamically import the full 3D implementation only after deliberate bot intent.
- Keep the chat UI and SVG bot in the initial bundle.
- Do not use `chatOpen` alone as a reason to render at display refresh rate.
- Render on state changes and run the subtle floating loop at a capped cadence,
  or pause it after a short entrance while keeping the 3D frame visible.

This preserves the 3D visual while removing its cost from initial/mobile load and
reducing the open-chat continuous workload.

### 2. Initial Loader and Startup Work - High

Relevant code:

- `app/template.tsx:157` creates the initial GSAP loader timeline.
- `app/template.tsx:190` updates the counter for `550ms`.
- `app/template.tsx:215` fades in the full content.
- `app/template.tsx:223` fades out the overlay.

The loader itself is finite and much lighter than its original implementation,
but it overlaps hydration, ScrollTrigger setup, hero animation, and other initial
effects. The result is `10` long tasks and a `561.2ms` maximum task before the
hero heading becomes LCP at `2.136s`.

Recommended change:

- Keep the visual loader, but make it CSS-driven and avoid per-value counter DOM
  writes during hydration.
- Initialize below-fold ScrollTriggers after LCP or during idle time.
- Split the optional bot/Three.js chunk, which also reduces startup parse work.
- Keep later route transitions as the existing short content fade.

### 3. Code Comparison Autoplay - Medium/High Continuous Cost

Relevant code:

- `components/HeroSectionComponents/CodeDisplay.tsx:244` writes `left`.
- `components/HeroSectionComponents/CodeDisplay.tsx:247` writes `clipPath`.
- `components/HeroSectionComponents/CodeDisplay.tsx:265` caps painting at 30fps.
- `components/HeroSectionComponents/CodeDisplay.tsx:313` continues the RAF loop.

Five-second top-versus-bottom idle A/B:

| Position | Script | Style | Layout | Layout count |
|---|---:|---:|---:|---:|
| Hero/code display visible | `75.3ms` | `211.5ms` | `41.3ms` | `125` |
| Code display offscreen | `58ms` | `129.9ms` | `0ms` | `0` |

Visibility pausing works. While visible, changing `left` and `clipPath` produces
about `25` layouts per second.

Recommended change:

- Keep continuous left/right autoplay.
- Move the handle with `transform: translate3d(...)`.
- Replace the animated `clipPath` with a transform-based cover/reveal layer.
- Keep the existing 30fps cap and visibility pause.

### 4. Contact Information Hover - Medium, Bounded

Relevant code:

- `components/ContactSectionComponents/InfoItem.tsx:19` animates card styles.
- `components/ContactSectionComponents/InfoItem.tsx:23` fades a full-card gradient.
- `components/ContactSectionComponents/InfoItem.tsx:27` starts a wide shimmer.

Twelve enter/leave cycles:

- Long tasks: `0`
- Maximum task: `23.7ms`
- Script: `92.6ms`
- Style recalculation: `344.2ms`
- Layout: `14.9ms`
- Paint: `894` events, `160.4ms`
- Raster: `12` tasks, `7.6ms`

Equal-area idle:

- Script: `57.1ms`
- Style recalculation: `96.2ms`
- Layout: `0ms`
- Paint: `8` events, `1.7ms`

The hover remains responsive, but the full-card gradient and `200%` shimmer layer
cause real paint work. Keep the lift, icon scale, border, and color response.
The shimmer should be pre-rasterized/promoted or replaced by a smaller
transform-only accent.

### 5. Project Card Hover - Medium, Bounded

Relevant code:

- `components/ProjectCard.tsx:33` moves the card.
- `components/ProjectCard.tsx:42` scales the image.
- `components/ProjectCard.tsx:45` fades the full image overlay.
- `components/ProjectCard.tsx:52` reveals the call to action.

Twelve enter/leave cycles:

- Long tasks: `0`
- Maximum task: `22.8ms`
- Script: `93ms`
- Style recalculation: `296.5ms`
- Layout: `17.9ms`
- Paint: `570` events, `146.3ms`
- Raster: `380` tasks, `50.9ms`

Equal-duration projects idle:

- Script: `45.6ms`
- Style recalculation: `72.7ms`
- Layout: `0ms`
- Paint/raster: `0ms`

This is not compositor-only in a real hover-capable Chrome session. It is still a
short, bounded cost with no long tasks. The image filter effect remains removed;
the current paint comes from the scaled image/full-cover overlay transition.

### 6. Click Spark - Low, Event-Driven

Eight-click stress burst over `5.38s`:

- Long tasks: `0`
- Maximum task: `39.7ms`
- Script: `202.8ms`
- Canvas visible after completion: no

Normalized against the five-second idle trace, the burst adds about `99ms` of
script, or roughly `12.4ms` per click. Raster variation did not show a reliable
increase in this run.

The implementation correctly:

- Starts RAF only while sparks exist.
- Caps rapid bursts at `64` sparks.
- Hides the canvas after completion.
- Has no idle animation cost.

No further change is currently necessary.

### 7. Remaining Global Animation Tickers - Low/Medium

`components/HeroSectionComponents/HireBadge.tsx:12` starts an infinite GSAP
pulse with `repeat: -1`. It continues even when the hero is offscreen. This is
small visually, but it keeps GSAP's ticker and style updates active.

Recommended change:

- Pause the pulse with IntersectionObserver when the badge is offscreen.
- Prefer a short periodic pulse with a delay rather than a continuous tween.

### 8. Smooth Scroll and Fixed Background - Medium Structural Cost

Relevant code:

- `components/SmoothScroller.tsx:27` transforms the smooth content layer.
- `components/GlobalBackground.tsx:32` transforms a `120% x 150%` fixed SVG.
- `components/GlobalBackground.tsx:38` coalesces background updates through RAF.

Both implementations are already throttled sensibly, and smooth scrolling is a
deliberate quality requirement. The structural cost remains visible in the home
scroll trace because a large smooth content surface and a large fixed patterned
surface move together.

Recommended change:

- Keep ScrollSmoother.
- Test a static background pattern as an A/B before changing the design.
- If motion must remain, reduce the pattern layer's overscan and movement range.

## Verified Improvements Still Active

- Smooth scrolling remains enabled.
- ScrollSmoother effects are disabled.
- Background mandala/flower and scrubbed background animation are removed.
- Blur and backdrop-filter implementations: `0`.
- SVG Gaussian blur filters: `0`.
- Canvas `shadowBlur` usage: `0`.
- Meteors: disabled.
- Ambient Sparkles canvases: disabled.
- ClickSpark: hidden and stopped while idle.
- Mobile bot: SVG-only with no 3D canvas.
- 3D canvas: pointer-transparent, bot controls receive hover/click events.
- Page-wide bot mouse, scroll, and route reactions: removed.
- Project image filter animation: removed.
- Title scrambling: reveal-only.
- Header shrink: monotonic.
- Bot command targeting and measured section scrolling: corrected.

## Recommended Implementation Order

1. Lazy-load the entire 3D bot/Three.js implementation after deliberate intent.
2. Stop full-rate 3D rendering merely because the chat is open.
3. Convert CodeDisplay `left`/`clipPath` animation to transform-based movement.
4. Reduce loader hydration overlap and defer below-fold ScrollTrigger setup.
5. Simplify or pre-promote Contact and project full-surface hover layers.
6. Pause the HireBadge pulse offscreen.
7. A/B test a static or smaller moving background while retaining ScrollSmoother.

The first three items offer the largest likely gain without reducing the visible
quality of the portfolio.
