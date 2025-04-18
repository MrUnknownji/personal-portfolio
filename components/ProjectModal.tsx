import Image from "next/image";
import { useRef, useCallback } from "react";
import { FiExternalLink, FiGithub, FiX, FiChevronRight } from "react-icons/fi";
import { Dialog, DialogTitle } from "@/components/ui/Dialog";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ExpandableSection } from "./ProjectModalComponents/ExpandableSection";
import { TechStack } from "./ProjectModalComponents/TechStack";

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ANIMATION_CONFIG = {
  DURATION_FAST: 0.2,
  DURATION_NORMAL: 0.4,
  EASE_IN: "power2.in",
  EASE_OUT: "power3.out",
  SCALE_CLOSE: 0.97,
} as const;

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: contentRef });

  const handleCloseAnimation = useCallback(() => {
    gsap.to([overlayRef.current, contentRef.current], {
      opacity: 0,
      duration: ANIMATION_CONFIG.DURATION_FAST,
      ease: ANIMATION_CONFIG.EASE_IN,
      onComplete: onClose,
      overwrite: true,
    });
    gsap.to(contentRef.current, {
      scale: ANIMATION_CONFIG.SCALE_CLOSE,
      duration: ANIMATION_CONFIG.DURATION_FAST,
      ease: ANIMATION_CONFIG.EASE_IN,
      overwrite: true,
    });
  }, [onClose]);

  useGSAP(
    () => {
      if (isOpen) {
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(contentRef.current, {
          opacity: 0,
          scale: ANIMATION_CONFIG.SCALE_CLOSE,
        });

        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: ANIMATION_CONFIG.DURATION_NORMAL,
          ease: ANIMATION_CONFIG.EASE_OUT,
        });
        gsap.to(contentRef.current, {
          opacity: 1,
          scale: 1,
          duration: ANIMATION_CONFIG.DURATION_NORMAL,
          ease: ANIMATION_CONFIG.EASE_OUT,
          delay: 0.1,
        });
      }
    },
    { dependencies: [isOpen] },
  );

  const setupButtonHover = contextSafe(
    (button: HTMLElement | null, iconSelector: string, isPrimary = false) => {
      if (!button) return;
      const icon = button.querySelector(iconSelector);
      const originalBg = isPrimary
        ? "rgba(0, 255, 159, 1)"
        : "rgba(55, 65, 81, 0.5)";
      const hoverBg = isPrimary
        ? "rgba(0, 220, 140, 1)"
        : "rgba(75, 85, 99, 0.7)";

      gsap.set(button, { backgroundColor: originalBg });

      button.addEventListener("mouseenter", () => {
        console.log(
          "Mouse entered and original background is " +
            originalBg +
            " and hover background is " +
            hoverBg,
        );
        gsap.to(button, {
          backgroundColor: hoverBg,
          duration: ANIMATION_CONFIG.DURATION_FAST,
          ease: ANIMATION_CONFIG.EASE_OUT,
          overwrite: true,
        });
        if (icon)
          gsap.to(icon, {
            x: 4,
            duration: ANIMATION_CONFIG.DURATION_FAST,
            ease: ANIMATION_CONFIG.EASE_OUT,
            overwrite: true,
          });
      });
      button.addEventListener("mouseleave", () => {
        console.log(
          "Mouse left and original background is " +
            originalBg +
            " and hover background is " +
            hoverBg,
        );
        gsap.to(button, {
          backgroundColor: originalBg,
          duration: ANIMATION_CONFIG.DURATION_FAST,
          ease: ANIMATION_CONFIG.EASE_OUT,
          overwrite: true,
        });
        if (icon)
          gsap.to(icon, {
            x: 0,
            duration: ANIMATION_CONFIG.DURATION_FAST,
            ease: ANIMATION_CONFIG.EASE_OUT,
            overwrite: true,
          });
      });
    },
  );

  const setupCloseButtonHover = contextSafe((button: HTMLElement | null) => {
    if (!button) return;
    const icon = button.querySelector("svg");

    gsap.set(button, {
      backgroundColor: "transparent",
      color: "rgb(107, 114, 128)",
    });

    button.addEventListener("mouseenter", () => {
      gsap.to(button, {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        color: "rgb(209, 213, 219)",
        duration: ANIMATION_CONFIG.DURATION_FAST,
        ease: ANIMATION_CONFIG.EASE_OUT,
        overwrite: true,
      });
      if (icon)
        gsap.to(icon, {
          rotate: 90,
          duration: ANIMATION_CONFIG.DURATION_FAST,
          ease: ANIMATION_CONFIG.EASE_OUT,
          overwrite: true,
        });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        backgroundColor: "transparent",
        color: "rgb(107, 114, 128)",
        duration: ANIMATION_CONFIG.DURATION_FAST,
        ease: ANIMATION_CONFIG.EASE_OUT,
        overwrite: true,
      });
      if (icon)
        gsap.to(icon, {
          rotate: 0,
          duration: ANIMATION_CONFIG.DURATION_FAST,
          ease: ANIMATION_CONFIG.EASE_OUT,
          overwrite: true,
        });
    });
  });

  useGSAP(
    () => {
      const contentElement = contentRef.current;
      if (contentElement && isOpen) {
        const demoButton =
          contentElement.querySelector<HTMLAnchorElement>(".demo-link");
        const githubButton =
          contentElement.querySelector<HTMLAnchorElement>(".github-link");
        const closeButton =
          contentElement.querySelector<HTMLButtonElement>(".close-button");

        setupButtonHover(demoButton, ".chevron-icon", true);
        setupButtonHover(githubButton, ".chevron-icon", false);
        setupCloseButtonHover(closeButton);
      }
    },
    {
      dependencies: [isOpen, project, setupButtonHover, setupCloseButtonHover],
    },
  );

  return (
    <Dialog open={isOpen} onClose={handleCloseAnimation}>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleCloseAnimation}
        />
        <div
          ref={contentRef}
          className="relative z-50 w-full max-w-5xl h-[90vh] max-h-[800px] my-8
                     bg-gradient-to-br from-gray-800/90 via-secondary/90 to-gray-900/90
                     backdrop-blur-lg shadow-2xl rounded-2xl
                     border border-neutral/30 flex flex-col transform-gpu"
          onClick={(e) => e.stopPropagation()}
          style={{ backfaceVisibility: "hidden" }}
        >
          <button
            onClick={handleCloseAnimation}
            aria-label="Close project details"
            className="close-button absolute top-3 right-3 p-2 text-muted hover:text-light rounded-full z-10"
          >
            <FiX className="w-6 h-6" />
          </button>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-6 md:p-8 overflow-hidden flex-grow">
            <div className="md:w-1/2 flex flex-col space-y-4">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-neutral/30">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 40vw"
                  priority
                />
              </div>
              <div className="pt-1 pb-1">
                <DialogTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {project.title}
                </DialogTitle>
              </div>
              <p className="text-muted text-sm md:text-base flex-shrink-0">
                {project.shortDescription}
              </p>
            </div>

            <div className="md:w-1/2 flex flex-col h-full overflow-hidden">
              <div className="flex-grow space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral/40 scrollbar-track-transparent">
                <ExpandableSection
                  title="Description"
                  content={project.longDescription}
                  isList={false}
                />
                <ExpandableSection
                  title="Features"
                  content={project.features}
                  isList={true}
                />
              </div>
              <div className="mt-auto pt-6 space-y-4 flex-shrink-0">
                <TechStack technologies={project.technologies} />
                <div className="flex flex-col sm:flex-row gap-4">
                  {project.demoLink && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="demo-link inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                                             text-secondary shadow-lg font-medium transform-gpu"
                    >
                      <FiExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                      <FiChevronRight className="chevron-icon w-5 h-5" />
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-link inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                                            bg-neutral/50 text-light shadow-lg border border-neutral/30 font-medium transform-gpu hover:bg-neutral/70"
                    >
                      <FiGithub className="w-5 h-5" />
                      <span>View Code</span>
                      <FiChevronRight className="chevron-icon w-5 h-5" />
                    </a>
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
