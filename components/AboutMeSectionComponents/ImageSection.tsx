import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  REVEAL_DURATION: 0.8,
  REVEAL_EASE: "power3.inOut",
  IMAGE_SCALE_START: 1.15,
  IMAGE_DURATION: 1.2,
  IMAGE_EASE: "power3.out",
  BORDER_OPACITY_DURATION: 0.8,
  BORDER_OPACITY_EASE: "power2.out",
  BORDER_OPACITY_DELAY: 0.3,
} as const;

const ImageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const borderElementsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current || !wrapperRef.current || !imageRef.current)
        return;
      const borderElements = borderElementsRef.current.filter(Boolean);
      if (borderElements.length !== 4) return;

      gsap.set(wrapperRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(imageRef.current, {
        scale: ANIMATION_CONFIG.IMAGE_SCALE_START,
        opacity: 0,
      });
      gsap.set(borderElements, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play pause resume reverse",
          markers: false,
        },
      });

      tl.to(wrapperRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: ANIMATION_CONFIG.REVEAL_DURATION,
        ease: ANIMATION_CONFIG.REVEAL_EASE,
      })
        .to(
          imageRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: ANIMATION_CONFIG.IMAGE_DURATION,
            ease: ANIMATION_CONFIG.IMAGE_EASE,
          },
          "<",
        )
        .to(
          borderElements,
          {
            opacity: 1,
            duration: ANIMATION_CONFIG.BORDER_OPACITY_DURATION,
            ease: ANIMATION_CONFIG.BORDER_OPACITY_EASE,
            stagger: 0.1,
          },
          ANIMATION_CONFIG.BORDER_OPACITY_DELAY,
        );

      return () => {
        tl.scrollTrigger?.kill();
        gsap.killTweensOf([
          wrapperRef.current,
          imageRef.current,
          ...borderElements,
        ]);
      };
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full p-2 group/container
                 bg-secondary/60 backdrop-blur-sm rounded-2xl border border-neutral/30
                 shadow-lg shadow-black/20 ring-1 ring-inset ring-white/5"
    >
      <div
        ref={wrapperRef}
        className="relative aspect-square w-full rounded-lg overflow-hidden shadow-inner shadow-black/30"
        style={{ willChange: "clip-path" }}
      >
        <Image
          ref={imageRef}
          src={
            "https://res.cloudinary.com/dfwgprzxo/image/upload/v1745062501/MyImageUncropped-transformed-transparent2_osyd7d.png"
          }
          alt="Profile"
          fill
          sizes="(max-width: 1023px) 90vw, 30vw"
          className="object-cover grayscale-0 md:grayscale md:group-hover/container:grayscale-0 transition-filter duration-400 ease-out"
          style={{ willChange: "transform, opacity, filter" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/20 pointer-events-none opacity-80" />
      </div>

      <div
        ref={(el) => {
          if (el) borderElementsRef.current[0] = el;
        }}
        className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary md:border-accent rounded-tl-lg
                   transition-colors duration-300 ease-out md:group-hover/container:border-primary opacity-0"
        style={{ willChange: "opacity, border-color" }}
      />
      <div
        ref={(el) => {
          if (el) borderElementsRef.current[1] = el;
        }}
        className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary md:border-accent rounded-tr-lg
                   transition-colors duration-300 ease-out md:group-hover/container:border-primary opacity-0"
        style={{ willChange: "opacity, border-color" }}
      />
      <div
        ref={(el) => {
          if (el) borderElementsRef.current[2] = el;
        }}
        className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary md:border-accent rounded-bl-lg
                   transition-colors duration-300 ease-out md:group-hover/container:border-primary opacity-0"
        style={{ willChange: "opacity, border-color" }}
      />
      <div
        ref={(el) => {
          if (el) borderElementsRef.current[3] = el;
        }}
        className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary md:border-accent rounded-br-lg
                   transition-colors duration-300 ease-out md:group-hover/container:border-primary opacity-0"
        style={{ willChange: "opacity, border-color" }}
      />
    </div>
  );
};

export default ImageSection;
