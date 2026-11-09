import type { Metadata } from "next";
import ProjectIndex from "@/components/lumen/ProjectIndex";
import { selectedProjects, toProjectSummary } from "@/data/projects";

export const metadata: Metadata = {
  title: "Selected work",
  description: "Every selected project by Sandeep Kumar, with filters by kind and stack.",
};

const projects = selectedProjects.map(toProjectSummary);

export default function ReviewProjects() {
  return (
    <div className="ld-wrap ld-page">
      <header className="ld-page-head">
        <span className="ld-anno">
          Drawing register · {String(projects.length).padStart(2, "0")} sheets
        </span>
        <h1>Selected work.</h1>
        <p>
          {projects.length} projects across web, mobile, and product systems. Open one to see the
          product, the decisions, and the source behind it.
        </p>
      </header>
      <ProjectIndex projects={projects} />
    </div>
  );
}
