"use client";
import { useState, useRef, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import ProjectCard from "@/components/ProjectCard";
import Title from "@/components/ui/Title";
import { Project, ProjectSummary } from "@/types/Project";
import { FiSearch, FiX } from "react-icons/fi";

const loadProjectModal = () => import("@/components/ProjectModal");
const ProjectModal = dynamic(loadProjectModal, {
  ssr: false,
  loading: () => (
    <p className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">
      Loading project details…
    </p>
  ),
});

const projectCache = new Map<number, Project>();
const projectRequests = new Map<number, Promise<Project>>();

const loadProjectData = (projectId: number) => {
  const cached = projectCache.get(projectId);
  if (cached) return Promise.resolve(cached);

  const pending = projectRequests.get(projectId);
  if (pending) return pending;

  const request = fetch(`/api/projects/${projectId}`)
    .then(async (response) => {
      if (!response.ok) throw new Error("Project details could not be loaded.");
      return (await response.json()) as Project;
    })
    .then((project) => {
      projectCache.set(projectId, project);
      return project;
    })
    .catch((error) => {
      projectRequests.delete(projectId);
      throw error;
    });

  projectRequests.set(projectId, request);
  return request;
};

function preloadProjectExperience(projectId: number) {
  void Promise.all([loadProjectData(projectId), loadProjectModal()]).catch(
    () => undefined,
  );
}

export default function ProjectsPage({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");
  const [filterRevision, setFilterRevision] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const [projectLoadError, setProjectLoadError] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(projects.map((project) => project.category))),
    ],
    [projects],
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
  }, [filter, projects, searchQuery]);

  const openProject = useCallback(async (projectId: number) => {
    setIsProjectLoading(true);
    setProjectLoadError(null);

    try {
      const project = await loadProjectData(projectId);
      setSelectedProject(project);
    } catch {
      setProjectLoadError("Project details could not be loaded. Please try again.");
    } finally {
      setIsProjectLoading(false);
    }
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    searchRef.current?.focus();
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-28 lg:pb-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 md:mb-16 text-center relative pt-12">
          <Title
            as="h1"
            title="Selected Work"
            subtitle="Production-minded web, mobile, and AI product builds with demos, source links, screenshots, and architecture notes."
            showGlowBar={false}
            className="mb-4"
          />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/4">
              <div
                className="w-1 h-1 rounded-full bg-primary/30 animate-float"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
            <div className="absolute top-1/3 right-1/4">
              <div
                className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-float"
                style={{ animationDelay: "1s" }}
              />
            </div>
            <div className="absolute bottom-1/3 left-1/3">
              <div
                className="w-1 h-1 rounded-full bg-accent/20 animate-float"
                style={{ animationDelay: "1.5s" }}
              />
            </div>
          </div>
        </div>

        <div className="sticky top-24 z-30 mb-8 md:mb-16 mx-auto max-w-5xl px-4">
          <div className="relative z-30 flex justify-center">
            <div className="relative bg-background/95 border border-border/50 rounded-4xl lg:rounded-full p-2 flex flex-col lg:flex-row gap-3 lg:gap-2 items-center w-full max-w-4xl">
              <div className="absolute inset-0 bg-linear-to-br from-white/2 via-transparent to-primary/2 pointer-events-none rounded-4xl lg:rounded-full" />

              <div className="relative w-full lg:flex-1 group rounded-full border border-border/50 bg-foreground/4 transition-[border-color,background-color] duration-150 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-foreground/6 hover:bg-foreground/6">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                  <FiSearch className="text-muted-foreground group-focus-within:text-primary transition-colors duration-300 w-4 h-4 md:w-5 md:h-5" />
                </div>
                <input
                  ref={searchRef}
                  id="project-search"
                  type="search"
                  aria-label="Search projects"
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
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-4 flex items-center justify-center text-muted-foreground hover:text-foreground hover:rotate-90 transition-[transform,color] duration-150 z-20 hover:scale-105"
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
                    onClick={() => {
                      setFilter(category);
                      setFilterRevision((revision) => revision + 1);
                    }}
                    className={`
                    relative whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-[transform,background-color,color,border-color] duration-150 overflow-hidden shrink-0
                    ${
                      filter === category
                        ? "text-dark bg-primary scale-105 font-semibold"
                        : "text-muted-foreground hover:text-foreground bg-transparent hover:bg-foreground/10 border border-transparent hover:scale-[1.03]"
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

        {projectLoadError && (
          <p className="mb-6 text-center text-sm text-red-300" role="alert">
            {projectLoadError}
          </p>
        )}

        {isProjectLoading && (
          <p className="sr-only" role="status" aria-live="polite">
            Loading project details
          </p>
        )}

        <h2 className="sr-only">Project case studies</h2>
        <div
          key={`${filter}-${filterRevision}`}
          className={`${filterRevision > 0 ? "animate-filter-grid" : ""} grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10`}
        >
          {filteredProjects.map((project, index) => (
            <div key={project.id} className="project-card-container">
              <ProjectCard
                project={project}
                priority={index === 0}
                onClick={() => void openProject(project.id)}
                onIntent={() => preloadProjectExperience(project.id)}
              />
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
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
                setFilterRevision((revision) => revision + 1);
                setSearchQuery("");
              }}
              className="group px-8 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-dark transition-[transform,background-color,color,border-color] duration-150 font-medium border border-primary/20 hover:border-primary hover:scale-[1.03]"
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
          onClose={closeProject}
          isOpen={true}
        />
      )}
    </div>
  );
}
