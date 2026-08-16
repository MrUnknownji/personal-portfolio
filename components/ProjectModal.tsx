import Image from "next/image";
import { useEffect } from "react";
import { FiBookOpen, FiExternalLink, FiGithub, FiX, FiChevronRight } from "react-icons/fi";
import { Dialog } from "@/components/ui/Dialog";
import { Project } from "@/types/Project";
import { ExpandableSection } from "./ProjectModalComponents/ExpandableSection";
import { TechStack } from "./ProjectModalComponents/TechStack";
import { MediaGallery } from "./ProjectModalComponents/MediaGallery";
import Link from "next/link";
import { setActiveProject } from "@/components/modalState";

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    setActiveProject({ id: project.id, title: project.title });

    return () => {
      setActiveProject(null);
    };
  }, [isOpen, project.id, project.title]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      ariaLabelledBy={`project-title-${project.id}`}
      ariaDescribedBy={`project-description-${project.id}`}
      className="w-full h-full md:w-auto md:h-auto"
    >
      <div
        className="fixed inset-0 bg-background/95 z-40 transition-colors"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        data-krypton-context="project"
        data-krypton-title={project.title}
        data-krypton-summary={`${project.title}: ${project.shortDescription} Features include ${project.features.slice(0, 3).join(", ")}.`}
        className="relative z-50 flex flex-col
                     bg-card border-x border-b border-t-[3px] border-t-primary border-x-border border-b-border
                     h-dvh w-full
                     md:max-w-6xl md:h-[85vh] md:max-h-[850px]
                     md:rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 pointer-events-none" />

        <button
          type="button"
          data-autofocus
          onClick={onClose}
          aria-label="Close project details"
          className="group absolute top-4 right-4 p-2 rounded-full z-51
                     bg-background/50 text-foreground/70 border border-border
                     hover:bg-primary/10 hover:text-primary hover:border-primary/40
                     transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <FiX className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        <div
          className="grow min-h-0 relative z-10
                     overflow-y-auto md:overflow-y-hidden
                     overscroll-y-contain
                     [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div
            className="flex flex-col md:flex-row gap-8 px-6 pb-8 pt-12 md:p-10
                       md:h-full"
          >
            {/* Left Column */}
            <div
              className="w-full md:w-[45%] flex flex-col space-y-6 shrink-0
                         md:h-full md:overflow-y-auto md:[scrollbar-width:thin] md:pr-4"
            >
              <div
                className="relative w-full aspect-video rounded-xl overflow-hidden border border-border shrink-0 group bg-card"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 90vw, 45vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-80 pointer-events-none" />
              </div>

              <div className="shrink-0 space-y-4 relative">
                <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-full" />

                <div className="pl-6 space-y-3">
                  <h2
                    id={`project-title-${project.id}`}
                    className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
                  >
                    {project.title}
                  </h2>
                  <p
                    id={`project-description-${project.id}`}
                    className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light"
                  >
                    {project.shortDescription}
                  </p>
                </div>
              </div>

              <div className="grow min-h-0">
                <MediaGallery items={project.gallery || []} />
              </div>
            </div>

            {/* Right Column */}
            <div
              className="w-full md:w-[55%] flex flex-col md:h-full"
            >
              <div
                className="space-y-4 grow min-h-0
                           md:overflow-y-auto md:[scrollbar-width:thin] md:pr-4"
              >
                <ExpandableSection
                  title="About the Project"
                  content={project.longDescription}
                />
                {project.caseStudy && (
                  <>
                    <ExpandableSection
                      title="Problem & Solution"
                      content={`${project.caseStudy.problem}\n\n${project.caseStudy.solution}`}
                    />
                    <ExpandableSection
                      title="Architecture Notes"
                      content={project.caseStudy.architecture}
                      isList={true}
                    />
                    <ExpandableSection
                      title="Tradeoffs"
                      content={project.caseStudy.tradeoffs}
                      isList={true}
                    />
                  </>
                )}
                <ExpandableSection
                  title="Key Features"
                  content={project.features}
                  isList={true}
                />
              </div>

              <div className="mt-auto pt-8 space-y-6 shrink-0 border-t border-border">
                <TechStack technologies={project.technologies} />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Link
                    href={`/my-projects/${project.id}`}
                    className="group inline-flex min-h-14 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-primary/40 px-3 py-3 text-sm font-semibold text-primary transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <FiBookOpen className="size-4" aria-hidden="true" />
                    Full Case Study
                  </Link>
                  {project.demoLink && (
                    <Link
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl bg-primary px-3 py-3 text-sm font-bold text-dark transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                    >
                      <span className="relative z-20 flex items-center gap-2">
                        <FiExternalLink className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        <span>Live Demo</span>
                        <FiChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  )}
                  {project.githubLink && (
                    <Link
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl border border-primary/35 bg-primary/5 px-3 py-3 text-sm font-semibold text-primary transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 active:scale-95"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <FiGithub className="size-4 transition-transform duration-200 group-hover:rotate-12" />
                        <span>Source Code</span>
                        <FiChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0" />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProjectModal;
