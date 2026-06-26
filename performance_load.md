I ran the portfolio locally in production mode and profiled / and /my-projects in Chrome with scroll, hover, and click interactions. next build passed. I stopped the servers/browser afterward.

  Top Performance Load Areas

  1. Floating Three.js bot is the biggest hotspot
      - components/Bot/useBotScene.ts:45 creates a WebGLRenderer.
      - components/Bot/useBotScene.ts:231 runs a permanent requestAnimationFrame loop and renders every frame.
      - Trace showed WebGL/GPU tasks creating long stalls, including GLES2::ReadPixels and WebGL flushes around 325-442ms.
      - Chrome also logged WebGL warnings: texSubImage2D: bad image data, Texture is immutable, and GPU stall warnings.
      - This bot can fail entirely in environments without WebGL, which caused the app to crash in the first headless run.

  2. Bot eye texture redraw adds another canvas loop
      - components/Bot/useBotEyes.ts:35 redraws a 512x256 canvas and marks texture.needsUpdate = true.
      - Even when the visual change is small, it can force texture uploads into WebGL.

  3. Hero code comparison runs continuously
      - components/HeroSectionComponents/CodeDisplay.tsx:252 starts an autoplay requestAnimationFrame.
      - components/HeroSectionComponents/CodeDisplay.tsx:242 updates left and clipPath every frame.
      - clip-path animation is more expensive than transform-only animation and contributes to paint/raster work.

  4. Sparkles canvas animation runs every frame
      - components/ui/Sparkles.tsx:95 clears and redraws particles every frame.
      - Used inside the hero slider at components/HeroSectionComponents/CodeDisplay.tsx:413 with particleDensity={300}.

  5. Click spark canvas also runs every frame even when idle
      - components/ui/ClickSpark.tsx:51 redraws on every animation frame.
      - It should only animate while sparks exist. Right now the full-screen canvas keeps looping.

  6. Meteors are 30 infinite CSS animations on desktop
      - components/ui/ResponsiveMeteors.tsx:10 sets desktop count to 30.
      - components/ui/Meteors.tsx:60 renders each meteor as an independently animated element.
      - These showed up as many costly animated/shadowed elements.

  7. Scroll system is heavy
      - components/SmoothScroller.tsx:24 enables GSAP ScrollSmoother.
      - components/GlobalBackground.tsx:71 animates a fixed full-screen SVG background on scroll.
      - components/ui/ScrollMandala.tsx:181 adds multiple scrubbed scroll animations.
      - Home trace during scroll/hover: 937 raster tasks, about 2.5s total raster time, 260 animation-frame callbacks, and 124 style recalculations.

  8. Large blur/backdrop/shadow effects increase paint/raster cost
      - Hero container backdrop blur and huge glow: components/HeroSection.tsx:10, components/HeroSection.tsx:18
      - Header backdrop blur: components/Header.tsx:197
      - Projects sticky controls backdrop blur: app/my-projects/page.tsx:390

  9. Hover handlers do per-mousemove work
      - Magnetic text reads every character’s layout on mousemove: components/HeroSectionComponents/MagneticText.tsx:37
      - Social tooltip updates React state through RAF on mousemove: components/HeroSectionComponents/SocialLinks.tsx:88
      - Journey cards write CSS vars on mousemove: components/AboutMeSectionComponents/JourneySection.tsx:101

  10. Project page hover/filter effects add cost

  - Grid filter transitions animate blur: app/my-projects/page.tsx:210
  - Global mousemove particle parallax runs page-wide: app/my-projects/page.tsx:295
  - Project cards animate image filter: blur/brightness/contrast on hover: components/ProjectCard.tsx:65

  Summary
  The primary load is not page size or images. It is continuous animation work: Three.js bot rendering, canvas loops, CSS meteors, scroll-scrubbed GSAP, clip-path animation, blur/backdrop-filter, and hover handlers. The first
  optimization target should be the bot: pause rendering when idle/offscreen, handle WebGL creation failure, reduce texture uploads, and avoid rendering every frame unless visible or interacting.

