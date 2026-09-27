import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { ProjectSummary } from "@/types/Project";

export default function ProjectCard({ project, index = 0 }: { project: ProjectSummary; index?: number }) {
  const preview = project.id === 11 ? "/images/mirror-admin-preview.avif" : project.image;
  return <Link href={`/my-projects/${project.id}`} className="print-index-card" data-krypton-context="project" data-krypton-title={project.title} data-krypton-summary={`${project.title}: ${project.shortDescription}`}>
    <ViewTransition name={`project-media-${project.id}`} share="project-morph" default="none"><span className="print-index-card-image"><Image src={preview} alt="" fill unoptimized={project.id === 11} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} sizes="(max-width: 760px) 100vw, 48vw" /></span></ViewTransition>
    <span className="print-index-card-meta">0{index + 1} / {project.category}</span>
    <ViewTransition name={`project-title-${project.id}`} share="project-morph" default="none"><span className="print-index-card-title"><span className="print-index-card-name">{project.title}</span><span className="print-index-card-arrow" aria-hidden="true">↗</span></span></ViewTransition>
    <span className="print-index-card-description">{project.shortDescription}</span>
    <span className="print-index-card-tech">{project.technologies.slice(0, 3).join(" · ")}</span>
    <span className="print-index-card-action">Read case study <span aria-hidden="true">↗</span></span>
  </Link>;
}
