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
  STAGGER: 0.12,
  DURATION: 0.8,
  EASE: "power3.out",
  FILTER: {
    // Extraordinary exit animation - 3D scatter with magnetic dispersion
    OUT_DURATION: 0.65,
    OUT_STAGGER: 0.05,
    OUT_EASE: "power3.in",
    OUT_SCALE: 0.5,
    OUT_Y: 100,
    OUT_ROTATION: 180,
    OUT_ROTATION_Y: 90,
    OUT_ROTATION_X: -45,
    OUT_BLUR: 10,

    // Extraordinary entrance animation - magnetic gather with 3D flip
    IN_DURATION: 0.85,
    IN_STAGGER: 0.08,
    IN_EASE: "elastic.out(1, 0.75)",
    IN_SCALE: 0.3,
    IN_Y: -80,
    IN_ROTATION: -180,
    IN_ROTATION_Y: -90,
    IN_ROTATION_X: 45,
  },
  SCROLL: {
    START: "top 80%",
    END: "bottom 20%",
    BATCH_DELAY: 0.15,
  },
} as const;

export default function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRegeneratingGrid, setIsRegeneratingGrid] = useState(false);
  const [displayedProjects, setDisplayedProjects] = useState(projects);

  const controlsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const titleSectionRef = useRef<HTMLDivElement>(null);
  const animationContextRef = useRef<gsap.Context | null>(null);
  const filterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

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

        // Animate title section with elegant entrance
        if (titleSectionRef.current) {
          initialTl.fromTo(
            titleSectionRef.current,
            {
              opacity: 0,
              y: 50,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "power3.out"
            },
            0
          );
        }

        // Animate controls with a bounce effect
        if (controlsRef.current) {
          initialTl.fromTo(
            controlsRef.current,
            {
              opacity: 0,
              y: -40,
              scale: 0.95,
              rotationX: -15
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: 0.9,
              ease: "back.out(1.5)"
            },
            0.3
          );
        }

        // Creative wave-pattern entrance for project cards
        const cards = projectsRef.current?.querySelectorAll(".project-card-container");
        if (cards && cards.length > 0) {
          // Immediately set initial state to prevent flicker
          gsap.set(cards, {
            opacity: 0,
            y: 80,
            rotationX: 20,
            scale: 0.85,
          });

          // Calculate position-based delays for wave effect
          cards.forEach((card, index) => {
            const row = Math.floor(index / 3); // Assuming 3 columns on desktop
            const col = index % 3;

            // Create wave pattern: diagonal wave from top-left to bottom-right
            const diagonalDelay = (row + col) * 0.1;

            gsap.to(
              card,
              {
                opacity: 1,
                y: 0,
                rotationX: 0,
                scale: 1,
                duration: 1,
                ease: "power3.out",
                delay: 0.5 + diagonalDelay,

              }
            );
          });


        }
      });

      return () => {
        animationContextRef.current?.revert();
        animationContextRef.current = null;
      };
    },
    { scope: pageRef }
  );

  const handleSearchFocus = contextSafe(() => {
    if (searchContainerRef.current) {
      gsap.to(searchContainerRef.current, {
        borderColor: "rgba(0, 255, 159, 0.5)",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "0 0 0 1px rgba(0, 255, 159, 0.2), 0 8px 16px rgba(0, 0, 0, 0.2)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });

  const handleSearchBlur = contextSafe(() => {
    if (searchContainerRef.current) {
      gsap.to(searchContainerRef.current, {
        borderColor: "rgba(255, 255, 255, 0.06)",
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        boxShadow: "0 0 0 0px rgba(0, 255, 159, 0)",
        duration: 0.3,
        ease: "power2.in"
      });
    }
  });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!particlesRef.current) return;

      const particles = particlesRef.current.children;
      // Calculate relative to center of screen
      const x = (e.clientX - window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2);

      Array.from(particles).forEach((particle) => {
        const speed = Number(particle.getAttribute("data-speed")) || 0.1;
        // Apply dampening factor to reduce speed significantly
        const dampening = 0.4;

        gsap.to(particle, {
          x: x * speed * dampening,
          y: y * speed * dampening,
          duration: 1.5, // Slower duration for smoother "floating" feel
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  const animateFilterChange = useCallback(() => {
    if (!projectsRef.current || isAnimating) return;

    // Kill any existing animations
    if (filterTimelineRef.current) {
      filterTimelineRef.current.kill();
      filterTimelineRef.current = null;
    }

    const existingCards = Array.from(
      projectsRef.current.querySelectorAll(".project-card-container")
    );

    // Check if filter actually changed
    const newFilteredProjects = projects.filter((project) => {
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

    // If same projects, don't animate
    if (JSON.stringify(newFilteredProjects.map(p => p.id)) === JSON.stringify(displayedProjects.map(p => p.id))) {
      return;
    }

    setIsAnimating(true);

    // Exit animation with extraordinary 3D scatter effect
    if (existingCards.length > 0) {
      existingCards.forEach((card, index) => {
        // Calculate random scatter directions for magnetic dispersion
        const angle = (index * 360) / existingCards.length;
        const scatterX = Math.cos(angle * Math.PI / 180) * 150;
        const scatterY = Math.sin(angle * Math.PI / 180) * 100;

        gsap.to(card, {
          opacity: 0,
          scale: ANIMATION_CONFIG.FILTER.OUT_SCALE,
          x: scatterX,
          y: scatterY + ANIMATION_CONFIG.FILTER.OUT_Y,
          rotationZ: ANIMATION_CONFIG.FILTER.OUT_ROTATION,
          rotationY: ANIMATION_CONFIG.FILTER.OUT_ROTATION_Y,
          rotationX: ANIMATION_CONFIG.FILTER.OUT_ROTATION_X,
          filter: `blur(${ANIMATION_CONFIG.FILTER.OUT_BLUR}px)`,
          transformOrigin: "center center",
          duration: ANIMATION_CONFIG.FILTER.OUT_DURATION,
          ease: ANIMATION_CONFIG.FILTER.OUT_EASE,
          delay: index * ANIMATION_CONFIG.FILTER.OUT_STAGGER,
          onComplete: index === existingCards.length - 1 ? () => {
            // Update displayed projects after exit animation
            setIsRegeneratingGrid(true);
            setDisplayedProjects(newFilteredProjects);

            // Wait for React to render new cards, then animate them in
            setTimeout(() => {
              const newCards = Array.from(
                projectsRef.current?.querySelectorAll(".project-card-container") || []
              );

              if (newCards.length > 0) {
                // Set initial state with 3D position
                newCards.forEach((card, idx) => {
                  const angle = (idx * 360) / newCards.length;
                  const gatherX = Math.cos(angle * Math.PI / 180) * 200;
                  const gatherY = Math.sin(angle * Math.PI / 180) * 150;

                  gsap.set(card, {
                    opacity: 0,
                    scale: ANIMATION_CONFIG.FILTER.IN_SCALE,
                    x: gatherX,
                    y: gatherY + ANIMATION_CONFIG.FILTER.IN_Y,
                    rotationZ: ANIMATION_CONFIG.FILTER.IN_ROTATION,
                    rotationY: ANIMATION_CONFIG.FILTER.IN_ROTATION_Y,
                    rotationX: ANIMATION_CONFIG.FILTER.IN_ROTATION_X,
                    filter: "blur(15px)",
                    transformOrigin: "center center",
                  });
                });

                // Animate in with magnetic gather and 3D flip
                newCards.forEach((card, idx) => {
                  gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotationZ: 0,
                    rotationY: 0,
                    rotationX: 0,
                    filter: "blur(0px)",
                    transformOrigin: "center center",
                    duration: ANIMATION_CONFIG.FILTER.IN_DURATION,
                    ease: ANIMATION_CONFIG.FILTER.IN_EASE,
                    delay: idx * ANIMATION_CONFIG.FILTER.IN_STAGGER,
                    onComplete: idx === newCards.length - 1 ? () => {
                      // Ensure filter is cleared but keep transforms to match initial state
                      newCards.forEach((c) => {
                        gsap.set(c, { clearProps: "filter" });
                      });
                      setIsRegeneratingGrid(false);
                      setIsAnimating(false);
                      ScrollTrigger.refresh();
                    } : undefined
                  });
                });
              } else {
                setIsAnimating(false);
                ScrollTrigger.refresh();
              }
            }, 100);
          } : undefined
        });
      });
    } else {
      // No existing cards, just update and animate in new ones
      setIsRegeneratingGrid(true);
      setDisplayedProjects(newFilteredProjects);

      setTimeout(() => {
        const newCards = Array.from(
          projectsRef.current?.querySelectorAll(".project-card-container") || []
        );

        if (newCards.length > 0) {
          newCards.forEach((card, idx) => {
            const angle = (idx * 360) / newCards.length;
            const gatherX = Math.cos(angle * Math.PI / 180) * 200;
            const gatherY = Math.sin(angle * Math.PI / 180) * 150;

            gsap.set(card, {
              opacity: 0,
              scale: ANIMATION_CONFIG.FILTER.IN_SCALE,
              x: gatherX,
              y: gatherY + ANIMATION_CONFIG.FILTER.IN_Y,
              rotationZ: ANIMATION_CONFIG.FILTER.IN_ROTATION,
              rotationY: ANIMATION_CONFIG.FILTER.IN_ROTATION_Y,
              rotationX: ANIMATION_CONFIG.FILTER.IN_ROTATION_X,
              filter: "blur(15px)",
              transformOrigin: "center center",
            });
          });

          newCards.forEach((card, idx) => {
            gsap.to(card, {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              rotationZ: 0,
              rotationY: 0,
              rotationX: 0,
              filter: "blur(0px)",
              transformOrigin: "center center",
              duration: ANIMATION_CONFIG.FILTER.IN_DURATION,
              ease: ANIMATION_CONFIG.FILTER.IN_EASE,
              delay: idx * ANIMATION_CONFIG.FILTER.IN_STAGGER,
              onComplete: idx === newCards.length - 1 ? () => {
                // Ensure filter is cleared but keep transforms to match initial state
                newCards.forEach((c) => {
                  gsap.set(c, { clearProps: "filter" });
                });
                setIsRegeneratingGrid(false);
                setIsAnimating(false);
                ScrollTrigger.refresh();
              } : undefined
            });
          });
        } else {
          setIsAnimating(false);
          ScrollTrigger.refresh();
        }
      }, 50);
    }
  }, [isAnimating, filter, searchQuery, displayedProjects, projects]);

  useEffect(() => {
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
    <div ref={pageRef} className="min-h-screen pt-24 pb-20 md:pb-28 lg:pb-32 relative overflow-hidden">
      {/* Refined ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-60 right-1/3 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-40 left-1/3 w-[300px] h-[300px] bg-accent/[0.02] rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Title Section */}
        <div
          ref={titleSectionRef}
          className="mb-16 md:mb-20 text-center relative"
        >
          {/* Refined decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {/* Left accent line */}
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-primary" />
            {/* Center diamond */}
            <div className="relative">
              <div className="w-2 h-2 rotate-45 bg-primary/60" />
              <div className="absolute inset-0 w-2 h-2 rotate-45 bg-primary/30 blur-sm" />
            </div>
            {/* Right accent line */}
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent via-primary/50 to-primary" />
          </div>

          <div className="pt-12">
            <Title
              title="My Projects"
              subtitle="A collection of my work, experiments, and open source contributions."
              className="mb-8"
            />
          </div>

          {/* Enhanced decorative dots with sophisticated animation */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {[0, 0.15, 0.3, 0.15, 0].map((opacity, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`w-1.5 h-1.5 rounded-full bg-primary animate-pulse-scale`}
                  style={{
                    animationDelay: `${idx * 0.2}s`,
                    opacity: 0.4 + opacity
                  }}
                />
                {idx === 2 && (
                  <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-primary/20 blur-md" />
                )}
              </div>
            ))}
          </div>

          {/* Floating accent particles */}
          <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/4" data-speed="0.15">
              <div className="w-1 h-1 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute top-1/3 right-1/4" data-speed="0.25">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute bottom-1/3 left-1/3" data-speed="0.1">
              <div className="w-1 h-1 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>

        {/* Enhanced Controls Section */}
        <div className="sticky top-24 z-30 mb-12 md:mb-16 mx-auto max-w-4xl">
          <div
            ref={controlsRef}
            className="relative"
          >
            <div className="relative bg-secondary/95 border border-white/[0.08] rounded-2xl p-3 md:p-4 shadow-2xl flex flex-col md:flex-row gap-3.5 overflow-hidden">
              {/* Refined gradient overlay with depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-primary/[0.02] pointer-events-none" />

              {/* Subtle top highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div
                ref={searchContainerRef}
                className="relative flex-1 group rounded-xl border border-border bg-card/50"
              >
                {/* Search icon glow on focus */}
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                  <FiSearch className="text-muted group-focus-within:text-primary transition-all duration-300 w-4 h-4 md:w-5 md:h-5" />
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search by name, tech, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="w-full pl-10 pr-10 py-3 md:py-3.5 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-sm md:text-base rounded-xl relative z-10 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={(e) => {
                      clearSearch();
                      // Animate the button
                      gsap.fromTo(e.currentTarget,
                        { scale: 1, rotation: 0 },
                        {
                          scale: 0.8,
                          rotation: 90,
                          duration: 0.15,
                          ease: "power2.in",
                          onComplete: () => {
                            gsap.to(e.currentTarget, {
                              scale: 1,
                              duration: 0.15,
                              ease: "back.out(2)"
                            });
                          }
                        }
                      );
                    }}
                    className="absolute inset-y-0 right-3 flex items-center justify-center text-muted hover:text-primary hover:rotate-90 transition-all duration-300 z-20 hover:scale-110"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex overflow-hidden pb-1 md:pb-0 gap-2 md:gap-2.5 md:flex-wrap md:justify-end items-center px-1 relative z-10">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={(e) => {
                      setFilter(category);
                      // Ripple effect on click
                      const button = e.currentTarget;
                      gsap.fromTo(button,
                        { scale: 0.95 },
                        {
                          scale: 1,
                          duration: 0.3,
                          ease: "back.out(2)"
                        }
                      );
                    }}
                    className={`
                    relative whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden flex-shrink-0
                    ${filter === category
                        ? "text-primary-foreground bg-primary shadow-lg shadow-primary/[0.15] scale-105 border border-primary/20"
                        : "text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card border border-border hover:border-primary/20 hover:scale-105"
                      }
                  `}
                  >
                    {/* Active shimmer effect */}
                    {filter === category && (
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    )}

                    {/* Refined active state glow */}
                    {filter === category && (
                      <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                    )}

                    {/* Button text */}
                    <span className="relative z-10">{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          style={{
            perspective: "2000px",
            transformStyle: "preserve-3d"
          }}
        >
          {displayedProjects.map((project) => (
            <div key={project.id} className={`project-card-container ${isRegeneratingGrid ? 'opacity-0' : ''}`}>
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </div>
          ))}
        </div>

        {displayedProjects.length === 0 && !isAnimating && (
          <div className="text-center py-20 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 ring-1 ring-white/10 animate-float">
              <FiSearch className="w-10 h-10 text-muted/50 animate-pulse-subtle" />
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
              className="group px-8 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-dark transition-all duration-300 font-medium border border-primary/20 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Clear All Filters
                <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </span>
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
