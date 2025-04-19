import Image from "next/image";
import { useRef, useCallback, useEffect, useState } from "react";
import { FiExternalLink, FiGithub, FiX, FiChevronRight } from "react-icons/fi";
import { Dialog, DialogTitle } from "@/components/ui/Dialog";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ExpandableSection } from "./ProjectModalComponents/ExpandableSection";
import { TechStack } from "./ProjectModalComponents/TechStack";
import { MediaGallery } from "./ProjectModalComponents/MediaGallery";
import { useLenis } from "lenis/react";
import Link from "next/link";

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
  SCALE_OPEN: 0.97,
} as const;

const DESKTOP_BREAKPOINT = 768;

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const { contextSafe } = useGSAP({ scope: contentRef });
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () =>
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleCloseAnimation = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        lenis?.start();
        gsap.set([overlayRef.current, contentRef.current], {
          clearProps: "all",
        });
      },
      defaults: {
        duration: ANIMATION_CONFIG.DURATION_FAST,
        ease: ANIMATION_CONFIG.EASE_IN,
        overwrite: true,
      },
    });

    tl.to([overlayRef.current, contentRef.current], {
      opacity: 0,
    });

    if (isDesktop && contentRef.current) {
      tl.to(
        contentRef.current,
        {
          scale: ANIMATION_CONFIG.SCALE_CLOSE,
        },
        0,
      );
    } else if (contentRef.current) {
      tl.to(contentRef.current, { y: 30 }, 0);
    }
  }, [onClose, lenis, isDesktop]);

  useEffect(() => {
    if (isOpen) {
      if (isDesktop) {
        lenis?.stop();
      }

      const isCurrentlyDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, {
        opacity: 0,
        scale: isCurrentlyDesktop ? ANIMATION_CONFIG.SCALE_OPEN : 1,
        y: isCurrentlyDesktop ? 0 : 30,
      });

      const tl = gsap.timeline({
        defaults: {
          duration: ANIMATION_CONFIG.DURATION_NORMAL,
          ease: ANIMATION_CONFIG.EASE_OUT,
          overwrite: true,
        },
      });

      tl.to(overlayRef.current, { opacity: 1 }).to(
        contentRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
        },
        isCurrentlyDesktop ? "-=0.3" : "-=0.25",
      );
    } else {
      lenis?.start();
    }

    return () => {
      lenis?.start();
    };
  }, [isOpen, isDesktop, lenis]);

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
    <Dialog
      open={isOpen}
      onClose={handleCloseAnimation}
      className="w-full h-full md:w-auto md:h-auto"
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={handleCloseAnimation}
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        className="relative z-50 flex flex-col transform-gpu
                     bg-gradient-to-br from-gray-800/95 via-secondary/95 to-gray-900/95
                     backdrop-blur-lg shadow-2xl
                     h-screen w-full overflow-y-auto scrollbar-thin scrollbar-thumb-neutral/40 scrollbar-track-transparent
                     md:max-w-5xl md:h-[90vh] md:max-h-[800px] md:overflow-hidden
                     md:rounded-2xl md:border md:border-neutral/30
                     "
        onClick={(e) => e.stopPropagation()}
        style={{ backfaceVisibility: "hidden" }}
      >
        <button
          onClick={handleCloseAnimation}
          aria-label="Close project details"
          className="close-button sticky top-4 right-4 self-end mr-4 p-3 md:absolute md:top-3 md:right-3 md:p-2 text-muted hover:text-light rounded-full z-10 bg-secondary/50 md:bg-transparent hover:bg-secondary/80 md:hover:bg-white/10 transition-colors duration-200"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Adjusted padding top for mobile to account for sticky close button */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 px-6 pb-6 pt-4 md:p-8 flex-grow md:overflow-hidden">
          <div className="w-full md:w-1/2 flex flex-col space-y-4 flex-shrink-0 md:overflow-y-auto md:pr-2 md:scrollbar-thin md:scrollbar-thumb-neutral/40 md:scrollbar-track-transparent">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-neutral/30 flex-shrink-0">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 40vw"
                priority
              />
            </div>
            <div className="flex-shrink-0">
              <DialogTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {project.title}
              </DialogTitle>
            </div>
            <p className="text-muted text-sm md:text-base flex-shrink-0">
              {project.shortDescription}
            </p>

            <div className="flex-grow min-h-0">
              <MediaGallery items={project.gallery || []} />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col md:overflow-hidden">
            <div className="space-y-4 md:flex-grow md:overflow-y-auto md:pr-2 md:scrollbar-thin md:scrollbar-thumb-neutral/40 md:scrollbar-track-transparent">
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

            <div className="mt-6 md:mt-auto pt-6 md:pt-4 space-y-4 flex-shrink-0 border-t border-neutral/20 md:border-t-0">
              <TechStack technologies={project.technologies} />
              <div className="flex flex-col sm:flex-row gap-4">
                {project.demoLink && (
                  <Link
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="demo-link inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                                           text-secondary bg-primary shadow-lg font-medium transform-gpu"
                  >
                    <FiExternalLink className="w-5 h-5" />
                    <span>Live Demo</span>
                    <FiChevronRight className="chevron-icon w-5 h-5" />
                  </Link>
                )}
                {project.githubLink && (
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-neutral/50 text-light shadow-lg border border-neutral/30 font-medium transform-gpu hover:bg-neutral/70"
                  >
                    <FiGithub className="w-5 h-5" />
                    <span>View Code</span>
                    <FiChevronRight className="chevron-icon w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProjectModal;
