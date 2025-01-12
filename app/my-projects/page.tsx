"use client";
import { useState, useRef, useCallback } from "react";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { projects } from "@/data/data";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");

  const headerRef = useRef<HTMLHeadingElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.category === filter);

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((project) => project.category))),
  ];

  useGSAP(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
    );

    gsap.fromTo(
      filterRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out" },
    );
  }, []);

  useGSAP(() => {
    if (projectsRef.current) {
      gsap.fromTo(
        projectsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          willChange: "opacity, transform",
        },
      );
    }
  }, [filter]);

  const handleButtonHover = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      gsap.to(e.currentTarget, {
        scale: 1.1,
        duration: 0.2,
        ease: "power3.out",
        overwrite: true,
      });
    },
    [],
  );

  const handleButtonLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      gsap.to(e.currentTarget, {
        scale: 1,
        duration: 0.2,
        ease: "power3.out",
        overwrite: true,
      });
    },
    [],
  );

  return (
    <div className="min-h-screen py-16 md:py-20 bg-gradient-to-b from-secondary to-gray-900">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <h1
          ref={headerRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-10 md:mb-16 text-center"
        >
          My Projects
        </h1>

        <div ref={filterRef} className="mb-8 md:mb-12 space-y-2 md:space-y-4">
          <div className="flex justify-center flex-wrap gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-lg font-medium transition-colors duration-300 ${
                  filter === category
                    ? "bg-primary text-secondary shadow-md"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setFilter(category)}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={projectsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-gray-400 mt-6 md:mt-8 text-lg md:text-xl">
            No projects found in this category. Try selecting a different
            category.
          </p>
        )}
      </div>
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          isOpen
        />
      )}
    </div>
  );
}
