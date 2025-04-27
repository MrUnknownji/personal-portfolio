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
    Y_OFFSET: 40,
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
      className="w-full bg-[linear-gradient(180deg,_var(--color-secondary)_0%,_rgba(var(--color-secondary-rgb),0.95)_40%,_rgba(var(--color-dark-rgb),0.92)_70%,_var(--color-dark)_100%)] border-t border-neutral/20 py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('/noise.svg')] bg-repeat"></div>
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

      <div className="container mx-auto relative z-10 flex flex-col items-center space-y-8 md:space-y-10">
        <div className="animate-copyright text-center text-muted text-sm">
          <p>© {currentYear} Sandeep Kumar. All rights reserved.</p>
        </div>

        <nav className="animate-links">
          <ul className="flex flex-wrap justify-center items-center gap-x-5 gap-y-3 md:gap-x-8">
            {QUICK_LINKS.map((link) => {
              const isExternal = isExternalNavigation(link);
              return (
                <li key={link.text}>
                  <a
                    href={link.href}
                    onClick={(e) => handleQuickLinkClick(e, link)}
                    className="group relative inline-flex items-center text-muted transition-colors duration-300 ease-out
                                   hover:text-primary focus-visible:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1 py-1 text-sm"
                  >
                    <span className="relative z-10">{link.text}</span>
                    <span
                      className={`inline-block transition-all duration-300 ease-out overflow-hidden
                                  ${
                                    isExternal
                                      ? "w-0 ml-0 group-hover:w-3.5 group-hover:ml-1 group-focus-visible:w-3.5 group-focus-visible:ml-1"
                                      : "w-0 ml-0"
                                  }`}
                      aria-hidden="true"
                    >
                      <FiArrowUpRight
                        className={`h-3.5 transition-all duration-300 ease-out transform
                                    ${
                                      isExternal
                                        ? "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
                                        : "opacity-0"
                                    }`}
                        style={{ width: "0.875rem" }}
                      />
                    </span>
                    <span
                      className={`absolute bottom-0 left-0 block h-0.5 bg-gradient-to-r from-primary to-accent
                                     w-full scale-x-0 transition-transform duration-300 ease-out z-0
                                     group-hover:scale-x-100 group-focus-visible:scale-x-100
                                     ${isExternal ? "origin-left" : "origin-center"}`}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="animate-built-with text-center pt-4">
          <p className="text-xs text-muted mb-3">Crafted with</p>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5">
            {BUILT_WITH.map((tech, index) => (
              <React.Fragment key={tech}>
                <span
                  className="text-xs font-medium text-light/20 transition-colors duration-200 hover:text-light cursor-default"
                  style={{ willChange: "color" }}
                >
                  {tech}
                </span>
                {index < BUILT_WITH.length - 1 && (
                  <span className="text-neutral/40 text-xs" aria-hidden="true">
                    •
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
