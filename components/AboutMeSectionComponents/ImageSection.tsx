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
      if (!containerRef.current || !imageWrapperRef.current || !imageRef.current) return;

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
      })
        .to(imageRef.current, {
          scale: 1,
          duration: ANIMATION_CONFIG.IMAGE_DURATION,
          ease: ANIMATION_CONFIG.IMAGE_EASE,
        }, "<");

    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto lg:max-w-none"
    >
      {/* Decorative Frame */}
      <div className="absolute -inset-3 border border-primary/20 rounded-2xl z-0" />
      <div className="absolute -inset-3 border border-white/5 rounded-2xl z-0 rotate-2 opacity-50" />

      <div
        ref={imageWrapperRef}
        className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#0a0a0a] z-10
                   shadow-2xl shadow-black/50 ring-1 ring-white/10 group"
      >
        <Image
          ref={imageRef}
          src={
            "https://res.cloudinary.com/dfwgprzxo/image/upload/v1767790586/sandeep_bgqjpb.png"
          }
          alt="Profile"
          fill
          sizes="(max-width: 1023px) 90vw, 30vw"
          className="object-cover object-top grayscale transition-all duration-500 ease-out
                     group-hover:grayscale-0 group-hover:scale-105"
          priority
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
      </div>
    </div>
  );
};

export default ImageSection;
