import React, { memo } from "react";
import Image from "next/image";
import { ProjectSummary } from "@/types/Project";
import { FiArrowUpRight, FiStar } from "react-icons/fi";

interface ProjectCardProps {
  project: ProjectSummary;
  onClick: () => void;
  onIntent?: () => void;
}

const TECH_TAGS_MAX = 3;

const ProjectCardComponent: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  onIntent,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-krypton-context="project"
      data-krypton-title={project.title}
      data-krypton-summary={`${project.title}: ${project.shortDescription} Built with ${project.technologies.join(", ")}.`}
      className="project-card group relative bg-card rounded-xl overflow-hidden cursor-pointer border border-border
                 transition-[transform,border-color] duration-150 ease-out
                 hover:-translate-y-1 hover:border-primary/60 transform-gpu will-change-transform"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onFocus={onIntent}
      onPointerDown={onIntent}
      onPointerEnter={onIntent}
    >
      <div className="relative h-52 md:h-64 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04] transform-gpu will-change-transform"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black opacity-[0.12] pointer-events-none transition-opacity duration-150 group-hover:opacity-60 transform-gpu will-change-[opacity]" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="flex items-center gap-2 text-base font-bold text-white px-6 py-3 rounded-full
                       bg-primary/20 border-2 border-primary/60 opacity-0 translate-y-3 scale-95
                       transition-[transform,opacity] duration-150 ease-out
                       group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                       transform-gpu will-change-[transform,opacity]"
          >
            View Project <FiArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col relative border-t border-border/30">
        <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight flex items-start justify-between gap-2">
          <span className="flex-1">{project.title}</span>
          {project.featured && (
            <FiStar className="w-5 h-5 text-primary flex-shrink-0 fill-primary" />
          )}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
          {project.shortDescription}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.technologies.slice(0, TECH_TAGS_MAX).map((tech) => (
            <span
              key={tech}
              className="tech-tag flex items-center px-3 py-1 text-xs font-semibold bg-transparent text-primary border border-primary/50 hover:bg-primary hover:text-dark transition-colors duration-150"
              style={{
                boxShadow: "2px 2px 0px var(--primary)",
                borderRadius: "2px",
              }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > TECH_TAGS_MAX && (
            <span
              className="tech-tag flex items-center px-3 py-1 text-xs font-semibold bg-foreground/5 text-muted-foreground border border-border hover:border-border/80 transition-colors duration-300"
              style={{ borderRadius: "2px" }}
            >
              +{project.technologies.length - TECH_TAGS_MAX}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = memo(ProjectCardComponent);
export default ProjectCard;
