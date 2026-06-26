# Portfolio Performance Load Report

Date: 2026-06-26  
Build tested: production build via `pnpm build` and `next start -p 3001`  
Browser test: Chrome DevTools Protocol, desktop viewport `1440x1000`, wheel scroll + hover interactions

## Current Summary

Smooth scrolling is still enabled. The current implementation keeps GSAP `ScrollSmoother`, but uses a lighter profile:

- `smooth: 0.45` on desktop
- `smoothTouch: 0.12` on touch devices
- `effects: false`
- disabled only for `prefers-reduced-motion: reduce`

The scroll-specific GSAP scrub load has been reduced:

- `GlobalBackground` no longer uses ScrollTrigger scrub.
- `ScrollMandala` no longer uses one timeline plus four scrubbed ScrollTriggers.
- Both now use passive scroll listeners with `requestAnimationFrame`.
- Scroll height is cached and recalculated on resize instead of read on every scroll frame.

## Latest Measurements

### Home: `/`

Interaction flow: load, wheel-scroll down/up through the page, hover hero/social areas. Bot was not clicked, so the 3D bot was not part of the main scroll profile.

- Smooth scroll active: yes, `#smooth-content` transform observed as `matrix(1, 0, 0, 1, 0, -2040)`
- DOM nodes: `1084`
- Canvases: `2`
- WebGL canvases: `1` from capability checks / browser context, not the activated 3D bot
- Meteors: `12`
- SVG bot: visible
- Long tasks during measured interaction: `7`
- Task duration delta: `4.532s`
- Script duration delta: `0.529s`
- Layout duration delta: `0.229s`
- Style recalculation duration delta: `0.633s`
- Layout count delta: `400`
- Style recalculation count delta: `485`
- Paint events: `1123`, total `218.6ms`
- Raster tasks: `2826`, total `1855.9ms`
- Max long trace task: `95.2ms`
- Console warnings: none

### Projects: `/my-projects`

Interaction flow: load, wheel-scroll, hover project cards.

- Smooth scroll active: yes, `#smooth-content` transform observed as `matrix(1, 0, 0, 1, 0, -846)`
- DOM nodes: `528`
- Canvases: `1`
- Meteors: `12`
- SVG bot: visible
- Long tasks during measured interaction: `0`
- Task duration delta: `0.672s`
- Script duration delta: `0.078s`
- Layout duration delta: `0.005s`
- Style recalculation duration delta: `0.169s`
- Layout count delta: `16`
- Style recalculation count delta: `234`
- Paint events: `136`, total `17.7ms`
- Raster tasks: `291`, total `179.6ms`
- Max trace task: `48ms`
- Console warnings: none

## Fixed / Improved Areas

1. 3D bot no longer mounts on hover.
   - It remains SVG until deliberate click/open intent.
   - Mobile stays SVG-only.
   - 3D eye canvas is seeded immediately so the first 3D render has visible eyes.
   - 3D renderer idles instead of running a permanent render loop.

2. Click spark canvas no longer loops while idle.
   - It starts `requestAnimationFrame` only when sparks exist.
   - It stops as soon as the spark list is empty.

3. Project page hover/filter costs were reduced.
   - Grid transitions no longer animate `filter: blur(...)`.
   - Project card images no longer animate brightness/contrast/blur filters.
   - The old page-wide mousemove parallax listener was removed.

4. Meteors were reduced.
   - Desktop count reduced from `30` to `12`.
   - Mobile count reduced from `10` to `4`.
   - Reduced-motion users get no meteors.
   - Per-meteor shadow was removed and trails shortened.

5. Large backdrop blur / shadow costs were reduced.
   - Hero backdrop blur removed.
   - Header backdrop blur removed.
   - Project sticky controls backdrop blur removed.
   - Hero huge blurred glow replaced with a radial gradient.

6. Scroll system was made lighter while keeping smooth scroll.
   - ScrollSmoother is retained.
   - ScrollSmoother `effects` disabled.
   - Background and mandala no longer use ScrollTrigger scrub.
   - Mandala still moves, scales, rotates, and breathes.
   - Background still has parallax motion.

## Remaining Load Areas

1. Home page raster work is still the largest active cost.
   - The latest home trace still shows `2826` raster tasks and `1855.9ms` total raster time during wheel scrolling.
   - This is now less about ScrollTrigger scrub and more about the total moving visual surface: smooth content transform, fixed background art, mandala SVG/filter, meteors, hero code comparison, and canvas effects.

2. Hero code comparison remains a major candidate.
   - `components/HeroSectionComponents/CodeDisplay.tsx` still runs autoplay with `requestAnimationFrame`.
   - It updates `left` and `clipPath`.
   - `clipPath` animation tends to increase paint/raster work.
   - It also embeds `SparklesCore`.

3. Sparkles canvas is still continuous where mounted.
   - `components/ui/Sparkles.tsx` clears and redraws particles every frame.
   - The hero slider uses `particleDensity={300}`.
   - This is probably the next best optimization target.

4. Smooth scrolling itself has a cost.
   - Keeping it means the whole content layer is transformed during scroll.
   - Current settings are lighter, but smooth scrolling plus multiple fixed/animated decorative layers still increases paint/raster work on the home page.

5. Some hover handlers still do per-pointer work.
   - Magnetic text reads character bounding boxes during mouse movement.
   - Social info box tracks mouse position.
   - Journey cards write CSS vars on mousemove.

## Recommended Next Pass

1. Optimize `CodeDisplay`.
   - Replace `clipPath` animation with transform-based masking if possible.
   - Pause autoplay when offscreen.
   - Respect reduced motion.
   - Consider stopping autoplay after one or two cycles until hover.

2. Optimize `SparklesCore`.
   - Pause when offscreen.
   - Lower particle density.
   - Draw at a lower internal resolution or lower FPS.

3. Reduce mandala paint cost further without removing it.
   - Consider removing or further reducing the SVG glow filter.
   - Keep the same geometry and motion, but avoid expensive SVG filter compositing during scroll.

4. Re-profile after hero canvas/code optimizations.
   - The projects page is now in decent shape.
   - The home page is where the remaining performance budget is being spent.
