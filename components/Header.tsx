"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname, useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";

const ANIMATION_CONFIG = {
  HEADER: {
    DURATION: 0.3,
    EASE: "power2.inOut",
    SCROLL: { THRESHOLD: 10 },
  },
  LOGO: {
    DURATION: 0.6,
    EASE: "power2.out",
    HOVER_DURATION: 0.3,
    HOVER_EASE: "power2.out",
    HOVER_SCALE: 1.05,
    PARTICLE_INTERVAL: 55,
    PARTICLE_DURATION_MIN: 1.2,
    PARTICLE_DURATION_MAX: 2.0,
    PARTICLE_TRAVEL_DISTANCE: 60,
    PARTICLE_SCALE_MIN: 0.15,
    PARTICLE_SCALE_MAX: 0.4,
    PARTICLE_VISIBLE_DELAY_FACTOR: 0.1,
    PARTICLE_FADE_IN_FACTOR: 0.25,
  },
  CONTACT: {
    DURATION: 0.6,
    EASE: "power2.out",
    HOVER_DURATION: 0.3,
    HOVER_EASE: "power3.out",
    HOVER_SCALE: 1.015,
    PARTICLE_INTERVAL: 30,
    PARTICLE_DURATION_MIN: 1.3,
    PARTICLE_DURATION_MAX: 2.2,
    PARTICLE_TRAVEL_DISTANCE: 80,
    PARTICLE_SCALE_MIN: 0.2,
    PARTICLE_SCALE_MAX: 0.5,
    PARTICLE_VISIBLE_DELAY_FACTOR: 0.15,
    PARTICLE_FADE_IN_FACTOR: 0.3,
    HOVER_BG_COLOR: "var(--color-neutral-hover, #3f3f46)",
    INITIAL_BG_COLOR: "var(--color-neutral, #27272a)",
    HOVER_BORDER_COLOR: "rgba(0, 255, 159, 0.5)",
    INITIAL_BORDER_COLOR: "rgba(0, 255, 159, 0.2)",
  },
} as const;

