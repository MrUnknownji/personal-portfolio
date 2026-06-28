# Portfolio Performance Load Report

Date: 2026-06-28

## Test Setup

- Build: production (`pnpm build`, `next start -p 3001`)
- Browser: Chrome 149, headed GPU session
- Desktop viewport: `1440x1000`
- Mobile viewport: `390x844`
- Cache: disabled for load tests
- CPU/network throttling: none
- Interaction input: real wheel, pointer, hover, and click events
- Home scroll result: median of three complete down/up traces

The numbers below compare the 2026-06-27 baseline with the implementation pass
completed on 2026-06-28.

## Summary

All seven recommendations from the previous report were implemented:

1. Three.js and the 3D scene are loaded only after deliberate bot intent.
2. The 3D bot no longer renders continuously merely because chat is open.
3. CodeDisplay uses transform-based reveal layers instead of `left`/`clipPath`.
4. The loader is server-rendered and tied to real readiness work.
5. Below-fold ScrollTrigger setup waits for loader completion and viewport
   proximity.
6. Contact/project hover layers and the HireBadge ticker were reduced.
7. Background overscan, travel, and update cadence were reduced while
   ScrollSmoother remains enabled.

The largest measured gains are initial JavaScript, CodeDisplay idle work, 3D bot
idle work, and home/mobile scrolling.

## Before / After

### Desktop Initial Load

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Initial JS transfer | `388.8KB` | `262.8KB` | `-32%` |
| Total transfer | `538.4KB` | `413.1KB` | `-23%` |
| FCP | `736ms` | `700ms` | `-5%` |
| LCP | `2136ms` | `1728ms` | `-19%` |
| CLS | `0.0099` | `0.00017` | `-98%` |
| Maximum startup task | `561.2ms` | `251.6ms` | `-55%` |
| Startup paint | `277.5ms` | `165.5ms` | `-40%` |
| Startup raster | `109.4ms` | `71.4ms` | `-35%` |
| JS heap after settle | `7.83MB` | `6.35MB` | `-19%` |

The hero heading remains the LCP element. The largest current startup task is
layout/style work (`145ms` layout plus `101ms` style update), not the old
`560ms` JavaScript function call.

### Mobile Initial Load

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Load event | `561ms` | `438ms` | `-22%` |
| FCP | `604ms` | `432ms` | `-28%` |
| LCP | `1244ms` | `912ms` | `-27%` |
| Long tasks | `6` | `3` | `-50%` |
| Maximum task | `244.3ms` | `149.3ms` | `-39%` |

Mobile remains SVG-only and does not request the optional Three.js chunk.

### Home Smooth Scroll

Median complete down/up trace:

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Main-thread task time | `3136ms` | `2424ms` | `-23%` |
| Script | `298.6ms` | `260.5ms` | `-13%` |
| Style recalculation | `582.1ms` | `495.8ms` | `-15%` |
| Layout | `63.9ms` | `35.4ms` | `-45%` |
| Paint | `323.3ms` | `250.4ms` | `-23%` |
| Raster | `253.6ms` | `197.3ms` | `-22%` |
| Median long tasks | `1` | `0` | removed |
| Maximum task | `66ms` | `23ms` | `-65%` |

ScrollSmoother is still active. The background pattern remains visible and moves
subtly at a capped cadence.

### Mobile Smooth Scroll

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Main-thread task time | `3900.5ms` | `2892ms` | `-26%` |
| Style recalculation | `608.3ms` | `487.3ms` | `-20%` |
| Paint | `329.2ms` | `267.7ms` | `-19%` |
| Raster | `211.6ms` | `160.7ms` | `-24%` |
| Long tasks | `0` | `0` | unchanged |

## Implemented Changes

### 1. 3D Bot Is Truly Optional

Files:

- `components/Bot/index.tsx`
- `components/Bot/ThreeBotVisual.tsx`
- `components/Bot/useBotScene.ts`
- `components/Bot/useBotEyes.ts`
- `components/Bot/types.ts`

The lightweight chat/SVG bot is in the initial app. The component importing
Three.js is now a separate dynamic chunk mounted only after click/open intent.

Verified network behavior:

- Three.js requested before bot intent: no
- Optional 3D transfer after intent: about `129KB`
- Mobile Three.js request: no
- Mobile WebGL canvas: no
- SVG remains visible while the optional scene initializes

This removed about `126KB` from initial JavaScript.

### 2. 3D Rendering Is Demand/Cadence Driven

The old scene rendered every display frame while `chatOpen` was true. The new
scene:

- Renders active animation at a maximum of `24fps`.
- Does not treat open chat as permanent visual activity.
- Wakes for processing, cooldown, real hover, resize, and eye-state changes.
- Gives inactive eye changes only a short render window.
- Stops scheduling frames after the activity window.

Five-second idle comparison:

| State | Script | Layout | Paint | Raster |
|---|---:|---:|---:|---:|
| Old SVG page idle | `96.4ms` | `70.4ms` | `172.1ms` | `107.3ms` |
| Old 3D open-chat idle | `818.7ms` | `87.7ms` | `207.1ms` | `137ms` |
| New SVG page idle | `55.9ms` | `0ms` | `2ms` | `23ms` |
| New 3D open-chat idle | `42ms` focused check | `0ms` | effectively idle | effectively idle |

