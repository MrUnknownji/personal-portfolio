"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ProjectCard from "@/components/ProjectCard";
import type { Project, ProjectSummary } from "@/types/Project";

const loadProjectModal = () => import("@/components/ProjectModal");
const ProjectModal = dynamic(loadProjectModal, { ssr: false });
const projectCache = new Map<number, Project>();
const projectRequests = new Map<number, Promise<Project>>();

function loadProjectData(id: number) {
  const cached = projectCache.get(id);
  if (cached) return Promise.resolve(cached);
  const pending = projectRequests.get(id);
  if (pending) return pending;
  const request = fetch(`/api/projects/${id}`)
    .then(async (response) => {
      if (!response.ok) throw new Error("Project details could not be loaded.");
      return await response.json() as Project;
    })
    .then((project) => { projectCache.set(id, project); return project; })
    .catch((error) => { projectRequests.delete(id); throw error; });
  projectRequests.set(id, request);
  return request;
}

export default function ProjectsPage({ projects }: { projects: ProjectSummary[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [category, setCategory] = useState("All");
  const [filterRevision, setFilterRevision] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const categories = useMemo(() => ["All", ...new Set(projects.map((project) => project.category))], [projects]);
  const visibleProjects = useMemo(() => projects.filter((project) => {
    const search = query.trim().toLowerCase();
    return (category === "All" || project.category === category) && (!search || [project.title, project.shortDescription, ...project.technologies].some((value) => value.toLowerCase().includes(search)));
  }), [category, projects, query]);

  async function openProject(id: number) {
    setLoading(true);
    setError(null);
    try { setSelectedProject(await loadProjectData(id)); }
    catch { setError("Project details could not be loaded. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="print-index print-wrap">
      <header className="print-index-header"><span className="print-eyebrow">Index / 001—006</span><h1>Selected<br /><em>work.</em></h1><div className="print-index-header-bottom"><span>Web / Mobile / Product systems</span><p>Six projects with demos, source code, and the decisions behind them.</p></div></header>
      <div className="print-index-tools"><div className="print-index-filters" aria-label="Filter projects by category">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => { setCategory(item); setFilterRevision((current) => current + 1); }}>{item}</button>)}</div><div className="print-index-search"><label htmlFor="project-search">Search</label><input id="project-search" ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Project or technology" aria-label="Search projects" />{query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); searchRef.current?.focus(); }}>×</button>}</div></div>
      {error && <p className="print-error" role="alert">{error}</p>}
      {loading && <p className="sr-only" role="status" aria-live="polite">Loading project details</p>}
      <h2 className="sr-only">Project case studies</h2>
      <div key={`${category}-${filterRevision}`} className={`print-index-grid ${filterRevision ? "animate-filter-grid" : ""}`}>{visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} priority={index === 0} onClick={() => void openProject(project.id)} onIntent={() => { void Promise.all([loadProjectData(project.id), loadProjectModal()]).catch(() => undefined); }} />)}</div>
      {visibleProjects.length === 0 && <div className="print-index-empty"><h3>No matching work.</h3><p>Try another search or category.</p><button type="button" onClick={() => { setCategory("All"); setFilterRevision((current) => current + 1); setQuery(""); }}>Clear filters ↗</button></div>}
      {selectedProject && <ProjectModal project={selectedProject} isOpen onClose={() => setSelectedProject(null)} />}
    </div>
  );
}
