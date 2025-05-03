"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoLinkRef = useRef<HTMLAnchorElement>(null);
  const logoImageRef = useRef<HTMLImageElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const contactButtonIconWrapperRef = useRef<HTMLSpanElement>(null);
  const prevScrollPosRef = useRef<number>(0);
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
    const header = headerRef.current;
    if (!header) return;

    const scrollThreshold = 10;
    let isHeaderHidden = false;

    const handleScrollVanilla = () => {
      const currentScrollPos = window.scrollY;
      const scrollingDown = currentScrollPos > prevScrollPosRef.current;
      const shouldHide = scrollingDown && currentScrollPos > scrollThreshold;

      if (shouldHide !== isHeaderHidden) {
        isHeaderHidden = shouldHide;
        header.classList.toggle("header-hidden", shouldHide);
      }
      prevScrollPosRef.current = currentScrollPos;
    };

    prevScrollPosRef.current = window.scrollY;
    isHeaderHidden = window.scrollY > scrollThreshold;
    header.classList.toggle("header-hidden", isHeaderHidden);

    window.addEventListener("scroll", handleScrollVanilla, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollVanilla);
    };
  }, []);


  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50
                 bg-secondary
                 border-b border-neutral/20 transition-transform duration-300 ease-in-out"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between h-16 md:h-20">
          <Link
            ref={logoLinkRef}
            href="/"
            className="relative flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full z-10"
            aria-label="Homepage"
          >
            <Image
              ref={logoImageRef}
              src="/images/logo.svg"
              alt="Logo"
              width={44}
              height={44}
              priority
              className="md:w-[50px] md:h-[50px] transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </Link>

          <div className="relative z-10">
            <button
              ref={contactButtonRef}
              className="contact-button relative inline-flex items-center justify-center px-5 py-2 md:px-6 md:py-2.5 rounded-lg
                         bg-neutral border border-primary/20 text-light/90
                         font-medium group
                         hover:text-light hover:bg-neutral-hover hover:border-primary/50 hover:scale-[1.015]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                         transition-all duration-300 ease-out"
              onClick={handleContactClick}
            >
              <span className="relative z-10">Contact Me</span>
              <span
                ref={contactButtonIconWrapperRef}
                className="inline-block ml-2 transition-transform duration-300 ease-out group-hover:translate-x-[3px]"
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