The focused final check found no persistent 3D idle penalty.

Tradeoff: first 3D intent now performs the deferred module parse and scene
construction. In the comparable trace, activation script dropped from
`1275.5ms` to `802.4ms`, but the largest one-time activation task increased from
`472.9ms` to `647ms`. This cost no longer affects initial load or mobile users,
but scene construction is the main remaining bot optimization target.

### 3. CodeDisplay Is Compositor Driven

File:

- `components/HeroSectionComponents/CodeDisplay.tsx`

The moving divider and reveal now use three aligned transforms:

- Divider wrapper moves right.
- Reveal viewport moves right.
- Revealed panel moves left by the matching amount.

This keeps code lines aligned without changing `left` or `clipPath`.

Five-second hero idle:

| Metric | Before | After |
|---|---:|---:|
| Script | `96.4ms` | `55.9ms` |
| Layout | `70.4ms` | `0ms` |
| Layout count | `125` | `0` |
| Paint | `172.1ms` | `2ms` |
| Raster | `107.3ms` | `23ms` |

Autoplay still moves continuously left-to-right and right-to-left, remains
30fps-capped, and pauses when offscreen or when the tab is hidden.

### 4. Loader Performs Real Readiness Work

Files:

- `components/InitialLoader.tsx`
- `app/layout.tsx`
- `app/template.tsx`
- `utils/social.ts`

The loader shell is now part of server-rendered HTML, so it is visible before
hydration. While visible, it starts and tracks:

- `document.fonts.ready`
- Decoding eager and first-viewport images
- Hero social-stat fetch

The social fetch is deduplicated, so the loader and SocialLinks share one
in-flight request/cache. Readiness has a `520ms` visual minimum and a `650ms`
post-hydration maximum; a slow social API continues warming in the background
instead of blocking the page indefinitely.

The loader counter now advances at real task-completion boundaries rather than
performing roughly 100 DOM text writes on a fixed timer. Subsequent client
routes still use the short content fade and do not replay the full loader.

### 5. Below-Fold Animation Setup Is Deferred

File:

- `hooks/useDeferredAnimation.ts`

Applied to:

- About pinning
- About portrait
- Journey
- Skills
- Contact
- Section titles
- Footer

These effects initialize only after the loader signals readiness and their
section approaches the viewport. Content remains in the DOM, preserving section
links, bot targeting, page height, and SEO-visible markup.

### 6. Hover Work Was Reduced

Project cards now explicitly promote card, image, overlay, and CTA transform/
opacity layers.

Twelve project-card enter/leave cycles:

| Metric | Before | After |
|---|---:|---:|
| Script | `93ms` | `39.1ms` |
| Style recalculation | `296.5ms` | `189.8ms` |
| Layout | `17.9ms` | `0ms` |
| Paint | `146.3ms` | `71.5ms` |
| Raster | `50.9ms` | `39.4ms` |
| Maximum task | `22.8ms` | `11.7ms` |

Contact information cards keep lift, border, icon fill, text response, and a
small orange edge. The wide shimmer, animated full-card gradient, and animated
full-card background were removed. The final structure has no hover layout
work.

### 7. Continuous Decoration Was Reduced

HireBadge:

- Uses a periodic pulse with a delay.
- Pauses and resets when offscreen.
- Respects reduced motion.

Global background:

- Overscan reduced from `120% x 150%` to `108% x 120%`.
- Travel reduced from `15%` to `5%`.
- Updates capped at `30fps`.
- Scroll reads remain cached/coalesced.

ClickSpark remains event-driven:

- Eight-click trace: `0` long tasks.
- Canvas returns to `display: none`.
- No idle RAF.
- Current incremental script cost is roughly `3ms` per click in the matching
  trace.

## Current Remaining Loads

1. **First 3D activation**
   - Deferred module parse and scene construction can produce one large task.
   - Next improvement: construct the scene in staged tasks while the SVG remains
     visible, or prewarm only after a stronger desktop intent signal.

2. **Initial responsive layout**
   - Desktop maximum startup task is now about `252ms`.
   - Mobile maximum is about `149ms`.
   - Most of this task is layout/style calculation across the initial DOM.

3. **Bounded hover paint**
   - Project image darkening and scaling still paint a bounded image surface.
   - Contact border/icon/color changes still require small paints.
   - Neither path creates interaction long tasks.

4. **Smooth-scroll structure**
   - ScrollSmoother intentionally transforms the full content layer.
   - The fixed patterned background adds a second moving surface.
   - Both are retained for visual quality, with reduced settings.

## Verified State

- Smooth scrolling: enabled
- Blur/backdrop-filter implementations: `0`
- SVG Gaussian blur filters: `0`
- Canvas `shadowBlur`: `0`
- Meteors: disabled
- Ambient Sparkles: disabled
- ClickSpark idle loop: none
- Mobile 3D bot: disabled
- Three.js in initial/mobile request set: no
- CodeDisplay `left` writes: none
- CodeDisplay animated `clipPath`: none
- Global bot mouse/scroll/route reactions: removed
- Bot canvas pointer events: none
- Bot control hit testing: verified
- Production build/typecheck/lint: passing
