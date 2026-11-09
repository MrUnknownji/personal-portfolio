"use client";

import { ViewTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFrameCarousel } from "@/components/showcase/useFrameCarousel";
import {
  AuctionPreview,
  BrowserPreview,
  FilmPreview,
  PhonePreview,
  StillPreview,
  scrubFrames,
} from "@/components/showcase/previews";
import type { ShowcaseProject } from "@/types/Project";

export default function ShowcaseRow({
  project,
  index,
}: {
  project: ShowcaseProject;
  index: number;
}) {
  const router = useRouter();
  const kind = project.showcaseVariant;
  const frames = project.showcaseFrames ?? [];
  const { frame, outgoingFrame, changeFrame, swipeHandlers } = useFrameCarousel(frames.length);
  const caseStudy = `/my-projects/${project.id}`;
  const frameProps = { project, frames, frame, outgoingFrame, changeFrame };

  return (
    <article
      className={`showcase-row showcase-${kind ?? "generic"}`}
      data-offset-project
      data-showcase-index={index}
      onPointerEnter={() => router.prefetch(caseStudy)}
      onFocus={() => router.prefetch(caseStudy)}
    >
      <div className="showcase-head">
        <span>
          0{index + 1} / {project.category}
        </span>
        <span>{project.year}</span>
      </div>
      <div className="showcase-main">
        <div className="showcase-copy">
          <ViewTransition name={`project-title-${project.id}`} share="project-morph" default="none">
            <h3>{project.title}</h3>
          </ViewTransition>
          <p>{project.shortDescription}</p>
          <span className="showcase-tech">{project.technologies.slice(0, 4).join(" · ")}</span>
          {project.facts && (
            <dl className="showcase-facts">
              {project.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <Link href={caseStudy}>
            Explore case study <span aria-hidden="true">↗</span>
          </Link>
          <div className="showcase-links">
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                Live demo <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.githubLink ? (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                Source code <span aria-hidden="true">↗</span>
              </a>
            ) : (
              project.sourceNote && (
                <span className="showcase-source-note">{project.sourceNote}</span>
              )
            )}
          </div>
        </div>
        <ViewTransition name={`project-media-${project.id}`} share="project-morph" default="none">
          <div
            className="showcase-media"
            {...swipeHandlers}
            onPointerMove={
              kind === "omni"
                ? (event) => scrubFrames(event, frames.length, changeFrame)
                : undefined
            }
          >
            <Link
              className="showcase-media-link"
              href={caseStudy}
              aria-label={`View ${project.title} case study`}
            />
            {kind === "omni" && <BrowserPreview {...frameProps} />}
            {kind === "mirror" && <PhonePreview {...frameProps} />}
            {kind === "bid" && <AuctionPreview project={project} />}
            {kind === "film" && <FilmPreview project={project} />}
            {!kind && <StillPreview project={project} />}
          </div>
        </ViewTransition>
      </div>
    </article>
  );
}
