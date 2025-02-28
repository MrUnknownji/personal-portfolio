"use client";
import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import HeroContent from "./HeroSectionComponents/HeroContent";
import CodeDisplay from "./HeroSectionComponents/CodeDisplay";
import { useGSAP } from "@gsap/react";

const ANIMATION_CONFIG = {
  HERO: {
    INITIAL_SCALE: 0.95,
    DURATION: 1,
    SCROLL_DISTANCE: -50,
    OPACITY_FACTOR: 0.5,
    EASE: "power3.out"
  },
  BORDER: {
    DURATION: 3,
    GRADIENT_POSITIONS: {
      START: "0%",
      PEAK: "50%",
      END: "100%"
    }
  },
  GLOW: {
    DURATION: 1.5,
    EASE: "power2.inOut",
    OPACITY_RANGE: [0.4, 0.6]
  },
  PATTERN: {
    SIZE: "4rem",
    OPACITY: 0.05
  }
} as const;

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current || !glowRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    gsap.to(glowRef.current, {
      x: x - width / 2,
      y: y - height / 2,
      duration: 0.5,
      ease: "power2.out"
    });
  }, []);

  const setupScrollAnimation = useCallback(() => {
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 0.8,
      onUpdate: (self) => {
        if (contentRef.current) {
          gsap.set(contentRef.current, {
            y: self.progress * ANIMATION_CONFIG.HERO.SCROLL_DISTANCE,
            opacity: 1 - self.progress * ANIMATION_CONFIG.HERO.OPACITY_FACTOR,
          });
        }
      },
    });
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        {
          scale: ANIMATION_CONFIG.HERO.INITIAL_SCALE,
          opacity: 0,
          y: 30
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.HERO.DURATION,
          ease: ANIMATION_CONFIG.HERO.EASE,
          clearProps: "scale"
        }
      );

      gsap.to(borderRef.current, {
        backgroundPosition: "200% 0",
        duration: ANIMATION_CONFIG.BORDER.DURATION,
        ease: "none",
        repeat: -1,
      });

      gsap.to(glowRef.current, {
        opacity: ANIMATION_CONFIG.GLOW.OPACITY_RANGE[1],
        duration: ANIMATION_CONFIG.GLOW.DURATION,
        ease: ANIMATION_CONFIG.GLOW.EASE,
        yoyo: true,
        repeat: -1
      });

      setupScrollAnimation();
    }, sectionRef);

    return () => {
      ctx.revert();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [setupScrollAnimation]);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative mt-24 sm:mt-6"
    >
      <div className="w-full max-w-7xl mx-auto mt-24 sm:mt-0">
        <div className="relative">
          <div className="absolute -inset-[1px] rounded-3xl overflow-hidden z-1">
            <div
              ref={borderRef}
              className="absolute inset-0"
              style={{
                background: `linear-gradient(
                  90deg,
                  transparent ${ANIMATION_CONFIG.BORDER.GRADIENT_POSITIONS.START},
                  rgba(79, 209, 197, 0.2) 25%,
                  rgba(79, 209, 197, 0.5) ${ANIMATION_CONFIG.BORDER.GRADIENT_POSITIONS.PEAK},
                  rgba(79, 209, 197, 0.2) 75%,
                  transparent ${ANIMATION_CONFIG.BORDER.GRADIENT_POSITIONS.END}
                )`,
                backgroundSize: "200% 100%",
                willChange: "background-position",
              }}
            />
          </div>

          <div
            ref={cardRef}
            className="relative rounded-3xl p-6 md:p-8 lg:p-12
              bg-gray-900/95 backdrop-blur-sm border border-gray-800/50 z-10
              shadow-xl shadow-gray-950/20 transform-gpu"
            onMouseMove={handleMouseMove}
          >
            <div
              ref={glowRef}
              className="absolute w-[40rem] h-[40rem] bg-primary/10 rounded-full filter blur-3xl pointer-events-none opacity-40 transform -translate-x-1/2 -translate-y-1/2"
            />

            <div
              ref={contentRef}
              className="relative flex flex-col lg:flex-row gap-8 h-full justify-center items-center"
            >
              <div className="z-10 w-full h-full">
                <HeroContent />
              </div>
              <div className="z-1 w-full lg:block hidden">
                <CodeDisplay />
              </div>
            </div>

            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/30 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/30 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/30 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/30 rounded-br-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
