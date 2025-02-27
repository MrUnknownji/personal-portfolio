"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const ANIMATION_CONFIG = {
  HEADER: {
    DURATION: 0.3,
    EASE: "power2.inOut",
    SCROLL: {
      THRESHOLD: 10,
      DURATION: 0.3,
      EASE: "power2.inOut"
    }
  },
  LOGO: {
    DURATION: 0.6,
    EASE: "power2.out",
    SCALE: {
      START: 0.8,
      END: 1
    }
  },
  CONTACT: {
    DURATION: 0.6,
    EASE: "power2.out",
    SCALE: {
      START: 0.8,
      END: 1
    }
  },
  SHINE: {
    DURATION: 1,
    EASE: "none",
    DELAY: 2
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
        gsap.to(header, {
          yPercent: prevScrollPos > currentScrollPos || currentScrollPos < ANIMATION_CONFIG.HEADER.SCROLL.THRESHOLD ? 0 : -100,
          duration: ANIMATION_CONFIG.HEADER.SCROLL.DURATION,
          ease: ANIMATION_CONFIG.HEADER.SCROLL.EASE
        });
      }
      prevScrollPos = currentScrollPos;
    };

    const ctx = gsap.context(() => {
      // Initial animations
      gsap.fromTo(logoRef.current,
        {
          opacity: 0,
          scale: ANIMATION_CONFIG.LOGO.SCALE.START
        },
        {
          opacity: 1,
          scale: ANIMATION_CONFIG.LOGO.SCALE.END,
          duration: ANIMATION_CONFIG.LOGO.DURATION,
          ease: ANIMATION_CONFIG.LOGO.EASE,
          clearProps: "transform"
        }
      );

      gsap.fromTo(contactRef.current,
        {
          opacity: 0,
          scale: ANIMATION_CONFIG.CONTACT.SCALE.START
        },
        {
          opacity: 1,
          scale: ANIMATION_CONFIG.CONTACT.SCALE.END,
          duration: ANIMATION_CONFIG.CONTACT.DURATION,
          ease: ANIMATION_CONFIG.CONTACT.EASE,
          clearProps: "transform"
        }
      );

      // Shine animation
      gsap.fromTo(shineRef.current,
        { x: "-100%" },
        {
          x: "100%",
          duration: ANIMATION_CONFIG.SHINE.DURATION,
          ease: ANIMATION_CONFIG.SHINE.EASE,
          repeat: -1,
          repeatDelay: ANIMATION_CONFIG.SHINE.DELAY
        }
      );
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  const handleButtonHover = (isEntering: boolean) => {
    if (!contactRef.current) return;

    gsap.to(contactRef.current, {
      scale: isEntering ? 1.02 : 1,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-gray-950/80"
      style={{ willChange: "transform" }}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="relative flex items-center justify-between">
          <div ref={logoRef} style={{ willChange: "transform" }}>
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
            style={{ willChange: "transform" }}
            onMouseEnter={() => handleButtonHover(true)}
            onMouseLeave={() => handleButtonHover(false)}
          >
            <div
              ref={shineRef} 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                willChange: "transform"
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
