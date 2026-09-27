"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { selectedProjects } from "@/data/projects";

const links = [
  { label: "Work", href: "/my-projects" },
  { label: "Lab", href: "/#lab" },
  { label: "About", href: "/#about" },
  { label: "Toolkit", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [sectionLabel, setSectionLabel] = useState("00 / INTRO");
  const [time, setTime] = useState("--:-- IST");
  const [preview, setPreview] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pendingSection = useRef<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const updateTime = () => setTime(`${new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date())} IST`);
    updateTime();
    const timer = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(timer);
  }, []);

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
          const sections = [["contact", "05 / CONTACT"], ["skills", "04 / TOOLKIT"], ["about", "03 / ABOUT"], ["lab", "02 / LAB"], ["work", "01 / WORK"]] as const;
          setSectionLabel(sections.find(([id]) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) < 180)?.[1] || "00 / INTRO");
        } else setSectionLabel(pathname === "/my-projects" ? "01 / ARCHIVE" : "01 / CASE STUDY");
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [pathname]);

  const movePreview = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!previewRef.current || event.pointerType === "touch") return;
    previewRef.current.style.left = `${Math.min(window.innerWidth - 245, event.clientX + 18)}px`;
    previewRef.current.style.top = `${Math.min(window.innerHeight - 205, event.clientY + 18)}px`;
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
    const sectionId = pendingSection.current || (window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : null);
    if (!sectionId) return;
    let frame = 0;
    let attempts = 0;
    const revealSection = () => {
      const section = document.getElementById(sectionId);
      const motionPending = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches && !document.querySelector(".offset-motion-enabled");
      if ((!section || motionPending) && attempts++ < 120) {
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
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  return (
    <header className="print-header" data-compact={compact}>
      <div className="print-topbar">
        <Link href="/" className="print-brand" onClick={() => setOpen(false)} aria-label="Sandeep Kumar homepage">Sandeep Kumar <span>Full-stack developer</span></Link>
        <span className="print-header-time">{time}</span>
        <span className="print-header-section" aria-live="off">{sectionLabel}</span>
        <nav className="print-desktop-nav" aria-label="Primary navigation">{links.map((link, index) => <Link href={link.href} key={link.label} onClick={(event) => handleNav(event, link.href)} onPointerEnter={(event) => { if (event.pointerType !== "touch") setPreview(link.label); }} onPointerMove={movePreview} onPointerLeave={() => setPreview(null)}><span>0{index + 1}</span>{link.label}</Link>)}</nav>
        <span className="print-availability"><i /> Available for opportunities</span>
        <button className="print-menu-button" ref={menuButton} type="button" aria-expanded={open} aria-controls="print-mobile-nav" aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={() => setOpen(!open)}>{open ? "Close −" : "Menu +"}</button>
      </div>
      {open && <nav id="print-mobile-nav" className="print-mobile-nav" aria-label="Mobile navigation">{links.map((link) => <Link href={link.href} key={link.label} onClick={(event) => handleNav(event, link.href)}>{link.label}<span aria-hidden="true">↗</span></Link>)}</nav>}
      <div ref={previewRef} className="print-nav-preview" data-visible={!!preview} aria-hidden="true">{preview === "Work" && <><Image src={selectedProjects[0].image} alt="" fill sizes="220px" /><span>Selected work / 06 projects</span></>}{preview === "Lab" && <><strong>LAB / 001</strong><span>Experiments in motion and form</span></>}{preview === "About" && <><Image src="/images/sandeep-cutout-640.webp" alt="" fill unoptimized sizes="220px" /><span>Sandeep / Punjab, India</span></>}{preview === "Toolkit" && <><strong>SEE → RUN → SHIP</strong><span>Interface / Systems / Delivery</span></>}{preview === "Contact" && <><strong>AVAILABLE ●</strong><span>Punjab, India / {time}</span></>}</div>
    </header>
  );
}
