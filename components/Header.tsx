"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname, useRouter } from "next/navigation";

const ANIMATION_CONFIG = {
  HEADER: {
    DURATION: 0.3,
    EASE: "power2.inOut",
    SCROLL: { THRESHOLD: 10, CLASS_HIDDEN: "header-hidden" },
  },
  LOGO: {
    DURATION: 0.6,
    EASE: "power2.out",
    HOVER_DURATION: 0.3,
    HOVER_EASE: "power2.out",
    HOVER_SCALE: 1.05,
  },
  CONTACT: {
    DURATION: 0.6,
    EASE: "power2.out",
    HOVER_DURATION: 0.3,
    HOVER_EASE: "power3.out",
    PARTICLE_INTERVAL: 25,
    PARTICLE_DURATION_MIN: 1.3,
    PARTICLE_DURATION_MAX: 2.2,
    PARTICLE_TRAVEL_DISTANCE: 100,
    PARTICLE_SCALE_MIN: 0.2,
    PARTICLE_SCALE_MAX: 0.6,
    PARTICLE_VISIBLE_DELAY_FACTOR: 0.15,
    PARTICLE_FADE_IN_FACTOR: 0.3,
  },
} as const;

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoLinkRef = useRef<HTMLAnchorElement>(null);
  const logoImageRef = useRef<HTMLImageElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const particleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { contextSafe } = useGSAP({ scope: headerRef });

  const scrollToElement = useCallback((elementId: string) => {
    if (!elementId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleContactClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const isHome = pathname === "/";
      if (isHome) {
        scrollToElement("contact");
      } else {
        router.push("/#contact");
      }
    },
    [pathname, router, scrollToElement],
  );

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const header = headerRef.current;

    const handleScroll = () => {
      if (!header) return;
      const currentScrollPos = window.scrollY;
      const shouldHide =
        currentScrollPos > prevScrollPos &&
        currentScrollPos > ANIMATION_CONFIG.HEADER.SCROLL.THRESHOLD;

      if (shouldHide) {
        header.classList.add(ANIMATION_CONFIG.HEADER.SCROLL.CLASS_HIDDEN);
      } else {
        header.classList.remove(ANIMATION_CONFIG.HEADER.SCROLL.CLASS_HIDDEN);
      }
      prevScrollPos = currentScrollPos;
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoLinkRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: ANIMATION_CONFIG.LOGO.DURATION,
          ease: ANIMATION_CONFIG.LOGO.EASE,
          clearProps: "opacity",
        },
      );
      gsap.fromTo(
        contactButtonRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: ANIMATION_CONFIG.CONTACT.DURATION,
          ease: ANIMATION_CONFIG.CONTACT.EASE,
          clearProps: "opacity",
        },
      );
    }, headerRef);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (particleIntervalRef.current)
        clearInterval(particleIntervalRef.current);
      ctx.revert();
    };
  }, []);

  const createAndAnimateParticle = contextSafe(() => {
    if (!particlesContainerRef.current || !contactButtonRef.current) return;

    const particle = document.createElement("div");
    const buttonRect = contactButtonRef.current.getBoundingClientRect();
    const containerRect = particlesContainerRef.current.getBoundingClientRect();

    const startX =
      buttonRect.width / 2 + (buttonRect.left - containerRect.left);
    const startY = buttonRect.height / 2 + (buttonRect.top - containerRect.top);

    particle.className =
      "absolute w-1 h-1 bg-primary rounded-full pointer-events-none";
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.opacity = "0";
    particle.style.transform = "scale(0)";

    particlesContainerRef.current.appendChild(particle);

    const duration = gsap.utils.random(
      ANIMATION_CONFIG.CONTACT.PARTICLE_DURATION_MIN,
      ANIMATION_CONFIG.CONTACT.PARTICLE_DURATION_MAX,
    );
    const angle = Math.random() * Math.PI * 2;
    const travelDistance =
      ANIMATION_CONFIG.CONTACT.PARTICLE_TRAVEL_DISTANCE *
      (Math.random() * 0.4 + 0.8);
    const endX = Math.cos(angle) * travelDistance;
    const endY = Math.sin(angle) * travelDistance;

    const peakScale = gsap.utils.random(
      ANIMATION_CONFIG.CONTACT.PARTICLE_SCALE_MIN,
      ANIMATION_CONFIG.CONTACT.PARTICLE_SCALE_MAX,
    );
    const visibleDelay =
      duration * ANIMATION_CONFIG.CONTACT.PARTICLE_VISIBLE_DELAY_FACTOR;
    const fadeInDuration =
      duration * ANIMATION_CONFIG.CONTACT.PARTICLE_FADE_IN_FACTOR;
    const moveFadeOutDuration = duration - visibleDelay - fadeInDuration;

    const tl = gsap.timeline({ onComplete: () => particle.remove() });

    tl.to(
      particle,
      {
        x: endX * (visibleDelay / duration),
        y: endY * (visibleDelay / duration),
        duration: visibleDelay,
        ease: "none",
      },
      0,
    );

    tl.to(
      particle,
      {
        opacity: gsap.utils.random(0.6, 1.0),
        scale: peakScale,
        duration: fadeInDuration,
        ease: "power1.out",
      },
      visibleDelay,
    );
    tl.to(
      particle,
      {
        x: `+=${endX * (fadeInDuration / duration)}`,
        y: `+=${endY * (fadeInDuration / duration)}`,
        duration: fadeInDuration,
        ease: "none",
      },
      visibleDelay,
    );

    tl.to(
      particle,
      {
        opacity: 0,
        scale: 0,
        duration: moveFadeOutDuration,
        ease: "power1.in",
      },
      visibleDelay + fadeInDuration,
    );
    tl.to(
      particle,
      {
        x: `+=${endX * (moveFadeOutDuration / duration)}`,
        y: `+=${endY * (moveFadeOutDuration / duration)}`,
        duration: moveFadeOutDuration,
        ease: "none",
      },
      visibleDelay + fadeInDuration,
    );
  });

  const handleButtonHover = contextSafe((isEntering: boolean) => {
    const button = contactButtonRef.current;
    if (!button) return;

    gsap.to(button, {
      "--glow-opacity": isEntering ? 1 : 0,
      "--border-opacity-hover": isEntering ? 0.4 : 0.2,
      duration: ANIMATION_CONFIG.CONTACT.HOVER_DURATION,
      ease: ANIMATION_CONFIG.CONTACT.HOVER_EASE,
      overwrite: true,
    });

    if (isEntering) {
      if (particleIntervalRef.current)
        clearInterval(particleIntervalRef.current);
      particleIntervalRef.current = setInterval(
        createAndAnimateParticle,
        ANIMATION_CONFIG.CONTACT.PARTICLE_INTERVAL,
      );
    } else {
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
        particleIntervalRef.current = null;
      }
    }
  });

  const handleLogoHover = contextSafe((isEntering: boolean) => {
    gsap.to(logoImageRef.current, {
      scale: isEntering ? ANIMATION_CONFIG.LOGO.HOVER_SCALE : 1,
      duration: ANIMATION_CONFIG.LOGO.HOVER_DURATION,
      ease: ANIMATION_CONFIG.LOGO.HOVER_EASE,
      overwrite: true,
    });
  });

  return (
    <header
      ref={headerRef}
      className="sticky top-0 left-0 right-0 z-50 overflow-hidden
                       bg-gradient-to-b from-secondary/80 to-gray-950/90
                       backdrop-blur-md border-b border-neutral/20
                       transition-transform duration-300 ease-in-out"
      style={{ willChange: "transform" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between h-16 md:h-20">
          <Link
            ref={logoLinkRef}
            href="/"
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full"
            onMouseEnter={() => handleLogoHover(true)}
            onMouseLeave={() => handleLogoHover(false)}
            style={{ willChange: "opacity" }}
            aria-label="Homepage"
          >
            <Image
              ref={logoImageRef}
              src="/images/logo.svg"
              alt="Logo"
              width={44}
              height={44}
              priority
              className="rounded-full md:w-[50px] md:h-[50px]"
              style={{ willChange: "transform" }}
            />
          </Link>

          <div className="relative">
            <button
              ref={contactButtonRef}
              className="contact-button relative inline-flex items-center justify-center px-5 py-2 md:px-6 md:py-2.5 rounded-lg
                                    font-semibold group
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 z-10 overflow-visible"
              style={
                {
                  "--glow-opacity": 0,
                  "--border-opacity-hover": 0.2,
                  willChange: "opacity",
                } as React.CSSProperties
              }
              onMouseEnter={() => handleButtonHover(true)}
              onMouseLeave={() => handleButtonHover(false)}
              onClick={handleContactClick}
            >
              <span
                className="absolute inset-0 z-0 bg-gradient-to-br from-neutral/70 via-secondary/60 to-neutral/70 backdrop-blur-sm rounded-lg border border-primary/20 group-hover:border-primary/[var(--border-opacity-hover)]"
                style={{
                  borderColor: "rgba(0, 255, 159, var(--border-opacity-hover))",
                }}
                aria-hidden="true"
              />

              <span
                className="relative z-10 text-light/90 group-hover:text-light"
                style={
                  {
                    textShadow:
                      "0 0 8px rgba(0, 255, 159, var(--glow-opacity))",
                    willChange: "opacity, text-shadow",
                  } as React.CSSProperties
                }
              >
                Contact Me
              </span>
            </button>
            <div
              ref={particlesContainerRef}
              className="absolute inset-0 z-0 pointer-events-none overflow-visible"
              aria-hidden="true"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
