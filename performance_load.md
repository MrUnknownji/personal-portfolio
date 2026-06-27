# Portfolio Performance Load Report

Date: 2026-06-27
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
- The background flower/mandala and all of its scroll/breathing animation code were removed.
- Background scroll height is cached and recalculated on resize instead of read on every scroll frame.
- Source and computed-style audits now find zero visual blur implementations.

## Latest Measurements

The full-page numbers below are from the previous scroll pass after optimizing `CodeDisplay`, `SparklesCore`, magnetic text, and journey card pointer handlers. A focused production hover profile from the latest pass follows them.

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

### Blur, Glow, and Autoplay Audit

Latest production/browser verification:

- Visual blur elements: `0`
- Background mandala present: no
- SVG Gaussian blur filters: `0`
- Canvas `shadowBlur` usage: `0`
- Remaining box shadows: sharp zero-blur offsets only
- Radial-gradient nodes: desktop header plus hidden mobile header; active area `84,480px²`
- Title text after five hover samples: unchanged; scramble now runs only on reveal
- Code slider positions continued changing through `25s`, beyond the old finite-stop point
- Portrait filter: `grayscale(1) contrast(1.25)` -> `grayscale(0) contrast(1)` on hover

The first glow A/B trace compared the same smooth-scroll sequence with radial backgrounds enabled and disabled:

- Main-thread task time with radials: `0.796s` and `0.776s`
- Main-thread task time without radials: `0.791s` and `0.749s`
- Raster time with radials: `891.8ms` and `946.7ms`
- Raster time without radials: `735.9ms` and `773.4ms`

The large hero radial had little main-thread impact but consistently increased raster work. It was removed after the trace. The final page keeps only the requested header radial: active radial-gradient area dropped from about `899,525px²` to `84,480px²`.

### Hover Interaction Micro-profile

Production build, desktop `1440x1000`, four passes across each visible target.

Contact section, 12 hover transitions:

- Long tasks: `0`
- Max task: `47.0ms`
- Layout count: `13`
- Paint: `253` events, `35.8ms`
- Raster: `226` tasks, `155.6ms`

Equal-length idle trace at the Contact section:

- Long tasks: `0`
- Max task: `48.6ms`
- Layout count: `18`
- Paint: `252` events, `49.0ms`
- Raster: `280` tasks, `185.4ms`

The repeated Contact hovers did not add meaningful paint/raster work above the idle baseline. The remaining paint cost at this section is primarily the continuously moving background pattern behind the card.

Projects page, 12 project-card hover transitions:

- Long tasks: `0`
- Max task: `37.2ms`
- Layout count: `0`
- Paint: `0` events
- Raster: `1` task, `0.09ms`

Project-card hover is now effectively compositor-only in this trace.

### Loader, Click Spark, and Bot Audit

Initial loader before -> after:

- Visible overlay duration: `904ms` -> `583ms`
- Maximum task: `140.1ms` -> `85.7ms`
- Long tasks: `5` -> `3`
- Raster time: `361.2ms` -> `336.0ms`
- Hidden infinite flower animation: active -> removed
- Subsequent client route transition: full loader -> `222ms` content fade with no overlay

Optimized ClickSpark:

- Idle canvas display: `none`
- Eight-click stress burst versus equal idle trace:
  - Script: `54.5ms` versus `21.9ms`
  - Raster: `300.5ms` versus `151.7ms`
  - Long tasks: `0`
- This is about `4ms` additional script and `19ms` additional raster per click in the stress trace, with no idle animation cost.

Bot command/behavior verification:

- Same-page Contact command position error: `0px`
- Cross-page Contact command position error: `0px`
- Label-based synthetic button command clicked the exact requested element.
- Global mousemove, touchmove, scroll-speed, route-change jump, and scroll-derived suggestion behaviors are removed.
- Header shrink samples are monotonic from `1440px` to `864px`; the previous undershoot/correction is gone.

## Fixed / Improved Areas

1. 3D bot no longer mounts on hover.
   - It remains SVG until deliberate click/open intent.
   - Mobile stays SVG-only.
   - 3D eye canvas is seeded immediately so the first 3D render has visible eyes.
   - 3D renderer idles instead of running a permanent render loop.

2. Click spark canvas no longer loops while idle.
   - It starts `requestAnimationFrame` only when sparks exist.
   - It stops as soon as the spark list is empty.
   - Its full-screen blend canvas uses `display: none` between bursts.
   - Reduced-motion users get no click listener, and rapid bursts are capped at `64` sparks.

3. Project page hover/filter costs were reduced.
   - Grid transitions no longer animate `filter: blur(...)`.
   - Project card images no longer animate brightness/contrast/blur filters.
   - The old page-wide mousemove parallax listener was removed.

4. Meteors were disabled.
   - They were previously reduced from `30` to `12` on desktop.
   - They are now fully disabled for the current visual/performance comparison.

5. All visual blur implementations were removed.
   - Removed CSS blur and backdrop-filter utilities.
   - Removed SVG Gaussian blur filters from the loader and mobile bot.
   - Removed canvas `shadowBlur` from 3D bot eyes.
   - Removed blurred box/drop shadows; only sharp zero-blur offsets remain.
   - Bright bot eyes now use stronger solid strokes instead.

