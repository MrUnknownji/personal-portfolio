"use client";
import Image from "next/image";
import { Project } from "@/types/Project";
import { useRef } from "react";
import gsap from "gsap";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!cardRef.current || !containerRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1.05,
      duration: 0.3,
    });
    gsap.to(containerRef.current, {
      scale: 1.1,
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !containerRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.3,
    });
    gsap.to(containerRef.current, {
      scale: 1,
      duration: 0.3,
    });
  };

  return (
    <div
      ref={cardRef}
      style={{ willChange: "transform" }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={containerRef} className="relative h-60 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="transition-transform duration-300"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
          <span className="text-white text-xl font-semibold">View Details</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-primary mb-3">
          {project.title}
        </h3>
        <p className="text-gray-300 mb-4">{project.shortDescription}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="bg-gray-700 text-accent text-sm px-3 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="bg-gray-700 text-accent text-sm px-3 py-1 rounded-full">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
