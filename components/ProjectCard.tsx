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
  HOVER_DURATION: 0.4,
  HOVER_EASE: "power3.out",
  CARD_SCALE: 1.02,
  IMAGE_SCALE: 1.1,
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
  const contentRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to(cardRef.current, {
      scale: ANIMATION_CONFIG.CARD_SCALE,
      y: -8,
      boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.3)",
      borderColor: "rgba(0, 255, 159, 0.3)", // Primary color with opacity
      backgroundColor: "rgba(30, 30, 30, 0.8)", // Slightly lighter/more opaque on hover
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      ease: ANIMATION_CONFIG.HOVER_EASE,
      overwrite: true,
    });
    gsap.to(imageRef.current, {
      scale: ANIMATION_CONFIG.IMAGE_SCALE,
      duration: ANIMATION_CONFIG.HOVER_DURATION * 1.5,
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
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.HOVER_DURATION,
        ease: ANIMATION_CONFIG.HOVER_EASE,
        delay: 0.1,
        overwrite: true,
      },
    );
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.05)",
      backgroundColor: "rgba(20, 20, 20, 0.4)",
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      ease: ANIMATION_CONFIG.HOVER_EASE,
      overwrite: true,
    });
    gsap.to(imageRef.current, {
      scale: 1,
      duration: ANIMATION_CONFIG.HOVER_DURATION * 1.5,
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
      y: 20,
      opacity: 0,
      duration: ANIMATION_CONFIG.HOVER_DURATION * 0.8,
      ease: ANIMATION_CONFIG.EASE_IN,
      overwrite: true,
    });
  });

  useGSAP(
    () => {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(viewDetailsRef.current, { opacity: 0, y: 20 });
      gsap.set(cardRef.current, {
        borderColor: "rgba(255, 255, 255, 0.05)",
        backgroundColor: "rgba(20, 20, 20, 0.4)"
      });
    },
    { scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      className="relative bg-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform-gpu"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backfaceVisibility: "hidden",
        willChange: "transform, box-shadow, border-color, background-color",
      }}
    >
      {/* Image Container */}
      <div className="relative h-52 md:h-64 overflow-hidden border-b border-white/5">
        <div
          ref={imageRef}
          className="absolute inset-0 transform-gpu"
          style={{ willChange: "transform" }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover grayscale-[20%]"
            style={{
              objectFit: "cover",
            }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-dark/60 backdrop-blur-[2px] flex items-center justify-center"
          style={{ willChange: "opacity" }}
        >
          <span
            ref={viewDetailsRef}
            className="flex items-center gap-2 text-lg font-bold text-white px-6 py-3 rounded-full bg-primary/20 border border-primary/50 backdrop-blur-md"
            style={{ willChange: "transform, opacity" }}
          >
            View Project <FiArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-6 flex flex-col h-full">
        <h3 className="text-2xl font-bold text-light mb-3 tracking-tight">
          {project.title}
        </h3>
        <p className="text-muted/80 text-sm leading-relaxed mb-6 line-clamp-3">
          {project.shortDescription}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.technologies
            .slice(0, ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY)
            .map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/10"
              >
                {tech}
              </span>
            ))}
          {project.technologies.length >
            ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-muted border border-white/5">
              +{project.technologies.length -
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