6. Scroll system was made lighter while keeping smooth scroll.
   - ScrollSmoother is retained.
   - ScrollSmoother `effects` disabled.
   - Background no longer uses ScrollTrigger scrub.
   - Background flower/mandala and all of its animation/listener code were removed.
   - Background still has parallax motion.

7. Hero code comparison is continuous and visibility-aware.
   - Autoplay pauses when offscreen, when the tab is hidden, and while the user is interacting.
   - Autoplay respects reduced motion.
   - Autoplay paints at a capped cadence instead of every browser frame.
   - Autoplay now reverses continuously instead of stopping after a few sweeps.

8. Continuous Sparkles canvases were disabled.
   - The hero slider Sparkles canvas is now disabled.
   - ClickSpark is restored as an event-driven effect and remains hidden while idle.
   - Active ambient canvas count remains `0` before activating the 3D bot.

9. Pointer-heavy hover effects were throttled.
   - Magnetic title text now caches character positions and coalesces updates through `requestAnimationFrame`.
   - Journey cards cache their card rect on enter and write spotlight CSS variables through one frame callback.

10. Contact card and form interaction costs were reduced.
   - Removed the redundant backdrop blur from the opaque Contact card.
   - Removed the large card shadow and hover-animated shadows.
   - The section entrance now runs once instead of reversing and replaying.
   - Removed the nested Contact Information GSAP timeline.
   - Contact items and the submit button use short, explicit transform/color/opacity transitions.
   - Hover sheen is finite instead of an infinite animation.

11. Site-wide hover paths were made snappier.
   - Desktop header hover no longer uses React state, layout reads, and GSAP tweens.
   - Project cards no longer rerender React state on pointer enter/leave.
   - Project image, overlay, and call-to-action hover use transform/opacity only.
   - Repeated skill and journey hover shadows were replaced with borders, transforms, and flat gradient layers.
   - Portrait grayscale/contrast hover was restored as an intentional local paint effect.
   - Section-title scramble runs once on reveal and no longer reruns on hover.
   - Hero social tooltip is anchored to its icon, so it no longer follows page-wide mouse movement.

12. Decorative particles are disabled for comparison.
   - Desktop meteor count dropped from `12` to `0`.
   - Ambient canvas count dropped from `2` to `0`.
   - Script time in the matching scroll trace moved from `176ms` to a particle-free median of `161ms`, about `9%` lower.
   - The baseline trace had `16` long tasks with an `80.6ms` maximum; repeated particle-free traces had a median of `0` long tasks and a `36.2ms` median maximum.
   - Total raster time remained noisy (`1.21s` baseline versus `1.27s` to `1.61s` particle-free), so the particles were not the dominant scroll raster cost.

13. Loader, bot targeting, and header motion were corrected.
   - Loader flower animation is finite and owned by the transition timeline.
   - Later route changes use a short content fade instead of replaying the loader.
   - Bot section scrolling uses measured header offset, `ScrollSmoother.offset()`, and final position correction.
   - Bot can resolve explicit click/press/select commands by visible DOM label.
   - Bot ambient mouse, scroll, and page-change reactions were removed.
   - Header geometry now animates as one numeric GSAP motion without competing CSS constraints.

## Remaining Load Areas

1. Home page raster work is still the largest active cost.
   - The latest home trace still shows `1883` raster tasks and `1294.2ms` total raster time during wheel scrolling.
   - This is much lower than before, but still the dominant cost.
   - The remaining load is mostly the total moving visual surface: smooth content transform, fixed background pattern, and hero animation layers.

2. Hero code comparison is improved, but `clipPath` is still not ideal.
   - The autoplay is continuous and visibility-aware.
   - It still updates `left` and `clipPath` while running.
   - A transform-based reveal would likely reduce paint/raster further, but needs careful visual matching.

3. Smooth scrolling itself has a cost.
   - Keeping it means the whole content layer is transformed during scroll.
   - Current settings are lighter, but smooth scrolling plus multiple fixed/animated decorative layers still increases paint/raster work on the home page.

4. Portrait filter hover has a deliberate local paint cost.
   - Grayscale/contrast interpolation requires repainting the portrait while hovered.
   - It affects one bounded image for `300ms`, rather than a full-screen or continuously animated layer.
   - Four enter/leave cycles produced `218.3ms` raster time versus `58.2ms` in an equal idle trace.
   - That is roughly `20ms` additional raster work per transition, with `0` long tasks and a `27.3ms` maximum task.

5. Contact-area idle paint remains tied to global decoration.
   - The focused trace found no meaningful paint/raster increase from repeated Contact hovers.
   - The equivalent idle trace remained busy because the full-screen background pattern continues behind the section.

## Recommended Next Pass

1. Consider a transform-based `CodeDisplay` reveal.
   - The current autoplay is capped and pauses offscreen.
   - Replacing `clipPath` would be the next deeper improvement if the visual can be matched closely.

2. Consider making the geometric background pattern static.
   - Its current passive, frame-coalesced parallax is lighter than before.
   - Removing that last background scroll transform would trade a small amount of depth for lower raster work.

3. Re-profile again after a reveal or background-pattern change.
   - The projects page is now in decent shape.
   - The home page is where the remaining performance budget is being spent.
