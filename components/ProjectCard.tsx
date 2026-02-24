import React, { memo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Project } from "@/types/Project";
import { FiArrowUpRight, FiStar } from "react-icons/fi";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const TECH_TAGS_MAX = 3;

const ProjectCardComponent: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  return (
    <div
      className="project-card relative bg-card rounded-xl overflow-hidden cursor-pointer border border-border"
      onClick={onClick}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={{
        transform: isHovered
          ? "translateY(-4px) translateX(-4px)"
          : "translateY(0) translateX(0)",
        boxShadow: isHovered
          ? "6px 6px 0px var(--primary)"
          : "0px 0px 0px transparent",
        transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="relative h-52 md:h-64 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          style={{
            filter: isHovered
              ? "brightness(0.25) contrast(1.1) saturate(0.8) blur(2px)"
              : "brightness(0.9) contrast(1.05) saturate(0.85)",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            transition:
              "filter 0.5s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="flex items-center gap-2 text-base font-bold text-white px-6 py-3 rounded-full bg-primary/20 border-2 border-primary/60"
            style={{
              transform: isHovered
                ? "translateY(0) scale(1) rotate(0deg)"
                : "translateY(24px) scale(0.7) rotate(-3deg)",
              opacity: isHovered ? 1 : 0,
              transition: isHovered
                ? "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.5), opacity 0.3s ease"
                : "transform 0.35s cubic-bezier(0.6, -0.28, 0.735, 0.045), opacity 0.2s ease",
              transitionDelay: isHovered ? "0.1s" : "0s",
            }}
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
              className="tech-tag flex items-center px-3 py-1 text-xs font-semibold bg-transparent text-primary border border-primary/50 hover:bg-primary hover:text-dark transition-all duration-300"
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
