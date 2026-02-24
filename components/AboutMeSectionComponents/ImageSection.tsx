import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  REVEAL_DURATION: 1.0,
  REVEAL_EASE: "power2.out",
  IMAGE_SCALE_START: 1.1,
  IMAGE_DURATION: 1.2,
  IMAGE_EASE: "power2.out",
} as const;

const ImageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !imageWrapperRef.current ||
        !imageRef.current
      )
        return;

      gsap.set(imageWrapperRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(imageRef.current, { scale: ANIMATION_CONFIG.IMAGE_SCALE_START });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(imageWrapperRef.current, {
        opacity: 1,
        scale: 1,
        duration: ANIMATION_CONFIG.REVEAL_DURATION,
        ease: ANIMATION_CONFIG.REVEAL_EASE,
      }).to(
        imageRef.current,
        {
          scale: 1,
          duration: ANIMATION_CONFIG.IMAGE_DURATION,
          ease: ANIMATION_CONFIG.IMAGE_EASE,
        },
        "<",
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto lg:max-w-none group cursor-pointer"
    >
      {/* Decorative Frame */}
      <div className="absolute -inset-3 border border-border rounded-xl z-0 transition-all duration-300 ease-out group-hover:border-primary/40 group-hover:scale-[1.03]" />
      <div className="absolute -inset-3 border border-white/5 rounded-xl z-0 rotate-2 opacity-50 transition-all duration-300 ease-out group-hover:rotate-3 group-hover:opacity-100 group-hover:border-primary/20" />

      <div
        ref={imageWrapperRef}
        className="relative aspect-square w-full rounded-lg overflow-hidden bg-card z-10
                   ring-1 ring-border"
      >
        <Image
          ref={imageRef}
          src={
            "https://res.cloudinary.com/dfwgprzxo/image/upload/v1767790586/sandeep_bgqjpb.png"
          }
          alt="Profile"
          fill
          sizes="(max-width: 1023px) 90vw, 30vw"
          className="object-cover object-top filter grayscale contrast-125 transition-all duration-500 ease-out
                     group-hover:grayscale-0 group-hover:scale-105 group-hover:contrast-100"
          priority
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default ImageSection;
