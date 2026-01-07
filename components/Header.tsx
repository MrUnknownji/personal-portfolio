"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollToPlugin);

const NAV_ITEMS = [
  { name: "Home", link: "/" },
  { name: "About", link: "/#about" },
  { name: "Projects", link: "/my-projects" },
  { name: "Skills", link: "/#skills" },
];

const Header = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);
  const hoverBgRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    if (desktopNavRef.current) {
      gsap.to(desktopNavRef.current, {
        width: isScrolled ? "60%" : "100%",
        y: isScrolled ? 8 : 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    if (mobileNavRef.current) {
      gsap.to(mobileNavRef.current, {
        width: isScrolled ? "92%" : "100%",
        y: isScrolled ? 8 : 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    if (logoTextRef.current) {
      gsap.to(logoTextRef.current, {
        opacity: isScrolled ? 0 : 1,
        x: isScrolled ? -10 : 0,
        duration: 0.2,
      });
    }
  }, [isScrolled]);

  useGSAP(() => {
    if (hoveredIndex !== null && hoverBgRef.current && navItemsRef.current[hoveredIndex]) {
      const navItem = navItemsRef.current[hoveredIndex];
      const navContainer = navItem?.parentElement;
      if (navItem && navContainer) {
        const itemRect = navItem.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        gsap.to(hoverBgRef.current, {
          x: itemRect.left - containerRect.left,
          width: itemRect.width,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        });
      }
    } else if (hoverBgRef.current) {
      gsap.to(hoverBgRef.current, { opacity: 0, duration: 0.2 });
    }
  }, [hoveredIndex]);
  useGSAP(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        const items = mobileMenuRef.current.querySelectorAll(".mobile-nav-item");
        gsap.fromTo(items,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith("/#")) {
      e.preventDefault();
      const sectionId = link.replace("/#", "");
      const element = document.getElementById(sectionId);

      if (pathname === "/" && element) {
        gsap.to(window, {
          scrollTo: { y: element, offsetY: 100 },
          duration: 1,
          ease: "power2.inOut",
        });
      } else {
        router.push(link);
      }
    }
    setIsMobileMenuOpen(false);
  }, [pathname, router]);

  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("contact");
    if (pathname === "/" && element) {
      gsap.to(window, {
        scrollTo: { y: element, offsetY: 100 },
        duration: 1,
        ease: "power2.inOut",
      });
    } else {
      router.push("/#contact");
    }
    setIsMobileMenuOpen(false);
  }, [pathname, router]);

  const handleLogoHover = useCallback((e: React.MouseEvent, enter: boolean) => {
    gsap.to(e.currentTarget, {
      scale: enter ? 1.05 : 1,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  const handleButtonHover = useCallback((e: React.MouseEvent, enter: boolean) => {
    gsap.to(e.currentTarget, {
      scale: enter ? 1.02 : 1,
      duration: 0.15,
      ease: "power2.out",
    });
  }, []);

  return (
    <header ref={headerRef} className="fixed top-0 inset-x-0 z-50 pt-4">
      <nav
        ref={desktopNavRef}
        style={{ minWidth: isScrolled ? "700px" : "auto" }}
        className={cn(
          "hidden lg:flex mx-auto max-w-7xl items-center justify-between px-6 py-3 rounded-full transition-colors duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border border-border/50 shadow-lg shadow-black/10"
            : "bg-transparent"
        )}
      >
        <Link
          href="/"
          className="relative z-20 flex items-center gap-2 group"
          aria-label="Homepage"
          onMouseEnter={(e) => handleLogoHover(e, true)}
          onMouseLeave={(e) => handleLogoHover(e, false)}
        >
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            priority
            className="w-9 h-9"
          />
          <span
            ref={logoTextRef}
            className="text-foreground font-semibold text-lg tracking-tight"
          >
            Sandeep
          </span>
        </Link>

        <div
          onMouseLeave={() => setHoveredIndex(null)}
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1"
        >
          <div
            ref={hoverBgRef}
            className="absolute h-full bg-foreground/5 rounded-full pointer-events-none"
            style={{ opacity: 0, left: 0 }}
          />
          {NAV_ITEMS.map((item, idx) => (
            <Link
              key={item.name}
              href={item.link}
              ref={(el) => { navItemsRef.current[idx] = el; }}
              onClick={(e) => handleNavClick(e, item.link)}
              onMouseEnter={() => setHoveredIndex(idx)}
              className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors z-10"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button
          onClick={handleContactClick}
          onMouseEnter={(e) => handleButtonHover(e, true)}
          onMouseLeave={(e) => handleButtonHover(e, false)}
          onMouseDown={(e) => gsap.to(e.currentTarget, { scale: 0.98, duration: 0.1 })}
          onMouseUp={(e) => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.1 })}
          className="relative z-20 group flex items-center gap-2 px-5 py-2.5 rounded-full
                     bg-primary text-dark font-medium text-sm
                     shadow-lg shadow-primary/20
                     transition-shadow duration-300"
        >
          <span>Contact Me</span>
          <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </nav>

      <nav
        ref={mobileNavRef}
        className={cn(
          "lg:hidden mx-auto flex flex-col px-4 py-3 rounded-2xl transition-colors duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border border-border/50 shadow-lg shadow-black/10"
            : "bg-transparent"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2" aria-label="Homepage">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={36}
              height={36}
              priority
              className="w-9 h-9"
            />
            <span className="text-foreground font-semibold tracking-tight">Sandeep</span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onMouseDown={(e) => gsap.to(e.currentTarget, { scale: 0.9, duration: 0.1 })}
            onMouseUp={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.1 })}
            className="p-2 rounded-lg text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        <div
          ref={mobileMenuRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="pt-4 pb-2 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.name} className="mobile-nav-item">
                <Link
                  href={item.link}
                  onClick={(e) => handleNavClick(e, item.link)}
                  className="block px-4 py-3 text-foreground/80 hover:text-foreground
                             hover:bg-foreground/5 rounded-lg transition-colors font-medium"
                >
                  {item.name}
                </Link>
              </div>
            ))}

            <div className="mobile-nav-item pt-2 mt-2 border-t border-border/30">
              <button
                onClick={handleContactClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-3
                           bg-primary text-dark font-medium rounded-lg
                           shadow-[0_0_15px_rgba(0,255,159,0.3)]"
              >
                <span>Contact Me</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default React.memo(Header);
