# Portfolio Performance Load Report

Date: 2026-06-26  
Build tested: production build via `pnpm build` and `next start -p 3001`  
Browser test: Chrome DevTools Protocol, desktop viewport `1440x1000`, `prefers-reduced-motion: no-preference`, wheel scroll + hover interactions

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

These numbers are from the latest pass after optimizing `CodeDisplay`, `SparklesCore`, magnetic text, and journey card pointer handlers.

### Home: `/`

Interaction flow: load, wheel-scroll down/up through the page, hover hero/social areas. Bot was not clicked, so the 3D bot was not part of the main scroll profile.

- Smooth scroll active: yes, `#smooth-content` transform observed mid-scroll as `matrix(1, 0, 0, 1, 0, -4160)`
- DOM nodes: `1084`
- Canvases: `2`
- WebGL canvases: `1` from capability checks / browser context, not the activated 3D bot
- Meteors: source count remains desktop `12`; latest CDP selector did not expose a stable class marker
- Long tasks during measured interaction: `6`
- Task duration delta: `1.797s`
- Script duration delta: `0.178s`
- Layout duration delta: `0.031s`
- Style recalculation duration delta: `0.279s`
- Layout count delta: `55`
- Style recalculation count delta: `291`
- Paint events: `747`, total `113.6ms`
- Raster tasks: `1883`, total `1294.2ms`
- Max long trace task: `145.8ms`

Compared with the previous home trace:

- Task duration: `4.532s` -> `1.797s`
- Script duration: `0.529s` -> `0.178s`
- Layout duration: `0.229s` -> `0.031s`
- Layout count: `400` -> `55`
- Paint events: `1123` -> `747`
- Raster tasks: `2826` -> `1883`

### Projects: `/my-projects`

Interaction flow: load, wheel-scroll, hover project cards.

- Smooth scroll active: yes, `#smooth-content` transform observed as `matrix(1, 0, 0, 1, 0, -846)`
- DOM nodes: `528`
- Canvases: `1`
- Meteors: source count remains desktop `12`; latest CDP selector did not expose a stable class marker
- Long tasks during measured interaction: `1`
- Task duration delta: `0.561s`
- Script duration delta: `0.074s`
- Layout duration delta: `0.007s`
- Style recalculation duration delta: `0.118s`
- Layout count delta: `25`
- Style recalculation count delta: `186`
- Paint events: `74`, total `18.5ms`
- Raster tasks: `293`, total `222.4ms`
- Max trace task: `90.2ms`

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

7. Hero code comparison was made finite and visibility-aware.
   - Autoplay pauses when offscreen, when the tab is hidden, and while the user is interacting.
   - Autoplay respects reduced motion.
   - Autoplay paints at a capped cadence instead of every browser frame.
   - Autoplay stops after a couple of full sweeps instead of looping forever.

8. Sparkles canvas was made cheaper.
   - It pauses into a slow idle check when offscreen or the tab is hidden.
   - It supports capped FPS and is now used at `24fps` in the hero slider.
   - Hero slider particle density was reduced from `300` to `140`.
   - It observes its own container size instead of relying only on global resize.

9. Pointer-heavy hover effects were throttled.
   - Magnetic title text now caches character positions and coalesces updates through `requestAnimationFrame`.
   - Journey cards cache their card rect on enter and write spotlight CSS variables through one frame callback.

## Remaining Load Areas

1. Home page raster work is still the largest active cost.
   - The latest home trace still shows `1883` raster tasks and `1294.2ms` total raster time during wheel scrolling.
   - This is much lower than before, but still the dominant cost.
   - The remaining load is mostly the total moving visual surface: smooth content transform, fixed background art, mandala SVG/filter, meteors, and hero decorative layers.

2. Hero code comparison is improved, but `clipPath` is still not ideal.
   - The autoplay is now finite and visibility-aware.
   - It still updates `left` and `clipPath` while running.
   - A transform-based reveal would likely reduce paint/raster further, but needs careful visual matching.

3. Smooth scrolling itself has a cost.
   - Keeping it means the whole content layer is transformed during scroll.
   - Current settings are lighter, but smooth scrolling plus multiple fixed/animated decorative layers still increases paint/raster work on the home page.

4. Mandala SVG/filter remains a likely raster contributor.
   - It no longer uses ScrollTrigger scrub, but it is still a fixed, blended SVG with a glow filter.
   - The best next version would keep the mandala but replace the SVG filter glow with cheaper strokes/opacities or a precomposed asset.

5. Social info box still follows the mouse while active.
   - It only attaches the global listener while a social link is active.
   - It already coalesces updates through `requestAnimationFrame`.
   - If needed, it can be changed to anchor near the hovered icon instead of following the pointer.

## Recommended Next Pass

1. Reduce mandala paint cost further without removing it.
   - Consider removing or further reducing the SVG glow filter.
   - Keep the same geometry and motion, but avoid expensive SVG filter compositing during scroll.

2. Consider a transform-based `CodeDisplay` reveal.
   - The current finite autoplay is much cheaper.
   - Replacing `clipPath` would be the next deeper improvement if the visual can be matched closely.

3. Consider anchoring the social info box.
   - This would remove the last page-level mouse tracking in the hero.
   - It is a quality tradeoff because the current follow behavior feels more interactive.

4. Re-profile again after mandala or reveal changes.
   - The projects page is now in decent shape.
   - The home page is where the remaining performance budget is being spent.
