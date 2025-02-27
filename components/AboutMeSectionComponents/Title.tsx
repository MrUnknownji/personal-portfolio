import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  TITLE: {
    DURATION: 1,
    EASE: "power3.out",
    Y_OFFSET: 50,
    OPACITY: 0,
    SCALE: 0.9
  },
  SUBTITLE: {
    DURATION: 0.8,
    DELAY: 0.3,
    EASE: "power2.out",
    Y_OFFSET: 30,
    OPACITY: 0
  },
  DIVIDER: {
    DURATION: 1.2,
    DELAY: 0.5,
    EASE: "power2.inOut",
    SCALE_X: 0
  }
} as const;

const Title = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(
      titleRef.current,
      {
        y: ANIMATION_CONFIG.TITLE.Y_OFFSET,
        opacity: ANIMATION_CONFIG.TITLE.OPACITY,
        scale: ANIMATION_CONFIG.TITLE.SCALE
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: ANIMATION_CONFIG.TITLE.DURATION,
        ease: ANIMATION_CONFIG.TITLE.EASE,
        clearProps: "all"
      }
    )
    .fromTo(
      subtitleRef.current,
      {
        y: ANIMATION_CONFIG.SUBTITLE.Y_OFFSET,
        opacity: ANIMATION_CONFIG.SUBTITLE.OPACITY
      },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.SUBTITLE.DURATION,
        ease: ANIMATION_CONFIG.SUBTITLE.EASE,
        clearProps: "all"
      },
      ANIMATION_CONFIG.SUBTITLE.DELAY
    )
    .fromTo(
      dividerRef.current,
      { scaleX: ANIMATION_CONFIG.DIVIDER.SCALE_X },
      {
        scaleX: 1,
        duration: ANIMATION_CONFIG.DIVIDER.DURATION,
        ease: ANIMATION_CONFIG.DIVIDER.EASE,
        clearProps: "transform"
      },
      ANIMATION_CONFIG.DIVIDER.DELAY
    );
  }, []);

  return (
    <div ref={containerRef} className="text-center space-y-6">
      <h2
        ref={titleRef}
        className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
      >
        About Me
      </h2>
      <p
        ref={subtitleRef}
        className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
      >
        Passionate developer crafting digital experiences with creativity and precision.
        Transforming ideas into elegant, user-centric solutions.
      </p>
      <div
        ref={dividerRef}
        className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent transform-gpu"
      />
    </div>
  );
};

export default Title;
