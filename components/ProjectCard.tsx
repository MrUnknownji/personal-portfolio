"use client";
import React, { memo, useRef } from "react";
import Image from "next/image";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiArrowUpRight } from "react-icons/fi";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ANIMATION_CONFIG = {
  HOVER_DURATION: 0.3,
  HOVER_EASE: "power3.out",
  CARD_SCALE: 1.03,
  IMAGE_SCALE: 1.05,
  TECH_TAGS: {
    MAX_DISPLAY: 3,
  },
  EASE_IN: "power3.in",
} as const;

const ProjectCardComponent: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const viewDetailsRef = useRef<HTMLSpanElement>(null);
  const cornerTopLeftRef = useRef<HTMLDivElement>(null);
  const cornerBottomRightRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to(cardRef.current, {
      scale: ANIMATION_CONFIG.CARD_SCALE,
      y: -5,
      boxShadow: "0 12px 25px -5px rgba(0, 0, 0, 0.2)",
      borderColor: "var(--color-primary)",
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
    gsap.fromTo(
      viewDetailsRef.current,
      { y: 10, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.HOVER_DURATION,
        ease: ANIMATION_CONFIG.HOVER_EASE,
        delay: 0.05,
        overwrite: true,
      },
    );
    gsap.to([cornerTopLeftRef.current, cornerBottomRightRef.current], {
      opacity: 1,
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      ease: ANIMATION_CONFIG.HOVER_EASE,
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      borderColor: "var(--color-neutral)",
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
    gsap.to(viewDetailsRef.current, {
      y: 10,
      opacity: 0,
      duration: ANIMATION_CONFIG.HOVER_DURATION * 0.8,
      ease: ANIMATION_CONFIG.EASE_IN,
      overwrite: true,
    });
    gsap.to([cornerTopLeftRef.current, cornerBottomRightRef.current], {
      opacity: 0,
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      ease: ANIMATION_CONFIG.HOVER_EASE,
    });
  });

  useGSAP(
    () => {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(viewDetailsRef.current, { opacity: 0, y: 10 });
      gsap.set([cornerTopLeftRef.current, cornerBottomRightRef.current], {
        opacity: 0,
      });
      gsap.set(cardRef.current, { borderColor: "var(--color-neutral)" });
    },
    { scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      className="relative bg-secondary/80 backdrop-blur-md rounded-xl overflow-hidden shadow-md cursor-pointer transform-gpu border transition-colors duration-300"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backfaceVisibility: "hidden",
        willChange: "transform, box-shadow, border-color",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-70 pointer-events-none -z-1" />

      <div className="relative h-48 md:h-56 lg:h-60 overflow-hidden rounded-t-xl">
        <div
          ref={imageRef}
          className="absolute inset-0 transform-gpu"
          style={{ willChange: "transform" }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            style={{
              objectFit: "cover",
              backfaceVisibility: "hidden",
            }}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            priority
          />
        </div>
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent flex items-end justify-start p-4 md:p-6"
          style={{ willChange: "opacity" }}
        >
          <span
            ref={viewDetailsRef}
            className="flex items-center gap-1 text-lg md:text-xl font-semibold text-primary"
            style={{ willChange: "transform, opacity" }}
          >
            View Details <FiArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <h3 className="text-xl md:text-2xl font-semibold text-light mb-2 md:mb-3 truncate">
          {project.title}
        </h3>
        <p className="text-muted mb-3 md:mb-4 text-sm md:text-base line-clamp-2">
          {project.shortDescription}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies
            .slice(0, ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY)
            .map((tech) => (
              <span
                key={tech}
                className="skill-chip !py-1 !px-2.5 !text-xs !cursor-pointer"
              >
                {tech}
              </span>
            ))}
          {project.technologies.length >
            ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY && (
            <span className="skill-chip !py-1 !px-2.5 !text-xs !cursor-pointer">
              +
              {project.technologies.length -
                ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY}
            </span>
          )}
        </div>
      </div>

      <div
        ref={cornerTopLeftRef}
        className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl-xl opacity-0 transition-opacity duration-300"
        style={{ willChange: "opacity" }}
      />
      <div
        ref={cornerBottomRightRef}
        className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br-xl opacity-0 transition-opacity duration-300"
        style={{ willChange: "opacity" }}
      />
    </div>
  );
};

const ProjectCard = memo(ProjectCardComponent);
export default ProjectCard;
