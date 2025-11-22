"use client";
import React, { useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiArrowUpRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  SCROLL_TRIGGER: {
    START: "top 95%",
    END: "bottom 90%",
    TOGGLE_ACTIONS: "play none none reverse",
  },
  ENTRANCE: {
    DURATION: 0.8,
    STAGGER: 0.1,
    Y_OFFSET: 30,
    OPACITY: 0,
    EASE: "power3.out",
  },
} as const;

const QUICK_LINKS = [
  { href: "/", id: "", text: "Home" },
  { href: "/#about", id: "about", text: "About" },
  { href: "/my-projects", id: "", text: "Projects" },
  { href: "/#contact", id: "contact", text: "Contact" },
];

const BUILT_WITH = ["Next.js", "Tailwind CSS", "GSAP", "TypeScript"];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const currentYear: number = new Date().getFullYear();
  const pathname = usePathname();
  const router = useRouter();

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

  const handleQuickLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof QUICK_LINKS)[0]) => {
      e.preventDefault();
      const isHome = pathname === "/";
      const isProjectsPage = pathname === "/my-projects";

      if (link.text === "Home") {
        if (isHome) scrollToElement("");
        else router.push("/");
      } else if (link.text === "Projects") {
        if (isProjectsPage) scrollToElement("");
        else router.push("/my-projects");
      } else if (link.id) {
        if (isHome) scrollToElement(link.id);
        else router.push(`/#${link.id}`);
      } else {
        router.push(link.href);
      }
    },
    [pathname, router, scrollToElement],
  );

  const isExternalNavigation = useCallback(
    (link: (typeof QUICK_LINKS)[0]): boolean => {
      const isHome = pathname === "/";
      const isProjectsPage = pathname === "/my-projects";

      if (link.text === "Home" && !isHome) return true;
      if (link.text === "Projects" && !isProjectsPage) return true;
      if (link.id && !isHome) return true;
      if (!link.id && link.href !== "/" && link.href !== "/my-projects")
        return true;

      return false;
    },
    [pathname],
  );

  useGSAP(
    () => {
      const elementsToAnimate = gsap.utils.toArray<HTMLElement>(
        footerRef.current?.querySelectorAll(
          ".animate-copyright, .animate-links, .animate-built-with",
        ) ?? [],
      );

      if (elementsToAnimate.length === 0) return;

      gsap.set(elementsToAnimate, {
        opacity: ANIMATION_CONFIG.ENTRANCE.OPACITY,
        y: ANIMATION_CONFIG.ENTRANCE.Y_OFFSET,
        force3D: true,
        willChange: "transform, opacity",
      });

      gsap.to(elementsToAnimate, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.ENTRANCE.DURATION,
        stagger: ANIMATION_CONFIG.ENTRANCE.STAGGER,
        ease: ANIMATION_CONFIG.ENTRANCE.EASE,
        scrollTrigger: {
          trigger: footerRef.current,
          start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
          end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
          toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
          markers: false,
        },
        clearProps: "all",
        force3D: true,
      });
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="w-full bg-dark border-t border-white/5 py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto relative z-10 flex flex-col items-center space-y-10">

        {/* Navigation Links */}
        <nav className="animate-links">
          <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {QUICK_LINKS.map((link) => {
              const isExternal = isExternalNavigation(link);
              return (
                <li key={link.text}>
                  <a
                    href={link.href}
                    onClick={(e) => handleQuickLinkClick(e, link)}
                    className="group relative flex items-center gap-1.5 text-muted hover:text-primary transition-colors duration-300 px-2 py-1 text-sm font-medium"
                  >
                    <span className="relative z-10">{link.text}</span>
                    <FiArrowUpRight
                      className={`w-3 h-3 transition-transform duration-300
                                  ${isExternal ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : ""}
                                  ${!isExternal ? "opacity-0 w-0" : "opacity-100"}`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tech Stack */}
        <div className="animate-built-with flex flex-col items-center gap-3">
          <p className="text-xs font-medium text-muted/50 uppercase tracking-widest">Crafted with</p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {BUILT_WITH.map((tech, index) => (
              <div key={tech} className="flex items-center">
                <span className="text-xs font-medium text-light/40 hover:text-primary/80 transition-colors duration-300 cursor-default">
                  {tech}
                </span>
                {index < BUILT_WITH.length - 1 && (
                  <span className="mx-3 w-1 h-1 bg-white/10 rounded-full" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="animate-copyright text-center pt-4 border-t border-white/5 w-full max-w-xs">
          <p className="text-xs text-muted/40">
            © {currentYear} Sandeep Kumar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
