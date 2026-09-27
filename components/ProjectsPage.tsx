"use client";

import { useMemo, useRef, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { ProjectSummary } from "@/types/Project";

export default function ProjectsPage({ projects }: { projects: ProjectSummary[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const categories = useMemo(() => ["All", ...new Set(projects.map((project) => project.category))], [projects]);
  const visibleProjects = useMemo(() => projects.filter((project) => {
    const search = query.trim().toLowerCase();
    return (category === "All" || project.category === category) && (!search || [project.title, project.shortDescription, ...project.technologies].some((value) => value.toLowerCase().includes(search)));
  }), [category, projects, query]);

  return <div className="print-index print-wrap">
    <header className="print-index-header"><span className="print-eyebrow">Index / 001—006</span><h1>Selected<br /><em>work.</em></h1><div className="print-index-header-bottom"><span>Web / Mobile / Product systems</span><p>Six projects. Open one to see the product, the decisions, and the source behind it.</p></div></header>
    <div className="print-index-tools"><div className="print-index-filters" aria-label="Filter projects by category">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="print-index-search"><label htmlFor="project-search">Search</label><input id="project-search" ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Project or technology" aria-label="Search projects" />{query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); searchRef.current?.focus(); }}>×</button>}</div></div>
    <h2 className="sr-only">Project case studies</h2>
    <div className="print-index-grid">{visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
    {visibleProjects.length === 0 && <div className="print-index-empty"><h3>No matching work.</h3><p>Try another search or category.</p><button type="button" onClick={() => { setCategory("All"); setQuery(""); }}>Clear filters ↗</button></div>}
  </div>;
}
