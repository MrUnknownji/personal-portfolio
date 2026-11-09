"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";

const links = [
  { label: "Projects", href: "/my-projects" },
  { label: "Lab", href: "/#lab" },
  { label: "About", href: "/#about" },
  { label: "Build", href: "/#build" },
  { label: "Contact", href: "/#contact" },
];
const quickLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Header({
  workPreviewImage,
  projectCount,
}: {
  workPreviewImage: string;
  projectCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [sectionLabel, setSectionLabel] = useState("00 / INTRO");
  const [preview, setPreview] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pendingSection = useRef<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const navigationLinks = pathname === "/quick" ? quickLinks : links;

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) > 7) setCompact(y > 260 && y > lastY);
        lastY = y;
        if (pathname === "/") {
          const sections = [
            ["contact", "05 / CONTACT"],
            ["build", "04 / HOW I BUILD"],
            ["about", "03 / ABOUT"],
            ["lab", "02 / LAB"],
            ["work", "01 / WORK"],
          ] as const;
          setSectionLabel(
            sections.find(
              ([id]) =>
                (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) < 180,
            )?.[1] || "00 / INTRO",
          );
        } else
          setSectionLabel(
            pathname === "/my-projects"
              ? "01 / ARCHIVE"
              : pathname === "/motion"
                ? "MOTION / VISUAL WORK"
                : pathname === "/quick"
                  ? "QUICK / VIEW"
                  : "01 / CASE STUDY",
          );
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // The preview card sits under the hovered link (not the cursor), so it moves once per link.
  const placePreview = (link: HTMLElement) => {
    if (!previewRef.current) return;
    const rect = link.getBoundingClientRect();
    const header = link.closest("header")?.getBoundingClientRect();
    previewRef.current.style.left = `${Math.max(16, Math.min(window.innerWidth - 236, rect.left))}px`;
    previewRef.current.style.top = `${(header?.bottom ?? rect.bottom) + 10}px`;
  };

  const scrollToSection = useCallback((section: HTMLElement, instant = false) => {
    const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 72;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: Math.max(0, window.scrollY + section.getBoundingClientRect().top - headerHeight - 18),
      behavior: reduceMotion || instant ? "instant" : "smooth",
    });
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const sectionId =
      pendingSection.current ||
      (window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : null);
    if (!sectionId) return;
    let frame = 0;
    let attempts = 0;
    const revealSection = () => {
      const section = document.getElementById(sectionId);
      if (!section && attempts++ < 120) {
        frame = requestAnimationFrame(revealSection);
        return;
      }
      if (!section) return;
      pendingSection.current = null;
      window.history.replaceState(null, "", `/#${sectionId}`);
      requestAnimationFrame(() => scrollToSection(section, true));
    };
    frame = requestAnimationFrame(revealSection);
    return () => cancelAnimationFrame(frame);
  }, [pathname, scrollToSection]);

  const handleNav = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    setPreview(null);
    if (!href.startsWith("/#")) return;
    event.preventDefault();
    const sectionId = href.slice(2);
    const section = document.getElementById(sectionId);
    if (pathname === "/" && section) {
      window.history.replaceState(null, "", href);
      scrollToSection(section);
    } else {
      pendingSection.current = sectionId;
      router.push("/", { scroll: false });
    }
  };

  useEffect(() => {
    if (!open) return;
    // While the mobile menu is open: lock page scroll, keep Tab inside the menu, close on Escape.
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const focusables = () =>
      [
        menuButton.current,
        ...Array.from(document.querySelectorAll<HTMLElement>("#print-mobile-nav a")),
      ].filter((element): element is HTMLElement => Boolean(element));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey
        ? index <= 0
          ? items.length - 1
          : index - 1
        : index === items.length - 1
          ? 0
          : index + 1;
      event.preventDefault();
      items[next]?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="print-header" data-compact={compact}>
      <div className="print-topbar">
        <Link
          href="/"
          className="print-brand"
          onClick={() => setOpen(false)}
          aria-label="Sandeep Kumar homepage"
        >
          Sandeep Kumar <span>Full-stack developer</span>
        </Link>
        <span className="print-header-section" aria-live="off">
          {sectionLabel}
        </span>
        <nav className="print-desktop-nav" aria-label="Primary navigation">
          {navigationLinks.map((link, index) => (
            <Link
              href={link.href}
              key={link.label}
              onClick={(event) => handleNav(event, link.href)}
              onPointerEnter={(event) => {
                if (event.pointerType === "touch" || pathname === "/quick") return;
                placePreview(event.currentTarget);
                setPreview(link.label);
              }}
              onPointerLeave={() => setPreview(null)}
            >
              <span>0{index + 1}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <nav className="print-view-switch" aria-label="Profile shortcuts">
          {pathname === "/quick" ? (
            <Link href="/">Full portfolio</Link>
          ) : (
            <Link href="/quick">1-page profile</Link>
          )}
          <a href={PROFILE.resumePath} download>
            Résumé PDF <span aria-hidden="true">↓</span>
          </a>
          <a
            className="print-header-email"
            href={`mailto:${SITE_CONFIG.email}`}
            aria-label="Email Sandeep"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 1.5 8 6 8-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </nav>
        <span className="print-availability">
          <i /> Available for opportunities
        </span>
        <button
          className="print-menu-button"
          ref={menuButton}
          type="button"
          aria-expanded={open}
          aria-controls="print-mobile-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close −" : "Menu +"}
        </button>
      </div>
      {open && (
        <nav id="print-mobile-nav" className="print-mobile-nav" aria-label="Mobile navigation">
          {navigationLinks.map((link) => (
            <Link
              href={link.href}
              key={link.label}
              onClick={(event) => handleNav(event, link.href)}
            >
              {link.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link href={pathname === "/quick" ? "/" : "/quick"} onClick={() => setOpen(false)}>
            {pathname === "/quick" ? "Full portfolio" : "1-page profile"}
            <span aria-hidden="true">↗</span>
          </Link>
          <a href={PROFILE.resumePath} download onClick={() => setOpen(false)}>
            Résumé PDF<span aria-hidden="true">↓</span>
          </a>
        </nav>
      )}
      <div
        ref={previewRef}
        className="print-nav-preview"
        data-visible={!!preview}
        aria-hidden="true"
      >
        {preview === "Projects" && (
          <>
            <Image src={workPreviewImage} alt="" fill sizes="220px" />
            <span>Selected work / {String(projectCount).padStart(2, "0")} projects</span>
          </>
        )}
        {preview === "Lab" && (
          <>
            <strong>LAB / 001</strong>
            <span>Experiments in motion and form</span>
          </>
        )}
        {preview === "About" && (
          <>
            <Image src="/images/sandeep-cutout-640.webp" alt="" fill unoptimized sizes="220px" />
            <span>Sandeep / Punjab, India</span>
          </>
        )}
        {preview === "Build" && (
          <>
            <strong>IDEA → SHIP</strong>
            <span>Tools connected to real work</span>
          </>
        )}
        {preview === "Contact" && (
          <>
            <strong>AVAILABLE ●</strong>
            <span>Punjab, India</span>
          </>
        )}
      </div>
    </header>
  );
}
