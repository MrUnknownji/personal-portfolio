"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import Title from "@/components/ui/Title";
import { projects } from "@/data/data";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiSearch, FiX } from "react-icons/fi";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  FILTER: {
    OUT_DURATION: 0.3,
    OUT_STAGGER: 0.03,
    OUT_EASE: "power2.in",
    OUT_SCALE: 0.95,
    OUT_Y: 20,
    IN_DURATION: 0.4,
    IN_STAGGER: 0.06,
    IN_EASE: "power3.out",
    IN_SCALE: 0.95,
    IN_Y: -20,
  },
} as const;

export default function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

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

  useEffect(() => {
    gsap.delayedCall(0.01, () => {
      ScrollTrigger.refresh();
    });
  }, []);

  useGSAP(
    () => {
      animationContextRef.current = gsap.context(() => {
        const initialTl = gsap.timeline({
          defaults: { ease: ANIMATION_CONFIG.EASE, overwrite: "auto" },
        });

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
            0.2,
          );
        }

        if (searchRef.current) {
          const searchInput = searchRef.current;
          searchInput.addEventListener("focus", () => {
            gsap.to(searchInput, {
              borderColor: "var(--color-primary)",
              boxShadow: "0 0 0 2px rgba(0, 255, 159, 0.2)",
              duration: ANIMATION_CONFIG.FOCUS.DURATION,
              ease: ANIMATION_CONFIG.FOCUS.EASE,
              overwrite: true,
            });
          });
          searchInput.addEventListener("blur", () => {
            gsap.to(searchInput, {
              borderColor: "var(--color-neutral)",
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
              color: "var(--color-accent)",
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
              overwrite: true,
            });
          });
          clearButton.addEventListener("mouseleave", () => {
            gsap.to(clearButton, {
              color: "var(--color-primary)",
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
              overwrite: true,
            });
          });
        }
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
    if (filterTimelineRef.current) filterTimelineRef.current.kill();

    const existingCards = projectsRef.current.querySelectorAll(
      ".project-card-container",
    );

    if (!existingCards.length && !filteredProjects.length) {
      return;
    }

    setIsAnimating(true);

    filterTimelineRef.current = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        filterTimelineRef.current = null;
        gsap.set(".project-card-container", { clearProps: "all" });
      },
      defaults: {
        overwrite: "auto",
      },
    });

    if (existingCards.length > 0) {
      filterTimelineRef.current.to(existingCards, {
        opacity: 0,
        scale: ANIMATION_CONFIG.FILTER.OUT_SCALE,
        y: ANIMATION_CONFIG.FILTER.OUT_Y,
        duration: ANIMATION_CONFIG.FILTER.OUT_DURATION,
        stagger: ANIMATION_CONFIG.FILTER.OUT_STAGGER,
        ease: ANIMATION_CONFIG.FILTER.OUT_EASE,
      });
    } else {
      filterTimelineRef.current.to({}, { duration: 0.01 });
    }

    filterTimelineRef.current.add(() => {
      requestAnimationFrame(() => {
        const newCards = projectsRef.current?.querySelectorAll(
          ".project-card-container",
        );
        if (newCards?.length) {
          gsap.fromTo(
            newCards,
            {
              opacity: 0,
              scale: ANIMATION_CONFIG.FILTER.IN_SCALE,
              y: ANIMATION_CONFIG.FILTER.IN_Y,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: ANIMATION_CONFIG.FILTER.IN_DURATION,
              stagger: ANIMATION_CONFIG.FILTER.IN_STAGGER,
              ease: ANIMATION_CONFIG.FILTER.IN_EASE,
              clearProps: "transform, opacity",
            },
          );
        }
      });
    });
  }, [isAnimating, filteredProjects.length]);

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

  const clearSearch = () => {
    setSearchQuery("");
    searchRef.current?.focus();
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen md:py-20 lg:py-24 bg-gradient-to-b from-gray-950 via-secondary to-gray-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title title="My Projects" className="mb-8" showGlowBar />

        <div
          ref={controlsRef}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 md:mb-14"
        >
          <div className="w-full md:w-auto md:max-w-xs relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
              <FiSearch className="text-muted w-5 h-5" />
            </div>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 border rounded-xl
               bg-secondary/60 border-neutral/40 text-light placeholder-muted
                 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30
                 transition duration-200"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-2 flex items-center justify-center p-1 text-muted hover:text-light transition-colors rounded-full"
                aria-label="Clear search"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ease-out transform-gpu ${
                  filter === category
                    ? "bg-primary text-secondary shadow-md scale-105"
                    : "bg-frosted-dark text-muted hover:text-light hover:border-primary/40"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
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
          <div className="text-center py-16 opacity-0 animate-fade-in">
            <p className="text-muted text-lg md:text-xl mb-6">
              No projects found matching your criteria.
            </p>
            <button
              ref={clearButtonRef}
              onClick={() => {
                setFilter("All");
                setSearchQuery("");
              }}
              className="text-primary text-lg font-medium hover:text-accent transition-colors duration-200"
            >
              Clear Filters & Search
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
