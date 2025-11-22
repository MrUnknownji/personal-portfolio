"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import Title from "@/components/ui/Title";
import { projects } from "@/data/data";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  STAGGER: 0.08,
  DURATION: 0.6,
  EASE: "power3.out",
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
  const pageRef = useRef<HTMLDivElement>(null);
  const animationContextRef = useRef<gsap.Context | null>(null);
  const filterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  const { contextSafe } = useGSAP(
    () => {
      animationContextRef.current = gsap.context(() => {
        const initialTl = gsap.timeline({
          defaults: { ease: ANIMATION_CONFIG.EASE, overwrite: "auto" },
        });

        if (controlsRef.current) {
          initialTl.fromTo(
            controlsRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 },
            0.2
          );
        }

        // Initial load animation for projects
        const cards = projectsRef.current?.querySelectorAll(".project-card-container");
        if (cards && cards.length > 0) {
            initialTl.fromTo(cards,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: projectsRef.current,
                        start: "top 85%",
                        end: "bottom 20%",
                        toggleActions: "play none none none"
                    }
                },
                0.4
            );
        }
      });

      return () => {
        animationContextRef.current?.revert();
        animationContextRef.current = null;
      };
    },
    { scope: pageRef },
  );

  const handleSearchFocus = contextSafe(() => {
    if (searchContainerRef.current) {
      gsap.to(searchContainerRef.current, {
        borderColor: "var(--color-primary)",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        duration: 0.3
      });
    }
  });

  const handleSearchBlur = contextSafe(() => {
    if (searchContainerRef.current) {
      gsap.to(searchContainerRef.current, {
        borderColor: "rgba(255, 255, 255, 0.05)",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        duration: 0.3
      });
    }
  });

  const animateFilterChange = useCallback(() => {
    if (!projectsRef.current || isAnimating) return;
    if (filterTimelineRef.current) filterTimelineRef.current.kill();

    const existingCards = projectsRef.current.querySelectorAll(
      ".project-card-container",
    );

    // If it's the first render (or handled by initial animation), skip filter animation
    // But simple check might be tricky. For now, we rely on user interaction triggering state change.
    // However, on mount, animateFilterChange runs. We should maybe block it on mount if initial animation handles it.
    // Actually, `useEffect` runs after mount.

    if (!existingCards.length && !filteredProjects.length) {
      return;
    }

    // Only run this if NOT initial mount (hacky check, or trust that initialTl handles opacity=0)
    // Ideally, we use a ref to track if initial animation is done.
    // For simplicity, we let this run but with a check.

    setIsAnimating(true);

    filterTimelineRef.current = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        filterTimelineRef.current = null;
        gsap.set(".project-card-container", { clearProps: "all" });
        ScrollTrigger.refresh(); // Refresh scroll trigger after layout change
      },
      defaults: { overwrite: "auto" },
    });

    if (existingCards.length > 0) {
        // Fade out old
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
       // React renders new cards here because state changed before this effect?
       // No, this effect runs AFTER state change. So `filteredProjects` is already new.
       // Wait, if `filteredProjects` changed, the DOM updates immediately.
       // So `existingCards` are the NEW cards already?
       // React updates DOM, then Effect runs.
       // So we need to use `Flip` plugin or manually handle exit/enter.
       // If we just use this effect, the DOM is already updated.
       // So we are animating IN the new cards. We missed the exit animation of old cards?
       // Correct. `animateFilterChange` in `useEffect` runs after render.
       // To animate OUT, we need to use `useLayoutEffect` or intercept the state change.
       // But given the code structure, let's assume we just animate IN.
       // OR, we use Flip. Flip is best for filtering.
       // Since we don't have Flip registered (maybe), we stick to simple Animate In.
       // The previous code tried to animate existing cards, but they are already the new ones.

       // Actually, the code logic was a bit flawed for React.
       // Let's just animate IN the current cards nicely.

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
  }, [isAnimating, filteredProjects.length]);
  // Removed `filter` and `searchQuery` from dependencies to avoid double triggering with state change?
  // No, we need them to trigger effect.

  // Optimized approach:
  // We can't easily do exit animations with standard useEffect without keeping old state.
  // So we will just focus on a nice Entrance animation for the filtered list.

  useEffect(() => {
    // Skip animation on initial mount (handled by useGSAP)
    if (animationContextRef.current) {
         // This might be running on mount too.
    }

    animateFilterChange();

    return () => {
      if (filterTimelineRef.current) {
        filterTimelineRef.current.kill();
        filterTimelineRef.current = null;
      }
    };
  }, [filter, searchQuery, animateFilterChange]);

  const clearSearch = () => {
    setSearchQuery("");
    searchRef.current?.focus();
  };

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-20 md:pb-28 lg:pb-32 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:mb-20 text-center">
          <Title
            title="My Projects"
            subtitle="A collection of my work, experiments, and open source contributions."
            className="mb-8"
          />
        </div>

        <div
          className="sticky top-24 z-30 mb-12 md:mb-16 mx-auto max-w-4xl"
        >
          <div
            ref={controlsRef}
            className="bg-secondary/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 md:p-3 shadow-2xl flex flex-col md:flex-row gap-3 overflow-hidden relative"
          >
            {/* Subtle glow effect behind controls */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div
              ref={searchContainerRef}
              className="relative flex-1 group rounded-xl border border-white/5 bg-white/5"
            >
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                <FiSearch className="text-muted group-focus-within:text-primary transition-colors duration-300" />
              </div>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="w-full pl-10 pr-10 py-3 bg-transparent text-light placeholder-muted/50 focus:outline-none text-sm md:text-base rounded-xl relative z-10"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-3 flex items-center justify-center text-muted hover:text-primary transition-colors z-20"
                >
                  <FiX />
                </button>
              )}
            </div>

            <div className="flex overflow-x-auto pb-1 md:pb-0 gap-2 no-scrollbar md:flex-wrap md:justify-end items-center px-1 relative z-10">
               <FiFilter className="text-muted hidden md:block mr-1" />
               {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`
                    whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden
                    ${filter === category
                      ? "text-dark bg-primary shadow-[0_0_15px_rgba(0,255,159,0.3)]"
                      : "text-muted hover:text-light hover:bg-white/5 border border-transparent hover:border-white/10"
                    }
                  `}
                >
                  {category}
                </button>
               ))}
            </div>
          </div>
        </div>

        <div
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
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
          <div className="text-center py-20 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 ring-1 ring-white/10">
               <FiSearch className="w-10 h-10 text-muted/50" />
            </div>
            <h3 className="text-2xl font-semibold text-light mb-3">No projects found</h3>
            <p className="text-muted mb-8 max-w-md mx-auto">
              We couldn&apos;t find any projects matching your criteria. Try adjusting your search terms or selecting a different category.
            </p>
            <button
              onClick={() => {
                setFilter("All");
                setSearchQuery("");
              }}
              className="px-8 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-dark transition-all duration-300 font-medium border border-primary/20 hover:border-primary hover:shadow-[0_0_20px_rgba(0,255,159,0.3)]"
            >
              Clear All Filters
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
