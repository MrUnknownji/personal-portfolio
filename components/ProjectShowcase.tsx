"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ShowcaseRow from "@/components/showcase/ShowcaseRow";
import type { ShowcaseProject } from "@/types/Project";

export default function ProjectShowcase({ projects }: { projects: ShowcaseProject[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    const rows = sectionRef.current?.querySelectorAll<HTMLElement>("[data-showcase-index]");
    if (!rows) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - window.innerHeight * 0.35) -
              Math.abs(b.boundingClientRect.top - window.innerHeight * 0.35),
          )[0];
        if (current)
          setActiveProject(Number((current.target as HTMLElement).dataset.showcaseIndex));
      },
      { rootMargin: "-30% 0px -45% 0px" },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="offset-work"
      id="work"
      data-build-file="ProjectShowcase.tsx"
      data-build-note="Four products, four kinds of interaction. Open a case study to see the constraints and decisions behind each one."
      aria-labelledby="work-title"
    >
      <div className="offset-work-rail" aria-hidden="true">
        <span>
          {String(activeProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}{" "}
          · {projects[activeProject]?.title}
        </span>
      </div>
      <div className="offset-work-inner">
        <header className="offset-work-header" data-offset-reveal>
          <span className="offset-kicker">
            Work / 001—{String(projects.length).padStart(3, "0")}
          </span>
          <h2 id="work-title">
            Work that
            <br />
            holds up<span>.</span>
          </h2>
          <p>
            Real-time bidding, the motion studio I run, a paired-wallpaper product, and an
            end-to-end store. Every number below is counted from the project&apos;s repository or
            its live site.
          </p>
        </header>
        {projects.map((project, index) => (
          <ShowcaseRow key={project.id} project={project} index={index} />
        ))}
        <Link className="offset-more-work" href="/my-projects">
          Browse all projects <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
