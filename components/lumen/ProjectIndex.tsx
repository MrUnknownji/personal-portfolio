"use client";

import { useMemo, useRef, useState } from "react";
import type { ProjectSummary } from "@/types/Project";
import ProjectTile from "./ProjectTile";

/** The drawing register: filter by kind or shared stack, or search, then open a sheet. */
export default function ProjectIndex({ projects }: { projects: ProjectSummary[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [technology, setTechnology] = useState<string | null>(null);
  const search = useRef<HTMLInputElement>(null);
  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category))],
    [projects],
  );
  // Stacks used by more than one project make the most useful filters.
  const technologies = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects)
      for (const tech of project.technologies) counts.set(tech, (counts.get(tech) ?? 0) + 1);
    return [...counts]
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tech]) => tech);
  }, [projects]);
  const visible = projects.filter((project) => {
    const text = query.trim().toLowerCase();
    return (
      (category === "All" || project.category === category) &&
      (!technology || project.technologies.includes(technology)) &&
      (!text ||
        [project.title, project.shortDescription, ...project.technologies].some((value) =>
          value.toLowerCase().includes(text),
        ))
    );
  });
  const clear = () => {
    setCategory("All");
    setQuery("");
    setTechnology(null);
  };

  return (
    <>
      <div className="ld-index-tools">
        <div className="ld-chips" role="group" aria-label="Filter projects by kind">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className="ld-chip"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="ld-search">
          <label htmlFor="ld-project-search" className="ld-anno">
            Search
          </label>
          <input
            id="ld-project-search"
            ref={search}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Project or technology"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                search.current?.focus();
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>
      {technologies.length > 0 && (
        <div
          className="ld-chips ld-index-stack"
          role="group"
          aria-label="Filter projects by technology"
        >
          <span className="ld-anno">Shared stack</span>
          {technologies.map((tech) => (
            <button
              key={tech}
              type="button"
              className="ld-chip"
              aria-pressed={technology === tech}
              onClick={() => setTechnology(technology === tech ? null : tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      )}
      <p className="ld-anno ld-index-count" role="status">
        {visible.length} of {projects.length} projects shown
      </p>
      <h2 className="ld-sr-only">Projects</h2>
      <div className="ld-index-grid">
        {visible.map((project, index) => (
          <ProjectTile key={project.id} project={project} index={index} />
        ))}
      </div>
      {visible.length === 0 && (
        <div className="ld-index-empty">
          <h3>No matching work.</h3>
          <p>Try another search, kind, or stack.</p>
          <button type="button" className="ld-textbtn" onClick={clear}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
