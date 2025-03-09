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
      CLASS_HIDDEN: "header-hidden"
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
  },
  HOVER: {
    DURATION: 0.2,
    EASE: "power2.out",
    SCALE: 1.02
  },
  LOGO_HOVER: {
    DURATION: 0.3,
    EASE: "power2.out",
    SCALE: 1.05
  }
} as const;

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const logoImageRef = useRef<HTMLImageElement>(null);
  const contactRef = useRef<HTMLButtonElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const buttonBorderRef = useRef<HTMLDivElement>(null);
  const buttonShadowRef = useRef<HTMLDivElement>(null);
  const buttonBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const header = headerRef.current;

    // Use vanilla JS for scroll animation
    const handleScroll = () => {
      if (!header) return;
      
      const currentScrollPos = window.scrollY;
      const shouldShow = prevScrollPos > currentScrollPos || 
                         currentScrollPos < ANIMATION_CONFIG.HEADER.SCROLL.THRESHOLD;
      
      // Toggle class instead of using GSAP
      if (shouldShow) {
        header.classList.remove(ANIMATION_CONFIG.HEADER.SCROLL.CLASS_HIDDEN);
      } else {
        header.classList.add(ANIMATION_CONFIG.HEADER.SCROLL.CLASS_HIDDEN);
      }
      
      prevScrollPos = currentScrollPos;
    };

    const ctx = gsap.context(() => {
      // Keep GSAP for initial animations
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
          clearProps: "transform",
          force3D: true
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
          clearProps: "transform",
          force3D: true
        }
      );

      gsap.fromTo(shineRef.current,
        { x: "-100%" },
        {
          x: "100%",
          duration: ANIMATION_CONFIG.SHINE.DURATION,
          ease: ANIMATION_CONFIG.SHINE.EASE,
          repeat: -1,
          repeatDelay: ANIMATION_CONFIG.SHINE.DELAY,
          force3D: true
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

    const tl = gsap.timeline();
    
    tl.to(contactRef.current, {
      scale: isEntering ? ANIMATION_CONFIG.HOVER.SCALE : 1,
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: ANIMATION_CONFIG.HOVER.EASE,
      force3D: true
    });
    
    if (buttonBorderRef.current) {
      tl.to(buttonBorderRef.current, {
        borderColor: isEntering ? "rgba(0, 255, 159, 0.5)" : "rgba(55, 65, 81, 1)",
        duration: ANIMATION_CONFIG.HOVER.DURATION,
        ease: ANIMATION_CONFIG.HOVER.EASE
      }, 0);
    }
    
    if (buttonShadowRef.current) {
      tl.to(buttonShadowRef.current, {
        boxShadow: isEntering ? "0 4px 20px rgba(0, 255, 159, 0.2)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        duration: ANIMATION_CONFIG.HOVER.DURATION,
        ease: ANIMATION_CONFIG.HOVER.EASE
      }, 0);
    }
    
    if (buttonBgRef.current) {
      tl.to(buttonBgRef.current, {
        backgroundColor: isEntering ? "rgba(31, 41, 55, 1)" : "rgba(17, 24, 39, 1)",
        duration: ANIMATION_CONFIG.HOVER.DURATION,
        ease: ANIMATION_CONFIG.HOVER.EASE
      }, 0);
    }
  };

  const handleLogoHover = (isEntering: boolean) => {
    if (!logoImageRef.current) return;
    
    gsap.to(logoImageRef.current, {
      scale: isEntering ? ANIMATION_CONFIG.LOGO_HOVER.SCALE : 1,
      duration: ANIMATION_CONFIG.LOGO_HOVER.DURATION,
      ease: ANIMATION_CONFIG.LOGO_HOVER.EASE,
      force3D: true
    });
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-gray-950/80 transition-transform duration-300 ease-in-out"
      style={{ willChange: "transform" }}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="relative flex items-center justify-between">
          <div ref={logoRef} style={{ willChange: "transform" }}>
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
              onMouseEnter={() => handleLogoHover(true)}
              onMouseLeave={() => handleLogoHover(false)}
            >
              <Image
                ref={logoImageRef}
                src="/images/logo.svg"
                alt="Logo"
                width={50}
                height={50}
                priority
                className="rounded-xl"
                style={{ willChange: "transform" }}
              />
            </Link>
          </div>

          <div 
            className="relative"
            ref={buttonBorderRef}
            style={{ willChange: "transform" }}
          >
            <div 
              ref={buttonShadowRef}
              className="absolute inset-0 rounded-xl"
              style={{ willChange: "box-shadow" }}
            ></div>
            <div 
              ref={buttonBgRef}
              className="absolute inset-0 rounded-xl bg-gray-900"
              style={{ willChange: "background-color" }}
            ></div>
            <button
              ref={contactRef}
              className="relative overflow-hidden text-white font-semibold px-6 py-2.5 rounded-xl
                border border-gray-700 z-10"
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
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
