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
      const building = document.querySelector<HTMLElement>('[data-offset-word="building"]');
      const beyond = document.querySelector<HTMLElement>('[data-offset-word="beyond"]');
      const brief = document.querySelector<HTMLElement>('[data-offset-word="brief"]');
      if (!hero || !band || !heading || !portrait || !note || !foot || !intro || !building || !beyond || !brief) return;

      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(intro, { autoAlpha: 0, y: 48 });
        gsap.set(portrait, { clipPath: "inset(0% 0% 0% 0%)" });
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
            end: "+=85%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .to(band, { scaleX: 5.8, duration: .6, ease: "none" }, 0)
          .to(building, { yPercent: -105, autoAlpha: 0, duration: .35, ease: "none" }, .03)
          .to(beyond, { xPercent: 14, yPercent: -12, duration: .42, ease: "none" }, .04)
          .to(brief, { xPercent: 50, autoAlpha: 0, duration: .4, ease: "none" }, .1)
          .to(portrait, { xPercent: -24, clipPath: "inset(0 26% 0 26%)", autoAlpha: 0, duration: .48, ease: "none" }, .12)
          .to([heading, note, foot], { autoAlpha: 0, duration: .2, ease: "none" }, .34)
          .to(intro, { y: 0, autoAlpha: 1, duration: .45, ease: "none" }, .4);

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

        const mirror = document.querySelector<HTMLElement>(".showcase-mirror");
        if (mirror) {
          gsap.utils.toArray<HTMLElement>(".showcase-wallpaper", mirror).forEach((phone, index) => {
            gsap.fromTo(phone, { xPercent: (index - 1) * -8, rotation: (index - 1) * 2 }, {
              xPercent: (index - 1) * 8,
              rotation: (index - 1) * 3,
              ease: "none",
              scrollTrigger: { trigger: mirror, start: "top 90%", end: "bottom 30%", scrub: .45 },
            });
          });
        }

        const bidScreen = document.querySelector<HTMLElement>(".showcase-bid-screen");
        const bidRow = bidScreen?.closest<HTMLElement>(".showcase-bid");
        if (bidScreen && bidRow) {
          gsap.fromTo(bidScreen, { clipPath: "inset(7% 7% 7% 7%)" }, {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: bidRow, start: "top 85%", end: "center 35%", scrub: .45 },
          });
        }

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
