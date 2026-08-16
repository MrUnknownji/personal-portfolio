"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";

const NAV_ITEMS = [
  { name: "Home", link: "/" },
  { name: "About", link: "/#about" },
  { name: "Projects", link: "/my-projects" },
  { name: "Skills", link: "/#skills" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pendingSectionRef = useRef<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const scrollToSection = useCallback((element: HTMLElement) => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const headerHeight =
      document.querySelector("header")?.getBoundingClientRect().height ?? 72;

    window.scrollTo({
      top: Math.max(
        0,
        window.scrollY + element.getBoundingClientRect().top - headerHeight - 20,
      ),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const sectionId =
      pendingSectionRef.current ||
      (window.location.hash
        ? decodeURIComponent(window.location.hash.slice(1))
        : null);
    if (!sectionId) return;

    let frame = 0;
    let attempts = 0;
    const revealSection = () => {
      const element = document.getElementById(sectionId);
      if (!element && attempts < 60) {
        attempts += 1;
        frame = requestAnimationFrame(revealSection);
        return;
      }
      if (!element) return;

      pendingSectionRef.current = null;
      window.history.replaceState(null, "", `/#${sectionId}`);
      scrollToSection(element);
    };
    frame = requestAnimationFrame(revealSection);
    return () => cancelAnimationFrame(frame);
  }, [pathname, scrollToSection]);

  const handleNavClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, link: string) => {
      if (link.startsWith("/#")) {
        event.preventDefault();
        const sectionId = link.slice(2);
        const element = document.getElementById(sectionId);

        if (pathname === "/" && element) {
          scrollToSection(element);
          window.history.replaceState(null, "", link);
        } else {
          pendingSectionRef.current = sectionId;
          router.push("/", { scroll: false });
        }
      }
      setIsMobileMenuOpen(false);
    },
    [pathname, router, scrollToSection],
  );

  const handleContactClick = useCallback(() => {
    const element = document.getElementById("contact");
    if (pathname === "/" && element) {
      scrollToSection(element);
      window.history.replaceState(null, "", "/#contact");
    } else {
      pendingSectionRef.current = "contact";
      router.push("/", { scroll: false });
    }
    setIsMobileMenuOpen(false);
  }, [pathname, router, scrollToSection]);

  const navLinkClasses =
    "relative z-10 rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary navigation"
        className={`mx-auto hidden items-center justify-between bg-[radial-gradient(circle_at_50%_0%,rgb(25,17,12),rgb(10,10,10)_72%)] px-6 py-3 transition-[max-width,border-radius,border-color,margin,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex ${
          isScrolled
            ? "mt-2 max-w-4xl rounded-full border border-border/70 shadow-[0_14px_40px_rgba(0,0,0,0.28)]"
            : "mt-0 max-w-[100vw] rounded-none border border-transparent border-b-white/10 shadow-none"
        }`}
      >
        <Link
          href="/"
          prefetch={false}
          className="group relative z-20 flex items-center gap-2 rounded-lg transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Sandeep homepage"
        >
          <Image src="/images/logo.svg" alt="" width={40} height={40} priority className="size-9" />
          <span
            className={`text-lg font-semibold tracking-tight text-foreground transition-opacity ${isScrolled ? "opacity-0" : "opacity-100"}`}
            aria-hidden={isScrolled}
          >
            Sandeep
          </span>
        </Link>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              prefetch={false}
              onClick={(event) => handleNavClick(event, item.link)}
              className={navLinkClasses}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={handleContactClick}
          className="group relative z-20 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-dark transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
        >
          Contact Me
          <FiArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </nav>

      <nav
        aria-label="Mobile navigation"
        className={`mx-auto flex flex-col bg-[radial-gradient(circle_at_50%_0%,rgb(25,17,12),rgb(10,10,10)_72%)] px-4 py-3 transition-[width,border-radius,border-color,margin,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          isScrolled || isMobileMenuOpen
            ? "mt-2 w-[92%] rounded-2xl border border-border/70 shadow-[0_14px_36px_rgba(0,0,0,0.3)]"
            : "mt-0 w-full rounded-none border border-transparent border-b-white/10 shadow-none"
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Sandeep homepage"
          >
            <Image src="/images/logo.svg" alt="" width={36} height={36} priority className="size-9" />
            <span className="font-semibold tracking-tight text-foreground">Sandeep</span>
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            className="min-h-11 min-w-11 rounded-lg p-2 text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isMobileMenuOpen ? <FiX className="size-6" /> : <FiMenu className="size-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-navigation-menu" className="pb-2 pt-4">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  prefetch={false}
                  onClick={(event) => handleNavClick(event, item.link)}
                  className="rounded-lg px-4 py-3 font-medium text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-2 border-t border-border/30 pt-2">
                <button
                  type="button"
                  onClick={handleContactClick}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
                >
                  Contact Me
                  <FiArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default React.memo(Header);
