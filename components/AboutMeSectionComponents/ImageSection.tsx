import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  REVEAL_DURATION: 0.8,
  REVEAL_EASE: "power3.inOut",
  IMAGE_SCALE_START: 1.1,
  IMAGE_DURATION: 1.2,
  IMAGE_EASE: "power3.out",
  BORDER_DURATION: 1.0,
  BORDER_EASE: "power2.inOut",
  BORDER_DELAY: 0.3,
} as const;

const ImageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !wrapperRef.current ||
        !imageRef.current ||
        !borderRef.current
      )
        return;

      gsap.set(wrapperRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(imageRef.current, {
        scale: ANIMATION_CONFIG.IMAGE_SCALE_START,
        opacity: 0,
      });
      gsap.set(borderRef.current, { opacity: 0 });

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
          borderRef.current,
          {
            opacity: 1,
            duration: ANIMATION_CONFIG.BORDER_DURATION,
            ease: ANIMATION_CONFIG.BORDER_EASE,
          },
          ANIMATION_CONFIG.BORDER_DELAY,
        );

      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        gsap.killTweensOf([
          wrapperRef.current,
          imageRef.current,
          borderRef.current,
        ]);
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="relative w-full group">
      <div
        ref={borderRef}
        className="absolute -inset-1.5 border border-primary/20 rounded-2xl pointer-events-none animate-pulse"
        style={{ willChange: "opacity", animationDuration: "2s" }}
      />
      <div
        ref={wrapperRef}
        className="relative aspect-square w-full rounded-lg overflow-hidden"
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
          className="object-cover grayscale group-hover:grayscale-0 transition-filter duration-300 ease-out"
          style={{ willChange: "transform, opacity, filter" }}
          priority
        />
      </div>
    </div>
  );
};

export default ImageSection;
