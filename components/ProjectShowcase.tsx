"use client";

import { useEffect, useRef, useState, ViewTransition, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/types/Project";

const bidSteps = ["₹4,250", "₹4,300", "₹4,450", "SOLD"];

function ShowcaseRow({ project, index }: { project: Project; index: number }) {
  const router = useRouter();
  const [frame, setFrame] = useState(0);
  const [outgoingFrame, setOutgoingFrame] = useState<number | null>(null);
  const frameRef = useRef(0);
  const [bidStep, setBidStep] = useState(0);
  const kind = project.showcaseVariant;
  const frames = project.showcaseFrames ?? [];
  const currentFrame = frames[frame] ?? frames[0];

  useEffect(() => {
    if (outgoingFrame === null) return;
    const timer = window.setTimeout(() => setOutgoingFrame(null), 420);
    return () => window.clearTimeout(timer);
  }, [frame, outgoingFrame]);

  const changeFrame = (next: number) => {
    if (next === frameRef.current) return;
    setOutgoingFrame(frameRef.current);
    frameRef.current = next;
    setFrame(next);
  };

  const selectFrame = (event: PointerEvent<HTMLElement>) => {
    if (kind !== "omni" || frames.length === 0 || event.pointerType === "touch") return;
    if (event.target instanceof Element && event.target.closest("button")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const position = Math.max(0, Math.min(0.999, (event.clientX - rect.left) / rect.width));
    changeFrame(Math.floor(position * frames.length));
  };

  return (
    <article className={`showcase-row showcase-${kind ?? "generic"}`} data-offset-project data-showcase-index={index} onPointerEnter={() => router.prefetch(`/my-projects/${project.id}`)} onFocus={() => router.prefetch(`/my-projects/${project.id}`)}>
      <div className="showcase-head"><span>0{index + 1} / {project.category}</span><span>{project.year}</span></div>
      <div className="showcase-main">
        <div className="showcase-copy"><ViewTransition name={`project-title-${project.id}`} share="project-morph" default="none"><h3>{project.title}</h3></ViewTransition><p>{project.shortDescription}</p><span className="showcase-tech">{project.technologies.slice(0, 4).join(" · ")}</span><Link href={`/my-projects/${project.id}`}>Explore case study <span aria-hidden="true">↗</span></Link></div>
        <ViewTransition name={`project-media-${project.id}`} share="project-morph" default="none"><div className="showcase-media">
          <Link className="showcase-media-link" href={`/my-projects/${project.id}`} aria-label={`View ${project.title} case study`} />
          {kind === "omni" && <><div className="showcase-browser" onPointerMove={selectFrame}><div className="showcase-browser-top"><span>● ● ●</span><span>{project.title} / {currentFrame?.label}</span></div>{outgoingFrame !== null && frames[outgoingFrame] && <Image className="showcase-browser-frame showcase-browser-frame-outgoing" src={frames[outgoingFrame].src} alt="" fill sizes="(max-width: 900px) 90vw, 50vw" /> }<Image key={currentFrame?.src || project.image} className="showcase-browser-frame showcase-browser-frame-current" src={currentFrame?.src || project.image} alt={currentFrame?.alt || `${project.title} interface`} fill sizes="(max-width: 900px) 90vw, 50vw" /></div><div className="showcase-media-controls" aria-label={`${project.title} preview screens`}>{frames.map((item, position) => <button key={item.label} type="button" aria-pressed={frame === position} onClick={() => changeFrame(position)}>{item.label}</button>)}</div></>}
          {kind === "mirror" && <><div className="showcase-wallpapers">{frames.map((item, position) => <div className="showcase-wallpaper" key={item.src} data-active={frame === position} style={{ "--item": position } as CSSProperties}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 28vw, 16vw" /></div>)}</div><div className="showcase-media-controls" aria-label="Mirror product preview steps">{frames.map((item, position) => <button key={item.label} type="button" aria-pressed={frame === position} onClick={() => changeFrame(position)}>{item.label}</button>)}</div></>}
          {kind === "bid" && <><div className="showcase-bid-screen"><Image src={project.image} alt={`${project.title} interface preview`} fill sizes="(max-width: 900px) 90vw, 50vw" /></div><div className="showcase-bid-ticker"><span>Bid update / interaction sketch</span><strong aria-live="polite">{bidSteps[bidStep]}</strong><button type="button" onClick={() => setBidStep((current) => (current + 1) % bidSteps.length)} aria-label="Preview next bid update">Next bid ↗</button></div></>}
          {!kind && <div className="showcase-bid-screen" data-offset-depth><Image src={project.image} alt={`${project.title} interface preview`} fill sizes="(max-width: 900px) 90vw, 50vw" /></div>}
        </div></ViewTransition>
      </div>
    </article>
  );
}

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    const rows = sectionRef.current?.querySelectorAll<HTMLElement>("[data-showcase-index]");
    if (!rows) return;
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * .35) - Math.abs(b.boundingClientRect.top - window.innerHeight * .35))[0];
      if (current) setActiveProject(Number((current.target as HTMLElement).dataset.showcaseIndex));
    }, { rootMargin: "-30% 0px -45% 0px" });
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return <section ref={sectionRef} className="offset-work" id="work" data-build-file="ProjectShowcase.tsx" data-build-note="Three products, three kinds of interaction. Open a case study to see the constraints and decisions behind each one." aria-labelledby="work-title"><div className="offset-work-rail" aria-hidden="true"><span>{String(activeProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {projects[activeProject]?.title}</span></div><div className="offset-work-inner"><header className="offset-work-header" data-offset-reveal><span className="offset-kicker">Work / 001—003</span><h2 id="work-title">Work that<br />holds up<span>.</span></h2><p>Real-time bidding, a paired-wallpaper product, and an end-to-end store. Explore the product, then the decisions behind it.</p></header>{projects.map((project, index) => <ShowcaseRow key={project.id} project={project} index={index} />)}<Link className="offset-more-work" href="/my-projects">Browse all projects <span aria-hidden="true">↗</span></Link></div></section>;
}
