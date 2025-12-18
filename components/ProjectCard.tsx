import React, { memo, useRef, useState } from "react";
import Image from "next/image";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiArrowUpRight, FiStar } from "react-icons/fi";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ANIMATION_CONFIG = {
  HOVER_DURATION: 0.5,
  HOVER_EASE: "power2.out",
  CARD_SCALE: 1.02,
  IMAGE_SCALE: 1.12,
  TILT_MAX: 8,
  MAGNETIC_FORCE: 0.3,
  TECH_TAGS: {
    MAX_DISPLAY: 3,
  },
  EASE_IN: "power2.in",
  EASE_ELASTIC: "elastic.out(1, 0.5)",
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -ANIMATION_CONFIG.TILT_MAX;
    const rotateY = ((x - centerX) / centerX) * ANIMATION_CONFIG.TILT_MAX;

    const magneticX = ((x - centerX) / centerX) * ANIMATION_CONFIG.MAGNETIC_FORCE * 10;
    const magneticY = ((y - centerY) / centerY) * ANIMATION_CONFIG.MAGNETIC_FORCE * 10;

    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      x: magneticX,
      y: magneticY - 8,
      duration: 0.3,
      ease: "power2.out",
      overwrite: true,
      transformPerspective: 1000,
    });

    gsap.to(imageRef.current, {
      x: -rotateY * 1.5,
      y: -rotateX * 1.5,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });

    if (shineRef.current) {
      gsap.to(shineRef.current, {
        background: `radial-gradient(circle 150px at ${shineX}% ${shineY}%, rgba(0, 255, 159, 0.15), transparent)`,
        duration: 0.2,
        ease: "none",
      });
    }
  });

  const handleMouseEnter = contextSafe(() => {
    setIsHovered(true);

    const tl = gsap.timeline({ defaults: { ease: ANIMATION_CONFIG.HOVER_EASE } });

    tl.to(cardRef.current, {
      scale: ANIMATION_CONFIG.CARD_SCALE,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      borderColor: "rgba(0, 255, 159, 0.4)",
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      overwrite: true,
    }, 0);

    tl.to(imageRef.current, {
      scale: ANIMATION_CONFIG.IMAGE_SCALE,
      rotation: 2,
      duration: ANIMATION_CONFIG.HOVER_DURATION * 1.2,
      ease: "power2.out",
      overwrite: true,
    }, 0);

    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
      overwrite: true,
    }, 0.1);

    tl.fromTo(
      viewDetailsRef.current,
      { scale: 0.8, y: 30, opacity: 0, rotation: -5 },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        ease: ANIMATION_CONFIG.EASE_ELASTIC,
        overwrite: true,
      },
      0.15
    );

    tl.to(accentLineRef.current, {
      scaleX: 1,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    }, 0);

    tl.fromTo(
      titleRef.current,
      { y: 10, opacity: 0.7 },
      { y: 0, opacity: 1, duration: 0.3 },
      0.1
    );
    tl.fromTo(
      descRef.current,
      { y: 10, opacity: 0.5 },
      { y: 0, opacity: 1, duration: 0.3 },
      0.15
    );

    if (tagsContainerRef.current) {
      const tags = tagsContainerRef.current.querySelectorAll(".tech-tag");
      tl.fromTo(
        tags,
        { scale: 0.9, opacity: 0.6, y: 5 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "back.out(1.7)",
          overwrite: true,
        },
        0.2
      );
    }
  });

  const handleMouseLeave = contextSafe(() => {
    setIsHovered(false);

    const tl = gsap.timeline({ defaults: { ease: ANIMATION_CONFIG.EASE_IN } });

    tl.to(cardRef.current, {
      scale: 1,
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.05)",
      duration: ANIMATION_CONFIG.HOVER_DURATION,
      overwrite: true,
    }, 0);

    tl.to(imageRef.current, {
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
      duration: ANIMATION_CONFIG.HOVER_DURATION * 1.2,
      overwrite: true,
    }, 0);

    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      overwrite: true,
    }, 0);

    tl.to(viewDetailsRef.current, {
      scale: 0.8,
      y: 20,
      opacity: 0,
      rotation: 5,
      duration: 0.3,
      overwrite: true,
    }, 0);

    tl.to(accentLineRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 0.3,
      overwrite: true,
    }, 0);

    tl.to([titleRef.current, descRef.current], {
      y: 0,
      opacity: 1,
      duration: 0.2,
    }, 0);

    if (tagsContainerRef.current) {
      const tags = tagsContainerRef.current.querySelectorAll(".tech-tag");
      tl.to(tags, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.2,
        overwrite: true,
      }, 0);
    }
  });

  useGSAP(
    () => {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(viewDetailsRef.current, { opacity: 0, y: 30, scale: 0.8 });
      gsap.set(accentLineRef.current, { scaleX: 0, opacity: 0, transformOrigin: "left center" });
      gsap.set(cardRef.current, {
        borderColor: "rgba(255, 255, 255, 0.05)",
        transformStyle: "preserve-3d",
      });
    },
    { scope: cardRef }
  );

  return (
    <div
      ref={cardRef}
      className="relative bg-card/95 border border-border rounded-2xl overflow-hidden shadow-lg cursor-pointer transform-gpu"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        backfaceVisibility: "hidden",
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Shine overlay */}
      <div
        ref={shineRef}
        className="absolute inset-0 pointer-events-none z-10 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          mixBlendMode: "screen"
        }}
      />

      {/* Accent line at top */}
      <div
        ref={accentLineRef}
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary to-primary/0 z-20"
      />

      {/* Image Container */}
      <div className="relative h-52 md:h-64 overflow-hidden border-b border-border">
        <div
          ref={imageRef}
          className="absolute inset-0 transform-gpu"
          style={{
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            style={{
              objectFit: "cover",
              filter: "grayscale(10%) brightness(0.95)",
            }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-background/90 flex items-center justify-center"
          style={{ willChange: "opacity" }}
        >
          <span
            ref={viewDetailsRef}
            className="flex items-center gap-2 text-base font-bold text-white px-6 py-3 rounded-full bg-primary/20 border-2 border-primary/60 shadow-lg"
            style={{ willChange: "transform, opacity" }}
          >
            View Project <FiArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-6 flex flex-col h-full relative">
        <h3
          ref={titleRef}
          className="text-2xl font-bold text-foreground mb-3 tracking-tight flex items-start justify-between gap-2"
        >
          <span className="flex-1">{project.title}</span>
          {project.featured && (
            <FiStar className="w-5 h-5 text-primary flex-shrink-0 fill-primary" />
          )}
        </h3>
        <p
          ref={descRef}
          className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3"
        >
          {project.shortDescription}
        </p>

        <div ref={tagsContainerRef} className="mt-auto flex flex-wrap gap-2">
          {project.technologies
            .slice(0, ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY)
            .map((tech, index) => (
              <span
                key={tech}
                className="tech-tag px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-dark transition-all duration-300"
                style={{
                  transitionDelay: `${index * 30}ms`,
                }}
              >
                {tech}
              </span>
            ))}
          {project.technologies.length >
            ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY && (
              <span className="tech-tag px-3 py-1.5 rounded-full text-xs font-medium bg-foreground/5 text-muted-foreground border border-border hover:border-border/80 transition-colors duration-300">
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