type ParticleOrigin = "logo" | "contact";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoLinkRef = useRef<HTMLAnchorElement>(null);
  const logoImageRef = useRef<HTMLImageElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const contactButtonIconWrapperRef = useRef<HTMLSpanElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const contactParticleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const logoParticleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevScrollPosRef = useRef<number>(0);
  const isHeaderHiddenRef = useRef<boolean>(false);
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

  const createAndAnimateParticle = contextSafe((origin: ParticleOrigin) => {
    if (!particlesContainerRef.current) return;

    const originElement =
      origin === "logo" ? logoLinkRef.current : contactButtonRef.current;
    if (!originElement) return;

    const config =
      origin === "logo" ? ANIMATION_CONFIG.LOGO : ANIMATION_CONFIG.CONTACT;

    const particle = document.createElement("div");
    const originRect = originElement.getBoundingClientRect();
    const containerRect = particlesContainerRef.current.getBoundingClientRect();

    const startX =
      originRect.width / 2 + (originRect.left - containerRect.left);
    const startY = originRect.height / 2 + (originRect.top - containerRect.top);

    particle.className = `absolute w-1 h-1 ${
      origin === "logo" ? "bg-accent/70" : "bg-primary/90"
    } rounded-full pointer-events-none mix-blend-lighten`;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.opacity = "0";
    particle.style.transform = "scale(0)";
    particle.style.filter = "blur(0.5px)";

    particlesContainerRef.current.appendChild(particle);

    const duration = gsap.utils.random(
      config.PARTICLE_DURATION_MIN,
      config.PARTICLE_DURATION_MAX,
    );
    const angle = Math.random() * Math.PI * 2;
    const travelDistance =
      config.PARTICLE_TRAVEL_DISTANCE * (Math.random() * 0.4 + 0.8);
    const endX = Math.cos(angle) * travelDistance;
    const endY = Math.sin(angle) * travelDistance;

    const peakScale = gsap.utils.random(
      config.PARTICLE_SCALE_MIN,
      config.PARTICLE_SCALE_MAX,
    );
    const visibleDelay = duration * config.PARTICLE_VISIBLE_DELAY_FACTOR;
    const fadeInDuration = duration * config.PARTICLE_FADE_IN_FACTOR;
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
    )
      .to(
        particle,
        {
          opacity: gsap.utils.random(0.6, 1.0),
          scale: peakScale,
          filter: "blur(0px)",
          duration: fadeInDuration,
          ease: "power1.out",
        },
        visibleDelay,
      )
      .to(
        particle,
        {
          x: `+=${endX * (fadeInDuration / duration)}`,
          y: `+=${endY * (fadeInDuration / duration)}`,
          duration: fadeInDuration,
          ease: "none",
        },
        visibleDelay,
      )
      .to(
        particle,
        {
          opacity: 0,
          scale: 0,
          filter: "blur(1px)",
          duration: moveFadeOutDuration,
          ease: "power1.in",
        },
        visibleDelay + fadeInDuration,
      )
      .to(
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

  const handleScroll = contextSafe(() => {
    const header = headerRef.current;
    if (!header) return;

    const currentScrollPos = window.scrollY;
    const scrollingDown = currentScrollPos > prevScrollPosRef.current;
    const shouldHide =
      scrollingDown && currentScrollPos > ANIMATION_CONFIG.HEADER.SCROLL.THRESHOLD;

    if (shouldHide !== isHeaderHiddenRef.current) {
      isHeaderHiddenRef.current = shouldHide;
      gsap.to(header, {
        yPercent: shouldHide ? -100 : 0,
        duration: ANIMATION_CONFIG.HEADER.DURATION,
        ease: ANIMATION_CONFIG.HEADER.EASE,
        overwrite: true,
      });
    }

    prevScrollPosRef.current = currentScrollPos;
  });

  useEffect(() => {
    prevScrollPosRef.current = window.scrollY;
    isHeaderHiddenRef.current = window.scrollY > ANIMATION_CONFIG.HEADER.SCROLL.THRESHOLD;
    if (headerRef.current && isHeaderHiddenRef.current) {
        gsap.set(headerRef.current, { yPercent: -100 });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    if (logoParticleIntervalRef.current)
      clearInterval(logoParticleIntervalRef.current);
    logoParticleIntervalRef.current = setInterval(
      () => createAndAnimateParticle("logo"),
      ANIMATION_CONFIG.LOGO.PARTICLE_INTERVAL,
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (contactParticleIntervalRef.current)
        clearInterval(contactParticleIntervalRef.current);
      if (logoParticleIntervalRef.current)
        clearInterval(logoParticleIntervalRef.current);
    };
  }, [createAndAnimateParticle, handleScroll]);

  useGSAP(
    () => {
      gsap.fromTo(
        logoLinkRef.current,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.LOGO.DURATION,
          ease: ANIMATION_CONFIG.LOGO.EASE,
          delay: 0.1,
          clearProps: "all",
        },
      );
      gsap.fromTo(
        contactButtonRef.current,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.CONTACT.DURATION,
          ease: ANIMATION_CONFIG.CONTACT.EASE,
          delay: 0.2,
          clearProps: "all",
        },
      );
    },
    { scope: headerRef },
  );

  const handleContactButtonHover = contextSafe((isEntering: boolean) => {
    const button = contactButtonRef.current;
    const iconWrapper = contactButtonIconWrapperRef.current;
    if (!button) return;

    gsap.to(button, {
      scale: isEntering ? ANIMATION_CONFIG.CONTACT.HOVER_SCALE : 1,
      backgroundColor: isEntering
        ? ANIMATION_CONFIG.CONTACT.HOVER_BG_COLOR
        : ANIMATION_CONFIG.CONTACT.INITIAL_BG_COLOR,
      borderColor: isEntering
        ? ANIMATION_CONFIG.CONTACT.HOVER_BORDER_COLOR
        : ANIMATION_CONFIG.CONTACT.INITIAL_BORDER_COLOR,
      duration: ANIMATION_CONFIG.CONTACT.HOVER_DURATION,
      ease: ANIMATION_CONFIG.CONTACT.HOVER_EASE,
      overwrite: true,
    });

    if (iconWrapper) {
      gsap.to(iconWrapper, {
        x: isEntering ? 3 : 0,
        duration: ANIMATION_CONFIG.CONTACT.HOVER_DURATION,
        ease: ANIMATION_CONFIG.CONTACT.HOVER_EASE,
        overwrite: true,
      });
    }

    if (isEntering) {
      if (contactParticleIntervalRef.current)
        clearInterval(contactParticleIntervalRef.current);
      contactParticleIntervalRef.current = setInterval(
        () => createAndAnimateParticle("contact"),
        ANIMATION_CONFIG.CONTACT.PARTICLE_INTERVAL,
      );
    } else {
      if (contactParticleIntervalRef.current) {
        clearInterval(contactParticleIntervalRef.current);
        contactParticleIntervalRef.current = null;
      }
    }
  });

  const handleLogoScaleHover = contextSafe((isEntering: boolean) => {
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
      className="fixed top-0 left-0 right-0 z-50 transform-gpu
                 bg-secondary
                 border-b border-neutral/20"
      style={{ willChange: "transform" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between h-16 md:h-20">
          <div
            ref={particlesContainerRef}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
            aria-hidden="true"
          />
          <Link
            ref={logoLinkRef}
            href="/"
            className="relative flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full z-10"
            onMouseEnter={() => handleLogoScaleHover(true)}
            onMouseLeave={() => handleLogoScaleHover(false)}
            style={{ willChange: "opacity, transform" }}
            aria-label="Homepage"
          >
            <Image
              ref={logoImageRef}
              src="/images/logo.svg"
              alt="Logo"
              width={44}
              height={44}
              priority
              className="md:w-[50px] md:h-[50px]"
              style={{ willChange: "transform" }}
            />
          </Link>

          <div className="relative z-10">
            <button
              ref={contactButtonRef}
              className="contact-button relative inline-flex items-center justify-center px-5 py-2 md:px-6 md:py-2.5 rounded-lg
                         bg-neutral
                         border border-primary/20 text-light/90
                         font-medium group
                         hover:text-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden"
              style={{
                willChange: "transform, background-color, border-color",
                backgroundColor: ANIMATION_CONFIG.CONTACT.INITIAL_BG_COLOR,
              }}
              onMouseEnter={() => handleContactButtonHover(true)}
              onMouseLeave={() => handleContactButtonHover(false)}
              onClick={handleContactClick}
            >
              <span className="relative z-10">Contact Me</span>
              <span
                ref={contactButtonIconWrapperRef}
                className="inline-block ml-2"
                style={{ willChange: "transform" }}
              >
                <FiArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
