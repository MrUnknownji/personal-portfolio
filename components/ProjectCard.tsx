import Image from "next/image";
import type { ProjectSummary } from "@/types/Project";

interface ProjectCardProps {
  project: ProjectSummary;
  onClick: () => void;
  onIntent?: () => void;
  priority?: boolean;
  index?: number;
}

export default function ProjectCard({ project, onClick, onIntent, priority = false, index = 0 }: ProjectCardProps) {
  const preview = project.id === 11 ? "/images/mirror-admin-preview.avif" : project.image;
  return (
    <button type="button" className="print-index-card" onClick={onClick} onFocus={onIntent} onPointerEnter={onIntent} onPointerDown={onIntent} data-krypton-context="project" data-krypton-title={project.title} data-krypton-summary={`${project.title}: ${project.shortDescription} Built with ${project.technologies.join(", ")}.`}>
      <span className="print-index-card-image"><Image src={preview} alt="" fill unoptimized={project.id === 11} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} sizes="(max-width: 760px) 100vw, 48vw" /></span>
      <span className="print-index-card-meta">0{index + 1} / {project.category}</span>
      <span className="print-index-card-title"><span className="print-index-card-name">{project.title}</span><span className="print-index-card-arrow" aria-hidden="true">↗</span></span>
      <span className="print-index-card-description">{project.shortDescription}</span>
      <span className="print-index-card-tech">{project.technologies.slice(0, 3).join(" · ")}</span>
    </button>
  );
}
