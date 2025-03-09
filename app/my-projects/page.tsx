"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { projects } from "@/data/data";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiSearch } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  STAGGER: 0.08,
  DURATION: 0.6,
  EASE: "power3.out",
  HOVER: {
    DURATION: 0.2,
    EASE: "power2.out",
    SCALE: 1.05
  },
  FOCUS: {
    DURATION: 0.3,
    EASE: "power2.out"
  }
} as const;

export default function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const headerRef = useRef<HTMLHeadingElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const filterButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  const filteredProjects = projects.filter(project => {
    const matchesCategory = filter === "All" || project.category === filter;
    const matchesSearch = searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((project) => project.category))),
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsLoading(false)
    });

    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: ANIMATION_CONFIG.DURATION, ease: ANIMATION_CONFIG.EASE }
    )
    .fromTo(
      [filterRef.current, searchRef.current],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.DURATION,
        stagger: ANIMATION_CONFIG.STAGGER,
        ease: ANIMATION_CONFIG.EASE
      },
      "-=0.3"
    )
    .fromTo(
      projectsRef.current?.children || [],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.DURATION,
        stagger: ANIMATION_CONFIG.STAGGER,
        ease: ANIMATION_CONFIG.EASE
      },
      "-=0.3"
    );

    // Setup input focus animation
    if (searchRef.current) {
      searchRef.current.addEventListener('focus', () => {
        gsap.to(searchRef.current, {
          borderColor: 'rgba(79, 209, 197, 0.5)',
          boxShadow: '0 0 0 2px rgba(79, 209, 197, 0.25)',
          duration: ANIMATION_CONFIG.FOCUS.DURATION,
          ease: ANIMATION_CONFIG.FOCUS.EASE
        });
      });
      
      searchRef.current.addEventListener('blur', () => {
        gsap.to(searchRef.current, {
          borderColor: 'rgba(55, 65, 81, 0.5)',
          boxShadow: 'none',
          duration: ANIMATION_CONFIG.FOCUS.DURATION,
          ease: ANIMATION_CONFIG.FOCUS.EASE
        });
      });
    }

    // Setup clear button hover animation
    if (clearButtonRef.current) {
      clearButtonRef.current.addEventListener('mouseenter', () => {
        gsap.to(clearButtonRef.current, {
          color: '#4FD1C5', // accent color
          duration: ANIMATION_CONFIG.HOVER.DURATION,
          ease: ANIMATION_CONFIG.HOVER.EASE
        });
      });
      
      clearButtonRef.current.addEventListener('mouseleave', () => {
        gsap.to(clearButtonRef.current, {
          color: '#00FF9F', // primary color
          duration: ANIMATION_CONFIG.HOVER.DURATION,
          ease: ANIMATION_CONFIG.HOVER.EASE
        });
      });
    }

    return () => {
      if (searchRef.current) {
        searchRef.current.removeEventListener('focus', () => {});
        searchRef.current.removeEventListener('blur', () => {});
      }
      if (clearButtonRef.current) {
        clearButtonRef.current.removeEventListener('mouseenter', () => {});
        clearButtonRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  const animateFilterChange = useCallback(() => {
    if (!projectsRef.current) return;

    gsap.fromTo(
      projectsRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out"
      }
    );
  }, []);

  useEffect(() => {
    if (!isLoading) {
      animateFilterChange();
    }
  }, [filter, searchQuery, isLoading, animateFilterChange]);

  const handleButtonHover = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: ANIMATION_CONFIG.HOVER.SCALE,
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: ANIMATION_CONFIG.HOVER.EASE,
    });
  }, []);

  const handleButtonLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: ANIMATION_CONFIG.HOVER.EASE,
    });
  }, []);

  return (
    <div className="min-h-screen py-16 md:py-20 bg-gradient-to-b from-secondary to-gray-900">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <h1
          ref={headerRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-10 md:mb-16 text-center"
          style={{ willChange: "transform, opacity" }}
        >
          My Projects
        </h1>

        <div className="flex flex-col md:flex-row gap-6 mb-8 md:mb-12">
          <div className="w-full md:w-64 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 w-5 h-5" />
            </div>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl
                text-white placeholder-gray-400 focus:outline-none" style={{ willChange: "transform, opacity, box-shadow" }}
            />
          </div>

          <div ref={filterRef} className="flex flex-wrap gap-2 md:gap-4">
            {categories.map((category, index) => (
              <button
                key={category}
                ref={(el: HTMLButtonElement | null): void => { filterButtonsRef.current[index] = el }}
                className={`px-4 md:px-6 py-2 rounded-xl text-sm md:text-base font-medium ${
                  filter === category
                    ? "bg-primary text-secondary shadow-lg"
                    : "bg-gray-800/50 text-gray-300 border border-gray-700/50"
                }`}
                onClick={() => setFilter(category)}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                style={{ willChange: "transform" }}
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
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg md:text-xl mb-4">
              No projects found matching your criteria.
            </p>
            <button
              ref={clearButtonRef}
              onClick={() => {
                setFilter("All");
                setSearchQuery("");
              }}
              className="text-primary"
              style={{ willChange: "color" }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          isOpen={true}
        />
      )}
    </div>
  );
}
