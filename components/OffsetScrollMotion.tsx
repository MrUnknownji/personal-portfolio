"use client";

import { useEffect } from "react";

export default function OffsetScrollMotion() {
  useEffect(() => {
    let cancelled = false;
    let revert = () => {};

    async function start() {
      if (!window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      const hero = document.querySelector<HTMLElement>("[data-offset-hero]");
      const band = document.querySelector<HTMLElement>("[data-offset-band]");
      const heading = document.querySelector<HTMLElement>("[data-offset-heading]");
      const portrait = document.querySelector<HTMLElement>("[data-offset-portrait]");
      const note = document.querySelector<HTMLElement>("[data-offset-note]");
      const foot = document.querySelector<HTMLElement>("[data-offset-foot]");
      const intro = document.querySelector<HTMLElement>("[data-offset-intro]");
      if (!hero || !band || !heading || !portrait || !note || !foot || !intro) return;

      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(intro, { autoAlpha: 0, y: 48 });
        hero.classList.add("offset-motion-enabled");
        let pointerFrame = 0;
        let pointerX = 0;
        let pointerY = 0;
        const onPointerMove = (event: PointerEvent) => {
          const bounds = hero.getBoundingClientRect();
          pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * 16;
          pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * 12;
          if (pointerFrame) return;
          pointerFrame = requestAnimationFrame(() => {
            hero.style.setProperty("--pointer-x", `${pointerX}px`);
            hero.style.setProperty("--pointer-y", `${pointerY}px`);
            pointerFrame = 0;
          });
        };
        const onPointerLeave = () => {
          hero.style.setProperty("--pointer-x", "0px");
          hero.style.setProperty("--pointer-y", "0px");
        };
        hero.addEventListener("pointermove", onPointerMove);
        hero.addEventListener("pointerleave", onPointerLeave);

        const timeline = gsap.timeline({
          onUpdate: () => window.dispatchEvent(new Event("portfolio:surface-update")),
          scrollTrigger: {
            trigger: hero,
            start: "top top+=72",
            end: "+=105%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .to(band, { scaleX: 5.8, duration: 1, ease: "none" }, 0)
          .to([heading, note, foot], { y: -85, autoAlpha: 0, duration: 0.35, ease: "none" }, 0.1)
          .to(portrait, { xPercent: -55, yPercent: 12, autoAlpha: 0, duration: 0.55, ease: "none" }, 0.12)
          .to(intro, { y: 0, autoAlpha: 1, duration: 0.38, ease: "none" }, 0.38);

        gsap.utils.toArray<HTMLElement>("[data-offset-project]").forEach((item) => {
          gsap.fromTo(item, { y: 48, opacity: 0.65 }, {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 84%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-offset-depth]").forEach((visual) => {
          gsap.fromTo(visual, { y: 16 }, {
            y: -16,
            ease: "none",
            scrollTrigger: {
              trigger: visual.closest("[data-offset-project]"),
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-offset-reveal], .offset-lab-card, .offset-profile-roles a, .offset-skills-list > div").forEach((item) => {
          gsap.fromTo(item, { y: 30, opacity: 0.7 }, {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          });
        });

        return () => {
          cancelAnimationFrame(pointerFrame);
          hero.removeEventListener("pointermove", onPointerMove);
          hero.removeEventListener("pointerleave", onPointerLeave);
          hero.classList.remove("offset-motion-enabled");
        };
      });
      revert = () => media.revert();
    }

    void start();
    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return null;
}
