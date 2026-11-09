export type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
};

export type ShowcaseVariant = "bid" | "mirror" | "omni" | "film";
export type ShowcaseFrame = { label: string; src: string; alt: string };

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
  /** Branch used for source-map links; defaults to "main". */
  repoBranch?: string;
  /** Shown instead of a source link when the repository is not public. */
  sourceNote?: string;
  category: string;
  year?: number;
  showcaseVariant?: ShowcaseVariant;
  showcaseFrames?: ShowcaseFrame[];
  /** Muted, looping clip for the home showcase (the "film" variant). */
  showcaseLoop?: { src: string; poster: string };
  /** Full films with sound, played on the case study. */
  films?: ProjectFilm[];
  gallery?: MediaItem[];
  caseStudy?: ProjectCaseStudy;
  /** Countable facts taken from the project's repository. */
  facts?: ProjectFact[];
}

export type ProjectFact = { value: string; label: string };
export type ProjectFilm = { src: string; poster: string; title: string; caption: string };

/** Fields the home showcase needs; galleries and case-study text stay on the server. */
export type ShowcaseProject = Omit<
  Project,
  "gallery" | "caseStudy" | "longDescription" | "features" | "films"
>;

export type ProjectSummary = Pick<
  Project,
  | "id"
  | "title"
  | "shortDescription"
  | "image"
  | "technologies"
  | "category"
  | "year"
  | "demoLink"
  | "githubLink"
  | "sourceNote"
>;
