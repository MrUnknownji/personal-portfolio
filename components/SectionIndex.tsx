"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "top", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "lab", label: "Lab" },
  { id: "about", label: "About" },
  { id: "skills", label: "Toolkit" },
  { id: "contact", label: "Contact" },
];

export default function SectionIndex() {
  const [active, setActive] = useState(0);
  const inkRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const current = sections.reduce((result, section, index) => {
          if (section.id === "top") return result;
          const top = document.getElementById(section.id)?.getBoundingClientRect().top ?? Infinity;
          return top < window.innerHeight * .35 ? index : result;
        }, 0);
        setActive(current);

        const orangeAreas = [...document.querySelectorAll<HTMLElement>(".offset-hero-band, .offset-work-rail, .offset-contact-direct")]
          .map((element) => element.getBoundingClientRect());
        inkRef.current?.querySelectorAll<HTMLElement>(":scope > span").forEach((item) => {
          const rect = item.getBoundingClientRect();
          const overlap = orangeAreas.map((area) => ({
            area,
            width: Math.max(0, Math.min(rect.right, area.right) - Math.max(rect.left, area.left)),
            height: Math.max(0, Math.min(rect.bottom, area.bottom) - Math.max(rect.top, area.top)),
          })).sort((first, second) => second.width * second.height - first.width * first.height)[0];
          if (!overlap || !overlap.width || !overlap.height) {
            item.style.setProperty("--orange-clip-top", `${rect.height}px`);
            return;
          }
          item.style.setProperty("--orange-clip-top", `${Math.max(0, overlap.area.top - rect.top)}px`);
          item.style.setProperty("--orange-clip-right", `${Math.max(0, rect.right - overlap.area.right)}px`);
          item.style.setProperty("--orange-clip-bottom", `${Math.max(0, rect.bottom - overlap.area.bottom)}px`);
          item.style.setProperty("--orange-clip-left", `${Math.max(0, overlap.area.left - rect.left)}px`);
        });
        frame = 0;
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("portfolio:surface-update", update);
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); window.removeEventListener("portfolio:surface-update", update); cancelAnimationFrame(frame); };
  }, []);
  return <>
    <nav className="offset-section-index" aria-label="Page sections">{sections.map((section, index) => <a key={section.id} href={`#${section.id}`} aria-label={`Jump to ${section.label}`} aria-current={active === index ? "location" : undefined}><svg viewBox="0 0 29 29" aria-hidden="true"><text x="14.5" y="14.5">0{index}</text></svg></a>)}</nav>
    <div ref={inkRef} className="offset-section-index-ink" aria-hidden="true">{sections.map((section, index) => <span key={section.id} data-active={active === index}><svg viewBox="0 0 29 29"><text x="14.5" y="14.5">0{index}</text></svg></span>)}</div>
  </>;
}
