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

const ANIMATION_CONFIG = {
  STAGGER: 0.08,
  DURATION: 0.6,
  EASE: "power3.out",
  HOVER: {
    DURATION: 0.2,
    EASE: "power2.out",
    SCALE: 1.03,
  },
  FOCUS: {
    DURATION: 0.3,
    EASE: "power2.out",
  },
  SCROLL_TRIGGER: {
    START: "top 85%",
    END: "bottom top",
    TOGGLE_ACTIONS: "play none none reset",
    STAGGER: 0.05,
    DURATION: 0.5,
    EASE: "power2.out",
  },
} as const;

export default function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const headerRef = useRef<HTMLHeadingElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const animationContextRef = useRef<gsap.Context | null>(null);
  const filterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const filteredProjects = projects.filter((project) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesCategory = filter === "All" || project.category === filter;
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(lowerQuery) ||
      project.shortDescription.toLowerCase().includes(lowerQuery) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(lowerQuery),
      );
    return matchesCategory && matchesSearch;
  });

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((project) => project.category))),
  ];

  useGSAP(
    () => {
      animationContextRef.current = gsap.context(() => {
        const initialTl = gsap.timeline({
          defaults: { ease: ANIMATION_CONFIG.EASE, overwrite: "auto" },
        });

        initialTl.fromTo(
          headerRef.current,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: ANIMATION_CONFIG.DURATION },
        );

        if (controlsRef.current && controlsRef.current.children.length > 0) {
          initialTl.fromTo(
            controlsRef.current.children,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: ANIMATION_CONFIG.DURATION,
              stagger: ANIMATION_CONFIG.STAGGER,
            },
            "-=0.3",
          );
        }

        if (searchRef.current) {
          const searchInput = searchRef.current;
          searchInput.addEventListener("focus", () => {
            gsap.to(searchInput, {
              borderColor: "rgba(79, 209, 197, 0.5)",
              boxShadow: "0 0 0 2px rgba(79, 209, 197, 0.25)",
              duration: ANIMATION_CONFIG.FOCUS.DURATION,
              ease: ANIMATION_CONFIG.FOCUS.EASE,
              overwrite: true,
            });
          });
          searchInput.addEventListener("blur", () => {
            gsap.to(searchInput, {
              borderColor: "rgba(55, 65, 81, 0.5)",
              boxShadow: "none",
              duration: ANIMATION_CONFIG.FOCUS.DURATION,
              ease: ANIMATION_CONFIG.FOCUS.EASE,
              overwrite: true,
            });
          });
        }

        if (clearButtonRef.current) {
          const clearButton = clearButtonRef.current;
          clearButton.addEventListener("mouseenter", () => {
            gsap.to(clearButton, {
              color: "#4FD1C5",
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
              overwrite: true,
            });
          });
          clearButton.addEventListener("mouseleave", () => {
            gsap.to(clearButton, {
              color: "#00FF9F",
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
              overwrite: true,
            });
          });
        }

        gsap.fromTo(
          ".project-card-container",
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.SCROLL_TRIGGER.DURATION,
            ease: ANIMATION_CONFIG.SCROLL_TRIGGER.EASE,
            stagger: ANIMATION_CONFIG.SCROLL_TRIGGER.STAGGER,
            scrollTrigger: {
              trigger: projectsRef.current,
              start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
              end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
              toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
            },
            clearProps: "transform, opacity",
          },
        );
      });

      return () => {
        animationContextRef.current?.revert();
        animationContextRef.current = null;
      };
    },
    { scope: pageRef },
  );

  const animateFilterChange = useCallback(() => {
    if (!projectsRef.current || isAnimating) return;

    setIsAnimating(true);

    if (filterTimelineRef.current) {
      filterTimelineRef.current.kill();
    }

    filterTimelineRef.current = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        filterTimelineRef.current = null;
        ScrollTrigger.refresh();
      },
      defaults: {
        ease: "power2.out",
        overwrite: "auto",
      },
    });

    filterTimelineRef.current
      .to(".project-card-container", {
        opacity: 0,
        y: 10,
        duration: 0.2,
        stagger: 0.02,
        clearProps: "all",
      })
      .add(() => {
        const cards = projectsRef.current?.querySelectorAll(
          ".project-card-container",
        );
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.05,
              clearProps: "all",
              onComplete: () => {
                gsap.set(cards, { clearProps: "all" });
              },
            },
          );
        }
      }, "+=0.1");
  }, [isAnimating]);

  useEffect(() => {
    animateFilterChange();

    return () => {
      if (filterTimelineRef.current) {
        filterTimelineRef.current.kill();
        filterTimelineRef.current = null;
      }
    };
  }, [filter, searchQuery, animateFilterChange]);

  const handleButtonHover = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isAnimating) return;
      gsap.to(e.currentTarget, {
        scale: ANIMATION_CONFIG.HOVER.SCALE,
        duration: ANIMATION_CONFIG.HOVER.DURATION,
        ease: ANIMATION_CONFIG.HOVER.EASE,
        overwrite: true,
      });
    },
    [isAnimating],
  );

  const handleButtonLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      gsap.to(e.currentTarget, {
        scale: 1,
        duration: ANIMATION_CONFIG.HOVER.DURATION,
        ease: ANIMATION_CONFIG.HOVER.EASE,
        overwrite: true,
        clearProps: "transform",
      });
    },
    [],
  );

  return (
    <div
      ref={pageRef}
      className="min-h-screen py-16 md:py-20 bg-gradient-to-b from-secondary to-gray-900"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <h1
          ref={headerRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-10 md:mb-16 text-center"
          style={{ willChange: "transform, opacity" }}
        >
          My Projects
        </h1>

        <div
          ref={controlsRef}
          className="flex flex-col md:flex-row gap-6 mb-8 md:mb-12"
          style={{ willChange: "transform, opacity" }}
        >
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
                text-white placeholder-gray-400 focus:outline-none"
              style={{
                willChange: "transform, opacity, box-shadow, border-color",
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 md:px-6 py-2 rounded-xl text-sm md:text-base font-medium transition-transform duration-200 ease-out ${
                  filter === category
                    ? "bg-primary text-secondary shadow-lg"
                    : "bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-gray-600"
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
            <div key={project.id} className="project-card-container">
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && !isAnimating && (
          <div className="text-center py-12 opacity-0 animate-fade-in">
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
