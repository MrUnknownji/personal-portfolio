import ProjectsPage from "@/components/ProjectsPage";
import { selectedProjects } from "@/data/projects";
import type { ProjectSummary } from "@/types/Project";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Explore Sandeep Kumar's selected full stack, mobile, and AI product case studies, demos, screenshots, and source code.",
  alternates: { canonical: "/my-projects" },
  openGraph: {
    title: "Selected Work | Sandeep Kumar",
    description:
      "Full stack, mobile, and AI product case studies with demos and source code.",
    url: "/my-projects",
  },
};

const projectSummaries: ProjectSummary[] = selectedProjects.map((project) => ({
  id: project.id,
  title: project.title,
  shortDescription: project.shortDescription,
  image: project.image,
  technologies: project.technologies,
  category: project.category,
  featured: project.featured,
}));

export default function Page() {
  return <ProjectsPage projects={projectSummaries} />;
}
