"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import Title from "@/components/ui/Title";
import { projects as allProjects } from "@/data/data";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiSearch, FiX } from "react-icons/fi";

const DISPLAY_ORDER = [9, 8, 7, 1, 10];
const TITLE_OVERRIDES: Record<number, string> = {
  8: "YouTube Content OS",
  7: "AuraEdit",
  10: "Omni Mart",
};

const projects = DISPLAY_ORDER.map((id) => {
  const project = allProjects.find((p) => p.id === id);
  if (project && TITLE_OVERRIDES[id]) {
    return { ...project, title: TITLE_OVERRIDES[id] };
  }
  return project;
}).filter(Boolean) as Project[];

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  EASE: "power3.out",
} as const;

const orderedProjectIds = (projectIds: number[]) => {
  const idSet = new Set(projectIds);
  return projects
    .filter((project) => idSet.has(project.id))
    .map((project) => project.id);
};

const projectIdSetsMatch = (a: number[], b: number[]) => {
  if (a.length !== b.length) return false;
  return a.every((id, index) => id === b[index]);
};

export default function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedProjectIds, setDisplayedProjectIds] = useState(() =>
    projects.map((project) => project.id),
  );
  const [isGridTransitioning, setIsGridTransitioning] = useState(false);
  const [stableGridMinHeight, setStableGridMinHeight] = useState<number | null>(
    null,
  );

  const controlsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const titleSectionRef = useRef<HTMLDivElement>(null);
  const activeGridTransitionRef = useRef<gsap.core.Animation | null>(null);
  const displayedProjectIdsRef = useRef(displayedProjectIds);

  const particlesRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(projects.map((project) => project.category))),
    ],
    [],
  );

  const filteredProjects = useMemo(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory = filter === "All" || project.category === filter;
      const matchesSearch =
        lowerQuery.length === 0 ||
        project.title.toLowerCase().includes(lowerQuery) ||
        project.shortDescription.toLowerCase().includes(lowerQuery) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(lowerQuery),
        );

      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery]);

  const targetProjectIds = useMemo(
    () => filteredProjects.map((project) => project.id),
    [filteredProjects],
  );

  const displayedProjects = useMemo(() => {
    const displayedIdSet = new Set(displayedProjectIds);
    return projects.filter((project) => displayedIdSet.has(project.id));
  }, [displayedProjectIds]);

  useEffect(() => {
    displayedProjectIdsRef.current = displayedProjectIds;
  }, [displayedProjectIds]);

  useGSAP(
    () => {
      const initialTl = gsap.timeline({
        defaults: { ease: ANIMATION_CONFIG.EASE, overwrite: "auto" },
      });

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
            ease: "power3.out",
          },
          0,
        );
      }

      if (controlsRef.current) {
        initialTl.fromTo(
          controlsRef.current,
          {
            opacity: 0,
            y: -40,
            scale: 0.95,
            rotationX: -15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.9,
            ease: "back.out(1.5)",
          },
          0.3,
        );
      }

      const cards = projectsRef.current?.querySelectorAll(
        ".project-card-container",
      );
      if (cards && cards.length > 0) {
        gsap.set(cards, {
          opacity: 0,
          y: 32,
          scale: 0.96,
        });

        initialTl.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });
      }
    },
    { scope: pageRef, dependencies: [] },
  );

  useEffect(() => {
    const projectGrid = projectsRef.current;
    if (!projectGrid) return;

    const nextProjectIds = orderedProjectIds(targetProjectIds);
    if (projectIdSetsMatch(displayedProjectIdsRef.current, nextProjectIds)) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const currentCards = Array.from(
      projectGrid.querySelectorAll<HTMLElement>(".project-card-container"),
    );

    activeGridTransitionRef.current?.kill();
    gsap.killTweensOf([projectGrid, ...currentCards]);
    gsap.set(projectGrid, {
      clearProps: "transform,opacity,visibility,filter",
    });
    gsap.set(currentCards, {
      clearProps: "transform,opacity,visibility,filter",
    });

    if (prefersReducedMotion) {
      displayedProjectIdsRef.current = nextProjectIds;
      setDisplayedProjectIds(nextProjectIds);
      setIsGridTransitioning(false);
      return;
    }

    setIsGridTransitioning(true);

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onInterrupt: () => {
        activeGridTransitionRef.current = null;
        setIsGridTransitioning(false);
        gsap.set(projectGrid.querySelectorAll(".project-card-container"), {
          clearProps: "transform,opacity,visibility,filter",
        });
      },
    });

    activeGridTransitionRef.current = transition;

    transition
      .to(currentCards, {
        autoAlpha: 0,
        scale: 0.96,
        filter: "blur(6px)",
        duration: 0.18,
        ease: "power2.in",
        stagger: 0.015,
      })
      .call(() => {
        gsap.set(projectGrid, { autoAlpha: 0 });
        displayedProjectIdsRef.current = nextProjectIds;
        setDisplayedProjectIds(nextProjectIds);

        requestAnimationFrame(() => {
          const nextCards = projectsRef.current?.querySelectorAll<HTMLElement>(
            ".project-card-container",
          );

          if (!nextCards || nextCards.length === 0) {
            activeGridTransitionRef.current = null;
            setIsGridTransitioning(false);
            gsap.set(projectGrid, {
              clearProps: "transform,opacity,visibility,filter",
            });
            ScrollTrigger.refresh();
            return;
          }

          gsap.set(nextCards, {
            autoAlpha: 0,
            scale: 0.96,
            filter: "blur(6px)",
          });
          gsap.set(projectGrid, { autoAlpha: 1 });

          const enterTransition = gsap.to(nextCards, {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.24,
            ease: "power2.out",
            stagger: 0.025,
            clearProps: "transform,opacity,visibility,filter",
            onComplete: () => {
              activeGridTransitionRef.current = null;
              setIsGridTransitioning(false);
              gsap.set(projectGrid, {
                clearProps: "transform,opacity,visibility,filter",
              });
              ScrollTrigger.refresh();
            },
          });

          activeGridTransitionRef.current = enterTransition;
        });
      });

    return () => transition.kill();
  }, [targetProjectIds]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!particlesRef.current) return;

      const particles = particlesRef.current.children;
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;

      Array.from(particles).forEach((particle) => {
        const speed = Number(particle.getAttribute("data-speed")) || 0.1;
        const dampening = 0.4;

        gsap.to(particle, {
          x: x * speed * dampening,
          y: y * speed * dampening,
          duration: 1.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    const projectGrid = projectsRef.current;
    if (!projectGrid) return;

    const updateStableHeight = () => {
      setStableGridMinHeight((currentHeight) => {
        const nextHeight = projectGrid.offsetHeight;
        return Math.max(currentHeight || 0, nextHeight);
      });
    };

    updateStableHeight();

    const resizeObserver = new ResizeObserver(updateStableHeight);
    resizeObserver.observe(projectGrid);

    window.addEventListener("resize", updateStableHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateStableHeight);
    };
  }, []);

  useEffect(() => {
    const handleOpenProject = (event: Event) => {
      const customEvent = event as CustomEvent<{ id?: number; title?: string }>;
      const requestedProject = projects.find((project) => {
        if (customEvent.detail?.id) return project.id === customEvent.detail.id;
        return (
          customEvent.detail?.title &&
          project.title.toLowerCase() === customEvent.detail.title.toLowerCase()
        );
      });

      if (requestedProject) {
        setSelectedProject(requestedProject);
      }
    };

    window.addEventListener("portfolio:open-project", handleOpenProject);
    return () =>
      window.removeEventListener("portfolio:open-project", handleOpenProject);
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    searchRef.current?.focus();
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen pt-24 pb-20 md:pb-28 lg:pb-32 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={titleSectionRef}
          className="mb-12 md:mb-16 text-center relative pt-12"
        >
          <Title
            title="My Projects"
            subtitle="A collection of my work, experiments, and open source contributions."
            showGlowBar={false}
            className="mb-4"
          />

          <div
            ref={particlesRef}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/4" data-speed="0.15">
              <div
                className="w-1 h-1 rounded-full bg-primary/30 animate-float"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
            <div className="absolute top-1/3 right-1/4" data-speed="0.25">
              <div
                className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-float"
                style={{ animationDelay: "1s" }}
              />
            </div>
            <div className="absolute bottom-1/3 left-1/3" data-speed="0.1">
              <div
                className="w-1 h-1 rounded-full bg-accent/20 animate-float"
                style={{ animationDelay: "1.5s" }}
              />
            </div>
          </div>
        </div>

        <div className="sticky top-24 z-30 mb-8 md:mb-16 mx-auto max-w-5xl px-4">
          <div ref={controlsRef} className="relative z-30 flex justify-center">
            <div className="relative bg-background/80 backdrop-blur-md border border-border/50 rounded-4xl lg:rounded-full p-2 shadow-lg shadow-black/10 flex flex-col lg:flex-row gap-3 lg:gap-2 items-center w-full max-w-4xl">
              <div className="absolute inset-0 bg-linear-to-br from-white/2 via-transparent to-primary/2 pointer-events-none rounded-4xl lg:rounded-full" />

              <div className="relative w-full lg:flex-1 group rounded-full border border-border/50 bg-foreground/4 transition-all duration-300 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-foreground/6 hover:bg-foreground/6">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                  <FiSearch className="text-muted-foreground group-focus-within:text-primary transition-colors duration-300 w-4 h-4 md:w-5 md:h-5" />
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search by name, tech..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full pl-12 pr-12 py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-sm md:text-base rounded-full relative z-10 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={(e) => {
                      const button = e.currentTarget;
                      clearSearch();
                      gsap.fromTo(
                        button,
                        { scale: 1, rotation: 0 },
                        {
                          scale: 0.8,
                          rotation: 90,
                          duration: 0.15,
                          ease: "power2.in",
                          onComplete: () => {
                            gsap.to(button, {
                              scale: 1,
                              duration: 0.15,
                              ease: "back.out(2)",
                            });
                          },
                        },
                      );
                    }}
                    className="absolute inset-y-0 right-4 flex items-center justify-center text-muted-foreground hover:text-foreground hover:rotate-90 transition-all duration-300 z-20 hover:scale-110"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div
                className="flex overflow-x-auto gap-2 w-full lg:w-auto items-center px-2 pb-2 lg:pb-0 relative z-10 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={filter === category}
                    onClick={(e) => {
                      setFilter(category);
                      const button = e.currentTarget;
                      gsap.fromTo(
                        button,
                        { scale: 0.95 },
                        {
                          scale: 1,
                          duration: 0.3,
                          ease: "back.out(2)",
                        },
                      );
                    }}
                    className={`
                    relative whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden shrink-0
                    ${
                      filter === category
                        ? "text-dark bg-primary scale-105 font-semibold"
                        : "text-muted-foreground hover:text-foreground bg-transparent hover:bg-foreground/10 border border-transparent hover:scale-105"
                    }
                  `}
                  >
                    {filter === category && (
                      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" />
                    )}
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
            transformStyle: "preserve-3d",
            minHeight: stableGridMinHeight
              ? `${stableGridMinHeight}px`
              : undefined,
          }}
        >
          {displayedProjects.map((project) => (
            <div key={project.id} className="project-card-container">
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && !isGridTransitioning && (
          <div className="text-center py-20 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 ring-1 ring-white/10 animate-float">
              <FiSearch className="w-10 h-10 text-muted/50 animate-pulse-subtle" />
            </div>
            <h3 className="text-2xl font-semibold text-light mb-3">
              No projects found
            </h3>
            <p className="text-muted mb-8 max-w-md mx-auto">
              We couldn&apos;t find any projects matching your criteria. Try
              adjusting your search terms or selecting a different category.
            </p>
            <button
              type="button"
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
