import type { MetadataRoute } from "next";
import { selectedProjects } from "@/data/projects";
import { SITE_URL } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/my-projects`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/quick`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/motion`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...selectedProjects.map((project) => ({
      url: `${SITE_URL}/my-projects/${project.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
