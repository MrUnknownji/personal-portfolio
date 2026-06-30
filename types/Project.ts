import { ReactNode } from "react";

export type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

export type ProjectCaseStudy = {
  problem: string;
  solution: string;
  architecture: string[];
  tradeoffs: string[];
};

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  technologies: string[];
  features: string[];
  demoLink?: string;
  githubLink?: string;
  category: string;
  gallery?: MediaItem[];
  featured?: boolean;
  caseStudy?: ProjectCaseStudy;
}

export type ProjectSummary = Pick<
  Project,
  | "id"
  | "title"
  | "shortDescription"
  | "image"
  | "technologies"
  | "category"
  | "featured"
>;
