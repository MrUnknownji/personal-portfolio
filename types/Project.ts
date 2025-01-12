import { ReactNode } from "react";

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
}
