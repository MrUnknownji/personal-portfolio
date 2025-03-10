import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  DURATION: 1,
  EASE: "power3.out",
  SCALE: {
    START: 1.1,
    END: 1
  },
  OPACITY: {
    START: 0,
    END: 1
  },
  BORDER: {
    DURATION: 1.2,
    EASE: "power2.inOut",
    DELAY: 0.3
  },
  HOVER: {
    SCALE: 1.03,
    DURATION: 0.4,
    EASE: "power2.out"
  }
} as const;

const ImageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !imageWrapperRef.current || !imageRef.current || !borderRef.current) return;

    // Initial setup
    gsap.set(imageWrapperRef.current, { clipPath: "inset(100% 0 0 0)" });
    gsap.set(imageRef.current, { 
      scale: ANIMATION_CONFIG.SCALE.START,
      opacity: ANIMATION_CONFIG.OPACITY.START
    });
    gsap.set(borderRef.current, { autoAlpha: 0 });
    
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { opacity: 0 });
    }

    // Main animation timeline with reverse capability
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        markers: false
      }
    });

    tl.to(imageWrapperRef.current, {
      clipPath: "inset(0% 0 0 0)",
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE
    })
    .to(imageRef.current, {
      scale: ANIMATION_CONFIG.SCALE.END,
      opacity: ANIMATION_CONFIG.OPACITY.END,
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE
    }, "<")
    .to(borderRef.current, {
      autoAlpha: 1,
      duration: ANIMATION_CONFIG.BORDER.DURATION,
      ease: ANIMATION_CONFIG.BORDER.EASE
    }, ANIMATION_CONFIG.BORDER.DELAY);
    
    if (overlayRef.current) {
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: ANIMATION_CONFIG.DURATION,
        ease: ANIMATION_CONFIG.EASE
      }, "<+=0.2");
    }

    // Add hover animations
    const hoverTl = gsap.timeline({ paused: true });
    
    hoverTl.to(imageRef.current, {
      scale: ANIMATION_CONFIG.HOVER.SCALE,
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: ANIMATION_CONFIG.HOVER.EASE
    })
    .to(borderRef.current, {
      borderColor: "rgba(0, 255, 159, 0.4)",
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: ANIMATION_CONFIG.HOVER.EASE
    }, 0);
    
    // Add scroll-triggered parallax effect
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        // Subtle rotation based on scroll position
        gsap.to(containerRef.current, {
          rotateY: (self.progress - 0.5) * 5, 
          duration: 0.1,
          ease: "none",
          overwrite: "auto"
        });
        
        // Subtle scale effect
        gsap.to(imageRef.current, {
          scale: 1 + (self.progress * 0.05),
          duration: 0.1,
          ease: "none",
          overwrite: "auto"
        });
      }
    });

    // Add hover event listeners
    containerRef.current.addEventListener("mouseenter", () => hoverTl.play());
    containerRef.current.addEventListener("mouseleave", () => hoverTl.reverse());

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseenter", () => hoverTl.play());
        containerRef.current.removeEventListener("mouseleave", () => hoverTl.reverse());
      }
    };

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-square max-w-md mx-auto perspective-1000 cursor-pointer"
      style={{ willChange: "transform" }}
    >
      <div 
        ref={borderRef}
        className="absolute -inset-4 border-2 border-primary/20 rounded-2xl -z-10"
      />

      <div 
        ref={imageWrapperRef}
        className="w-full h-full rounded-xl overflow-hidden bg-gray-900/50"
        style={{ willChange: "clip-path" }}
      >
        <Image
          ref={imageRef}
          src="/images/my-image.jpg"
          alt="Profile"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          style={{ willChange: "transform, opacity" }}
          priority
        />
      </div>
      
      <div 
        ref={overlayRef}
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none"
      />
    </div>
  );
};

export default ImageSection;
