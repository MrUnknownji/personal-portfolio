import ProjectsPage from "@/components/ProjectsPage";
import { selectedProjects } from "@/data/data";
import type { ProjectSummary } from "@/types/Project";

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
