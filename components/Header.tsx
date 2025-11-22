"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname, useRouter } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  HEADER: { DURATION: 0.4, EASE: "power3.inOut" },
  LOGO: {
    DURATION: 0.8,
    EASE: "elastic.out(1, 0.8)",
    HOVER_DURATION: 0.3,
    HOVER_EASE: "power2.out",
    HOVER_SCALE: 1.05,
  },
  CONTACT: {
    DURATION: 0.6,
    EASE: "power2.out",
    HOVER_DURATION: 0.3,
    HOVER_EASE: "power3.out",
    HOVER_SCALE: 1.02,
    HOVER_BG: "rgba(255, 255, 255, 0.1)",
    INITIAL_BG: "rgba(255, 255, 255, 0.05)",
  },
  PARTICLES: {
    POOL_SIZE: 40,
    INTERVAL: 50,
    DURATION_MIN: 1.2,
    DURATION_MAX: 2.2,
    TRAVEL_DISTANCE: 70,
    SCALE_MIN: 0.2,
    SCALE_MAX: 0.5,
  },
} as const;

const ArrowIcon = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoLinkRef = useRef<HTMLAnchorElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);

  const particlePoolRef = useRef<HTMLDivElement[]>([]);
  const particleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  let particleIndex = 0;

  const pathname = usePathname();
  const router = useRouter();

  const { contextSafe } = useGSAP({ scope: headerRef });

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("contact");
    if (pathname === "/" && element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#contact");
    }
  };

  const createParticlePool = contextSafe(() => {
    if (!particlesContainerRef.current || particlePoolRef.current.length > 0)
      return;
    const container = particlesContainerRef.current;
    for (let i = 0; i < ANIMATION_CONFIG.PARTICLES.POOL_SIZE; i++) {
      const particle = document.createElement("div");
      particle.className =
        "absolute w-1.5 h-1.5 rounded-full pointer-events-none mix-blend-lighten";
      gsap.set(particle, { opacity: 0, scale: 0, x: -9999, y: -9999 });
      container.appendChild(particle);
      particlePoolRef.current.push(particle);
    }
  });

  const animateParticle = contextSafe(
    (originElement: HTMLElement, color: string) => {
      if (
        !particlesContainerRef.current ||
        particlePoolRef.current.length === 0
      )
        return;

      particleIndex =
        (particleIndex + 1) % ANIMATION_CONFIG.PARTICLES.POOL_SIZE;
      const particle = particlePoolRef.current[particleIndex];
      gsap.killTweensOf(particle);

      const originRect = originElement.getBoundingClientRect();
      const containerRect =
        particlesContainerRef.current.getBoundingClientRect();
      const startX =
        originRect.left - containerRect.left + originRect.width / 2;
      const startY = originRect.top - containerRect.top + originRect.height / 2;

      const duration = gsap.utils.random(
        ANIMATION_CONFIG.PARTICLES.DURATION_MIN,
        ANIMATION_CONFIG.PARTICLES.DURATION_MAX,
      );
      const angle = Math.random() * Math.PI * 2;
      const travelDistance =
        ANIMATION_CONFIG.PARTICLES.TRAVEL_DISTANCE *
        (Math.random() * 0.5 + 0.75);
      const endX = Math.cos(angle) * travelDistance;
      const endY = Math.sin(angle) * travelDistance;
      const peakScale = gsap.utils.random(
        ANIMATION_CONFIG.PARTICLES.SCALE_MIN,
        ANIMATION_CONFIG.PARTICLES.SCALE_MAX,
      );

      gsap.set(particle, {
        x: startX,
        y: startY,
        scale: 0,
        opacity: 0,
        backgroundColor: color,
      });

      gsap.to(particle, {
        x: `+=${endX}`,
        y: `+=${endY}`,
        duration: duration,
        ease: "none",
      });

      gsap.to(particle, {
        scale: peakScale,
        opacity: gsap.utils.random(0.7, 1.0),
        duration: duration * 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.set(particle, { opacity: 0, scale: 0, x: -9999, y: -9999 });
        },
      });
    },
  );

  useEffect(() => {
    createParticlePool();
  }, [createParticlePool]);

  useGSAP(
    () => {
      // Entrance animation
      gsap.fromTo(
        [logoLinkRef.current, contactButtonRef.current],
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.LOGO.DURATION,
          ease: ANIMATION_CONFIG.LOGO.EASE,
          stagger: 0.15,
          delay: 0.2,
        },
      );

      // Scroll behavior (hide/show)
      const hideAnim = gsap.to(headerRef.current, {
        yPercent: -100,
        paused: true,
        duration: ANIMATION_CONFIG.HEADER.DURATION,
        ease: ANIMATION_CONFIG.HEADER.EASE,
      });

      ScrollTrigger.create({
        start: "top top",
        end: 99999,
        onUpdate: (self) => {
          if (self.direction === 1) {
            hideAnim.play();
          } else {
            hideAnim.reverse();
          }
        },
      });

      const logo = logoLinkRef.current;
      const contact = contactButtonRef.current;

      if (logo) {
        logo.addEventListener("mouseenter", () => {
          gsap.to(logo, {
            scale: ANIMATION_CONFIG.LOGO.HOVER_SCALE,
            duration: ANIMATION_CONFIG.LOGO.HOVER_DURATION,
            ease: ANIMATION_CONFIG.LOGO.HOVER_EASE,
          });
          if (particleIntervalRef.current)
            clearInterval(particleIntervalRef.current);
          particleIntervalRef.current = setInterval(
            () => animateParticle(logo, "var(--color-accent)"),
            ANIMATION_CONFIG.PARTICLES.INTERVAL,
          );
        });
        logo.addEventListener("mouseleave", () => {
          gsap.to(logo, {
            scale: 1,
            duration: ANIMATION_CONFIG.LOGO.HOVER_DURATION,
          });
          if (particleIntervalRef.current)
            clearInterval(particleIntervalRef.current);
        });
      }

      if (contact) {
        contact.addEventListener("mouseenter", () => {
          gsap.to(contact, {
            scale: ANIMATION_CONFIG.CONTACT.HOVER_SCALE,
            backgroundColor: ANIMATION_CONFIG.CONTACT.HOVER_BG,
            duration: ANIMATION_CONFIG.CONTACT.HOVER_DURATION,
            ease: ANIMATION_CONFIG.CONTACT.HOVER_EASE,
          });
          gsap.to(".contact-arrow", { x: 4, duration: 0.2 });
          if (particleIntervalRef.current)
            clearInterval(particleIntervalRef.current);
          particleIntervalRef.current = setInterval(
            () => animateParticle(contact, "var(--color-primary)"),
            ANIMATION_CONFIG.PARTICLES.INTERVAL,
          );
        });
        contact.addEventListener("mouseleave", () => {
          gsap.to(contact, {
            scale: 1,
            backgroundColor: ANIMATION_CONFIG.CONTACT.INITIAL_BG,
            duration: ANIMATION_CONFIG.CONTACT.HOVER_DURATION,
          });
          gsap.to(".contact-arrow", { x: 0, duration: 0.2 });
          if (particleIntervalRef.current)
            clearInterval(particleIntervalRef.current);
        });
      }
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 transform-gpu
                 bg-dark/70 backdrop-blur-xl
                 border-b border-white/5"
      style={{ willChange: "transform" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between h-18 md:h-20">
          <div
            ref={particlesContainerRef}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
            aria-hidden="true"
          />

          <Link
            ref={logoLinkRef}
            href="/"
            className="relative z-10 flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full"
            aria-label="Homepage"
          >
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={44}
              height={44}
              priority
              className="w-10 h-10 md:w-12 md:h-12"
            />
          </Link>

          <div className="relative z-10">
            <button
              ref={contactButtonRef}
              onClick={handleContactClick}
              className="relative inline-flex items-center justify-center px-5 py-2 md:px-7 md:py-2.5 rounded-full
                         bg-white/5 border border-white/10 text-primary
                         font-medium tracking-wide text-sm md:text-base
                         transition-colors duration-300
                         group
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden"
            >
              <span className="relative z-10">Contact Me</span>
              <span className="contact-arrow inline-block ml-2 transition-transform duration-200">
                <ArrowIcon />
              </span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
