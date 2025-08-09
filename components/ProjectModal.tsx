import Image from "next/image";
import { useRef, useCallback, useEffect, useState } from "react";
import { FiExternalLink, FiGithub, FiX, FiChevronRight } from "react-icons/fi";
import { Dialog } from "@/components/ui/Dialog";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { ExpandableSection } from "./ProjectModalComponents/ExpandableSection";
import { TechStack } from "./ProjectModalComponents/TechStack";
import { MediaGallery } from "./ProjectModalComponents/MediaGallery";
import Link from "next/link";
import { useGSAP } from "@gsap/react";

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ANIMATION_CONFIG = {
  DURATION: 0.3,
  EASE_OUT: "power3.out",
  EASE_IN: "power2.in",
  SCALE_START: 0.97,
} as const;

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  // const lenis = useLenis();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const isActuallyOpen = isOpen || isAnimatingOut;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isActuallyOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isActuallyOpen]);

  const runCloseAnimation = useCallback(() => {
    if (!contentRef.current || !overlayRef.current) {
      onClose();
      setIsAnimatingOut(false);
      return;
    }

    gsap.killTweensOf([overlayRef.current, contentRef.current]);

    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        setIsAnimatingOut(false);
        gsap.set([overlayRef.current, contentRef.current], {
          clearProps: "opacity,transform,scale",
        });
      },
      defaults: {
        duration: ANIMATION_CONFIG.DURATION,
        ease: ANIMATION_CONFIG.EASE_IN,
        overwrite: true,
        force3D: true,
      },
    });

    tl.to(contentRef.current, {
      opacity: 0,
      scale: ANIMATION_CONFIG.SCALE_START,
    }).to(
      overlayRef.current,
      {
        opacity: 0,
      },
      "<",
    );
  }, [onClose]);

  useGSAP(
    () => {
      if (
        isOpen &&
        !isAnimatingOut &&
        isMounted &&
        contentRef.current &&
        overlayRef.current
      ) {
        gsap.killTweensOf([overlayRef.current, contentRef.current]);

        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(contentRef.current, {
          opacity: 0,
          scale: ANIMATION_CONFIG.SCALE_START,
          force3D: true,
        });

        const tl = gsap.timeline({
          defaults: {
            duration: ANIMATION_CONFIG.DURATION,
            ease: ANIMATION_CONFIG.EASE_OUT,
            overwrite: true,
            force3D: true,
          },
        });

        tl.to(overlayRef.current, { opacity: 1 }).to(
          contentRef.current,
          {
            opacity: 1,
            scale: 1,
          },
          "<+=0.05",
        );
      } else if (!isOpen && !isAnimatingOut && isMounted) {
        if (contentRef.current && overlayRef.current) {
          setIsAnimatingOut(true);
          runCloseAnimation();
        } else {
          setIsAnimatingOut(false);
        }
      }
    },
    { dependencies: [isOpen, isAnimatingOut, isMounted], scope: contentRef },
  );

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog
      open={isActuallyOpen}
      onClose={onClose}
      className="w-full h-full md:w-auto md:h-auto"
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-dark/85 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        className="relative z-50 flex flex-col transform-gpu
                     bg-secondary shadow-2xl
                     h-screen w-full
                     md:max-w-5xl md:h-[90vh] md:max-h-[800px]
                     md:rounded-2xl md:border md:border-neutral/30
                     overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ backfaceVisibility: "hidden" }}
      >
        <button
          onClick={onClose}
          aria-label="Close project details"
          className="group absolute top-3 right-3 md:top-4 md:right-4 p-2 md:p-2.5 rounded-full z-[51]
                     bg-zinc-800/50 text-zinc-400
                     hover:bg-gray-700/80 hover:text-zinc-100
                     transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <FiX className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:rotate-90" />
        </button>

        <div
          ref={scrollableContentRef}
          className="flex-grow min-h-0 relative
                     overflow-y-auto md:overflow-y-hidden
                     overscroll-behavior-y-contain
                     scrollbar-thin scrollbar-thumb-neutral/40 scrollbar-track-transparent"
          style={{ WebkitOverflowScrolling: "touch" }}
          data-lenis-prevent
        >
          <div
            className="flex flex-col md:flex-row gap-6 md:gap-8 px-6 pb-6 pt-10 md:p-8
                       md:h-full"
          >
            <div
              className="w-full md:w-1/2 flex flex-col space-y-4 flex-shrink-0
                         md:h-full md:overflow-y-auto md:scrollbar-thin md:scrollbar-thumb-neutral/40
                         md:scrollbar-track-transparent md:pr-2 md:overscroll-behavior-y-contain"
              style={{ WebkitOverflowScrolling: "touch" }}
              data-lenis-prevent
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

            <div className="w-full md:w-1/2 flex flex-col md:h-full">
              <div
                className="space-y-4 flex-grow min-h-0
                           md:overflow-y-auto md:scrollbar-thin md:scrollbar-thumb-neutral/40
                           md:scrollbar-track-transparent md:pr-2 md:overscroll-behavior-y-contain"
                style={{ WebkitOverflowScrolling: "touch" }}
                data-lenis-prevent
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

              <div className="mt-auto pt-6 space-y-4 flex-shrink-0 border-t border-neutral/30">
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
      </div>
    </Dialog>
  );
};

export default ProjectModal;
