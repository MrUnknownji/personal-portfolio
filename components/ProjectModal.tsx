import Image from "next/image";
import { useRef, useCallback, useEffect, useState } from "react";
import { FiExternalLink, FiGithub, FiX, FiChevronRight } from "react-icons/fi";
import { Dialog } from "@/components/ui/Dialog";
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
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined"
      ? window.innerWidth >= DESKTOP_BREAKPOINT
      : true,
  );
  const wheelHandlerRef = useRef<((event: WheelEvent) => void) | null>(null);
  const hasAnimatedIn = useRef(false);

  useEffect(() => {
    const checkDesktop = () =>
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleModalWheel = (event: WheelEvent) => {
      event.stopPropagation();

      const target = event.target as HTMLElement;

      const leftScrollable = leftColumnRef.current;
      const rightScrollable = rightColumnRef.current;

      let scrollableParent: Element | null = null;

      if (leftScrollable?.contains(target)) {
        scrollableParent = leftScrollable;
      } else if (rightScrollable?.contains(target)) {
        scrollableParent = rightScrollable;
      }

      if (scrollableParent) {
        const delta = event.deltaY;
        scrollableParent.scrollTop += delta;
      }

      event.preventDefault();
    };

    if (isDesktop && lenis) {
      lenis.stop();
      document.addEventListener("wheel", handleModalWheel, {
        passive: false,
      } as AddEventListenerOptions);
      wheelHandlerRef.current = handleModalWheel;
    }

    return () => {
      if (isDesktop && lenis) {
        if (wheelHandlerRef.current) {
          document.removeEventListener("wheel", wheelHandlerRef.current, {
            passive: false,
          } as EventListenerOptions);
        }
        lenis.start();
      }
    };
  }, [isOpen, isDesktop, lenis]);

  useEffect(() => {
    if (isOpen && !hasAnimatedIn.current) {
      const currentIsDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, {
        opacity: 0,
        scale: currentIsDesktop ? ANIMATION_CONFIG.SCALE_OPEN : 1,
        y: currentIsDesktop ? 0 : 50,
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
        "-=0.25",
      );

      hasAnimatedIn.current = true;
    }

    return () => {
      hasAnimatedIn.current = false;
    };
  }, [isOpen]);

  const handleCloseAnimation = useCallback(() => {
    const currentIsDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        if (currentIsDesktop && lenis) {
          if (wheelHandlerRef.current) {
            document.removeEventListener("wheel", wheelHandlerRef.current, {
              passive: false,
            } as EventListenerOptions);
          }
          lenis.start();
        }
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

    if (currentIsDesktop && contentRef.current) {
      tl.to(
        contentRef.current,
        {
          scale: ANIMATION_CONFIG.SCALE_CLOSE,
        },
        0,
      );
    } else if (contentRef.current) {
      tl.to(contentRef.current, { y: 50 }, 0);
    }
  }, [onClose, lenis]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleCloseAnimation}
      className="w-full h-full md:w-auto md:h-auto"
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-dark/70 backdrop-blur-sm z-40"
        onClick={handleCloseAnimation}
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        className="relative z-50 flex flex-col transform-gpu
                     bg-secondary/95 backdrop-blur-lg shadow-2xl
                     h-screen w-full overflow-hidden
                     md:max-w-5xl md:h-[90vh] md:max-h-[800px] md:overflow-hidden
                     md:rounded-2xl md:border md:border-neutral/30
                     "
        onClick={(e) => e.stopPropagation()}
        style={{ backfaceVisibility: "hidden" }}
      >
        <button
          onClick={handleCloseAnimation}
          aria-label="Close project details"
          className="absolute top-3 right-3 md:top-4 md:right-4 p-2 md:p-2.5 rounded-full z-[51]
                     bg-zinc-800/50 text-zinc-400
                     hover:bg-gray-700/80 hover:text-zinc-100
                     transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <FiX className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 hover:rotate-90" />
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 px-6 pb-6 pt-10 md:p-8 flex-grow overflow-hidden relative">
          <div
            ref={leftColumnRef}
            className="w-full md:w-1/2 flex flex-col space-y-4 flex-shrink-0 md:h-full overflow-y-auto scrollbar-thin scrollbar-thumb-neutral/40 scrollbar-track-transparent md:pr-2"
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-neutral/30 flex-shrink-0">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="flex-shrink-0">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {project.title}
              </h2>
            </div>
            <p className="text-muted text-sm md:text-base flex-shrink-0">
              {project.shortDescription}
            </p>
            <div className="flex-grow min-h-0">
              <MediaGallery items={project.gallery || []} />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col md:h-full overflow-hidden">
            <div
              ref={rightColumnRef}
              className="space-y-4 flex-grow min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral/40 scrollbar-track-transparent md:pr-2"
            >
              <ExpandableSection
                title="Description"
                content={project.longDescription}
              />
              <ExpandableSection
                title="Features"
                content={project.features}
                isList={true}
              />
            </div>

            <div className="mt-auto pt-6 space-y-4 flex-shrink-0 border-t border-neutral/30 mb-4">
              <TechStack technologies={project.technologies} />
              <div className="flex flex-col sm:flex-row gap-4">
                {project.demoLink && (
                  <Link
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-secondary shadow-lg font-medium overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-80 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center gap-2">
                      <FiExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                      <FiChevronRight className="w-5 h-5 transform transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </span>
                  </Link>
                )}
                {project.githubLink && (
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-neutral/50 text-light shadow-lg border border-neutral/30 font-medium overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary"
                  >
                    <span className="absolute inset-0 bg-neutral/70 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center gap-2">
                      <FiGithub className="w-5 h-5" />
                      <span>View Code</span>
                      <FiChevronRight className="w-5 h-5 transform transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </span>
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
