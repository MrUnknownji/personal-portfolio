"use client";
import React, { memo, useRef } from "react";
import Image from "next/image";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ANIMATION_CONFIG = {
  HOVER_DURATION: 0.3,
  HOVER_EASE: "power3.out",
  CARD_SCALE: 1.05,
  IMAGE_SCALE: 1.1,
  TECH_TAGS: {
    MAX_DISPLAY: 3,
  },
} as const;

const ProjectCardComponent: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const techTagsRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to(cardRef.current, {
      scale: ANIMATION_CONFIG.CARD_SCALE,
      y: -5,
      boxShadow:
        "0 10px 15px -3px rgba(0, 255, 159, 0.1), 0 4px 6px -4px rgba(0, 255, 159, 0.1)",
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      ease: ANIMATION_CONFIG.HOVER_EASE,
      overwrite: true,
    });
    gsap.to(imageRef.current, {
      scale: ANIMATION_CONFIG.IMAGE_SCALE,
      duration: ANIMATION_CONFIG.HOVER_DURATION * 1.2,
      ease: ANIMATION_CONFIG.HOVER_EASE,
      overwrite: true,
    });
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      ease: ANIMATION_CONFIG.HOVER_EASE,
      overwrite: true,
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      ease: ANIMATION_CONFIG.HOVER_EASE,
      overwrite: true,
    });
    gsap.to(imageRef.current, {
      scale: 1,
      duration: ANIMATION_CONFIG.HOVER_DURATION * 1.2,
      ease: ANIMATION_CONFIG.HOVER_EASE,
      overwrite: true,
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      ease: ANIMATION_CONFIG.HOVER_EASE,
      overwrite: true,
    });
  });

  useGSAP(
    () => {
      gsap.set(overlayRef.current, { opacity: 0 });
    },
    { scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      className="bg-frosted-dark rounded-xl overflow-hidden shadow-md cursor-pointer transform-gpu border border-transparent hover:border-primary/20 transition-colors duration-300"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backfaceVisibility: "hidden",
        willChange: "transform, box-shadow",
      }}
    >
      <div className="relative h-48 md:h-56 lg:h-60 overflow-hidden">
        <Image
          ref={imageRef}
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transform-gpu"
          style={{
            objectFit: "cover",
            backfaceVisibility: "hidden",
            willChange: "transform",
          }}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          priority
        />
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent flex items-end justify-start p-4 md:p-6"
          style={{ willChange: "opacity" }}
        >
          <span className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            View Details
          </span>
        </div>
      </div>

      <div ref={contentRef} className="p-4 md:p-6">
        <h3 className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2 md:mb-3">
          {project.title}
        </h3>
        <p className="text-muted mb-3 md:mb-4 text-sm md:text-base line-clamp-2">
          {project.shortDescription}
        </p>
        <div ref={techTagsRef} className="flex flex-wrap gap-2">
          {project.technologies
            .slice(0, ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY)
            .map((tech) => (
              <span key={tech} className="skill-chip !py-1 !px-2.5 !text-xs">
                {tech}
              </span>
            ))}
          {project.technologies.length >
            ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY && (
            <span className="skill-chip !py-1 !px-2.5 !text-xs">
              +
              {project.technologies.length -
                ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = memo(ProjectCardComponent);
export default ProjectCard;
