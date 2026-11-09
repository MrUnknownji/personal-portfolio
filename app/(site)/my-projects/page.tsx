import ProjectsPage from "@/components/ProjectsPage";
import { selectedProjects, toProjectSummary } from "@/data/projects";
import type { Metadata } from "next";
import "@/app/styles/projects-index.css";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Explore Sandeep Kumar's selected full stack, mobile, and AI product case studies, demos, screenshots, and source code.",
  alternates: { canonical: "/my-projects" },
  openGraph: {
    title: "Selected Work | Sandeep Kumar",
    description: "Full stack, mobile, and AI product case studies with demos and source code.",
    url: "/my-projects",
  },
};

const projectSummaries = selectedProjects.map(toProjectSummary);

export default function Page() {
  return <ProjectsPage projects={projectSummaries} />;
}
