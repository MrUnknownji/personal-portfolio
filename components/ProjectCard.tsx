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

const ProjectCardComponent: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(cardRef.current, { scale: 1 });
    gsap.set(containerRef.current, { scale: 1 });
  }, []);

  const handleMouseEnter = () => {
    if (!cardRef.current || !containerRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1.06,
      duration: 0.2,
      ease: "power3.out",
      overwrite: true,
    });
    gsap.to(containerRef.current, {
      scale: 1.12,
      duration: 0.2,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !containerRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power3.out",
      overwrite: true,
    });
    gsap.to(containerRef.current, {
      scale: 1,
      duration: 0.2,
      ease: "power3.out",
      overwrite: true,
    });
  };

  return (
    <div
      ref={cardRef}
      style={{ willChange: "transform" }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-md cursor-pointer group hover:shadow-lg"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={containerRef}
        className="relative h-48 md:h-56 lg:h-60 overflow-hidden"
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-end justify-start p-4 md:p-6">
          <span className="text-white text-lg md:text-xl font-semibold">
            View Details
          </span>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <h3 className="text-xl md:text-2xl font-semibold text-primary mb-2 md:mb-3">
          {project.title}
        </h3>
        <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
          {project.shortDescription}
        </p>
        <div className="flex flex-wrap gap-1 md:gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="bg-gray-700 text-accent text-xs md:text-sm px-2 md:px-3 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="bg-gray-700 text-accent text-xs md:text-sm px-2 md:px-3 py-1 rounded-full">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = memo(ProjectCardComponent);
export default ProjectCard;
