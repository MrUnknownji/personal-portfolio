"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const ANIMATION_CONFIG = {
  HEADER: {
    DURATION: 0.6,
    EASE: "power2.out",
    SCROLL: {
      THRESHOLD: 10,
      DURATION: 0.3,
      EASE: "power2.inOut"
    }
  },
  LOGO: {
    INITIAL: {
      OPACITY: 0,
      X: -20
    },
    DURATION: 0.6,
    EASE: "power2.out"
  },
  CONTACT: {
    INITIAL: {
      OPACITY: 0,
      X: 20
    },
    DURATION: 0.6,
    EASE: "power2.out",
    HOVER: {
      DURATION: 0.3,
      SCALE: 1.02,
      Y: -2
    }
  },
  SHINE: {
    DURATION: 1,
    EASE: "none"
  }
} as const;

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLButtonElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const header = headerRef.current;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (header) {
        header.style.transform = `translateY(${
          prevScrollPos > currentScrollPos ||
          currentScrollPos < ANIMATION_CONFIG.HEADER.SCROLL.THRESHOLD
            ? "0"
            : "-100%"
        })`;
      }
      prevScrollPos = currentScrollPos;
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(logoRef.current,
        {
          opacity: ANIMATION_CONFIG.LOGO.INITIAL.OPACITY,
          x: ANIMATION_CONFIG.LOGO.INITIAL.X
        },
        {
          opacity: 1,
          x: 0,
          duration: ANIMATION_CONFIG.LOGO.DURATION,
          ease: ANIMATION_CONFIG.LOGO.EASE
        }
      ).fromTo(contactRef.current,
        {
          opacity: ANIMATION_CONFIG.CONTACT.INITIAL.OPACITY,
          x: ANIMATION_CONFIG.CONTACT.INITIAL.X
        },
        {
          opacity: 1,
          x: 0,
          duration: ANIMATION_CONFIG.CONTACT.DURATION,
          ease: ANIMATION_CONFIG.CONTACT.EASE
        },
        "<"
      );

      // Shine animation
      gsap.to(shineRef.current, {
        x: "100%",
        duration: ANIMATION_CONFIG.SHINE.DURATION,
        ease: ANIMATION_CONFIG.SHINE.EASE,
        repeat: -1,
        repeatDelay: 2
      });
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out backdrop-blur-sm bg-gray-950/80"
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="relative flex items-center justify-between">
          <div ref={logoRef}>
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={50}
                height={50}
                priority
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          <button
            ref={contactRef}
            className="relative group overflow-hidden bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-xl
              border border-gray-700 shadow-lg transition-all duration-300
              hover:border-primary/50 hover:shadow-primary/20 hover:bg-gray-800"
          >
            <div
              ref={shineRef} 
              className="absolute inset-0 w-full h-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                transform: "translateX(-100%)"
              }}
            />
            <span className="relative z-10">Contact Me</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
