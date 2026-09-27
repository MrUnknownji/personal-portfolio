"use client";

import { useEffect, useState, ViewTransition, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/types/Project";

const galleryLabels = ["Home", "Product", "Cart", "Checkout"];
const bidSteps = ["₹4,250", "₹4,300", "₹4,450", "SOLD"];

function ShowcaseRow({ project, index }: { project: Project; index: number }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [frame, setFrame] = useState(0);
  const [bidStep, setBidStep] = useState(0);
  const kind = project.id === 10 ? "omni" : project.id === 11 ? "mirror" : "bid";
  const gallery = project.gallery?.filter((item) => item.type === "image") ?? [];
  const omniFrames = [
    gallery.find((item) => /Web Home \(Light\)/i.test(item.alt || "")),
    gallery.find((item) => /Product Detail/i.test(item.alt || "")),
    gallery.find((item) => /Shopping Cart/i.test(item.alt || "")),
    gallery.find((item) => /Web Checkout/i.test(item.alt || "")),
  ];
  const mirrorFrames = gallery.slice(1, 4);

  useEffect(() => {
    if (!active || kind !== "bid" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setBidStep((current) => (current + 1) % bidSteps.length), 850);
    return () => window.clearInterval(timer);
  }, [active, kind]);

  const selectFrame = (event: PointerEvent<HTMLElement>) => {
    if (kind !== "omni" || event.pointerType === "touch") return;
    if (event.target instanceof Element && event.target.closest("button")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const position = Math.max(0, Math.min(0.999, (event.clientX - rect.left) / rect.width));
    setFrame(Math.floor(position * galleryLabels.length));
  };

  return (
    <article className={`showcase-row showcase-${kind}`} data-offset-project onPointerMove={selectFrame} onPointerEnter={() => { setActive(true); router.prefetch(`/my-projects/${project.id}`); }} onPointerLeave={() => { setActive(false); setBidStep(0); }} onFocus={() => { setActive(true); router.prefetch(`/my-projects/${project.id}`); }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActive(false); }}>
      <div className="showcase-head"><span>0{index + 1} / {project.category}</span><span>2026</span></div>
      <div className="showcase-main">
        <div className="showcase-copy"><ViewTransition name={`project-title-${project.id}`} share="project-morph" default="none"><h3>{project.title}</h3></ViewTransition><p>{project.shortDescription}</p><span className="showcase-tech">{project.technologies.slice(0, 4).join(" · ")}</span><Link href={`/my-projects/${project.id}`}>Explore case study <span aria-hidden="true">↗</span></Link></div>
        <ViewTransition name={`project-media-${project.id}`} share="project-morph" default="none"><div className="showcase-media">
          <Link className="showcase-media-link" href={`/my-projects/${project.id}`} aria-label={`View ${project.title} case study`} />
          {kind === "omni" && <><div className="showcase-browser"><div className="showcase-browser-top"><span>● ● ●</span><span>OMNIMART / {galleryLabels[frame]}</span></div><Image src={omniFrames[frame]?.src || project.image} alt={omniFrames[frame]?.alt || `${project.title} interface`} fill sizes="(max-width: 900px) 90vw, 50vw" /></div><div className="showcase-media-controls" aria-label="OmniMart preview screens">{galleryLabels.map((label, position) => <button key={label} type="button" aria-pressed={frame === position} onClick={() => setFrame(position)}>{label}</button>)}</div></>}
          {kind === "mirror" && <><div className="showcase-wallpapers">{mirrorFrames.map((item, position) => <div className="showcase-wallpaper" key={item.src} style={{ "--item": position } as CSSProperties}><Image src={item.src} alt={item.alt || `${project.title} screen`} fill sizes="(max-width: 900px) 28vw, 16vw" /></div>)}</div><span className="showcase-media-caption">Lock screen → Home screen → Discovery</span></>}
          {kind === "bid" && <><div className="showcase-bid-screen"><Image src={project.image} alt={`${project.title} interface preview`} fill sizes="(max-width: 900px) 90vw, 50vw" /></div><div className="showcase-bid-ticker" aria-hidden="true"><span>LIVE BID / INTERACTION SKETCH</span><strong>{bidSteps[bidStep]}</strong></div></>}
        </div></ViewTransition>
      </div>
    </article>
  );
}

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  return <section className="offset-work" id="work" aria-labelledby="work-title"><div className="offset-work-rail" aria-hidden="true"><span>01 / Selected work</span></div><div className="offset-work-inner"><header className="offset-work-header" data-offset-reveal><span className="offset-kicker">Work / 001—003</span><h2 id="work-title">Ideas made<br />usable<span>.</span></h2><p>Move through the work. Each preview shows a different part of the product.</p></header>{projects.map((project, index) => <ShowcaseRow key={project.id} project={project} index={index} />)}<Link className="offset-more-work" href="/my-projects">Browse all projects <span aria-hidden="true">↗</span></Link></div></section>;
}
