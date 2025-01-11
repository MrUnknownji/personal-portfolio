"use client";
import { useState, useRef, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { projects } from "@/data/data";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.5 },
    );

    gsap.fromTo(
      filterRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.2 },
    );
  }, []);

  useEffect(() => {
    if (projectsRef.current) {
      gsap.fromTo(
        projectsRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
      );
    }
  }, [filter]);

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.2,
    });
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.2,
    });
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-secondary to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          ref={headerRef}
          className="text-6xl font-bold text-primary mb-16 text-center"
        >
          My Projects
        </h1>

        <div ref={filterRef} className="mb-12 space-y-4">
          <div className="flex justify-center flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full text-lg font-medium transition-colors duration-300 ${
                  filter === category
                    ? "bg-primary text-secondary"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
          <p className="text-center text-gray-400 mt-8 text-xl">
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
