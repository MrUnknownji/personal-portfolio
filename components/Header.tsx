"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const header = headerRef.current;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (header) {
        header.style.transform = `translateY(${
          prevScrollPos > currentScrollPos || currentScrollPos < 10
            ? "0"
            : "-100%"
        })`;
      }
      prevScrollPos = currentScrollPos;
    };

    // Initial animations
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.from(contactRef.current, {
        opacity: 0,
        x: 20,
        duration: 0.6,
        ease: "power2.out",
      });
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out"
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="relative flex items-center justify-between">
          <div ref={logoRef}>
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={50}
                height={50}
                priority
                className="rounded-xl"
              />
            </Link>
          </div>

          <button
            ref={contactRef}
            className="relative group overflow-hidden bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-xl
              border border-gray-700 shadow-lg transition-all duration-300
              hover:border-primary/50 hover:shadow-primary/20 hover:bg-gray-800"
          >
            {/* Glass effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              />
            </div>

            {/* Button text */}
            <span className="relative z-10">Contact Me</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
