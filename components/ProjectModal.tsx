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
import { ScrollSmoother } from "gsap/ScrollSmoother";

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ANIMATION_CONFIG = {
  DURATION: 0.4,
  EASE_OUT: "power4.out",
  EASE_IN: "power3.in",
  SCALE_START: 0.95,
  STAGGER_DELAY: 0.03,
} as const;

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const isActuallyOpen = isOpen || isAnimatingOut;

  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const smoother = ScrollSmoother.get();

    if (isActuallyOpen) {
      document.body.style.overflow = "hidden";
      if (smoother) smoother.paused(true);
    } else {
      document.body.style.overflow = "";
      if (smoother) smoother.paused(false);
    }

    return () => {
      document.body.style.overflow = "";
      if (smoother) smoother.paused(false);
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
          clearProps: "all",
        });
      },
      defaults: {
        duration: 0.3,
        ease: ANIMATION_CONFIG.EASE_IN,
        overwrite: true,
      },
    });

    tl.to(contentRef.current, {
      opacity: 0,
      scale: ANIMATION_CONFIG.SCALE_START,
      y: 20,
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
          y: 20,
          force3D: true,
        });

        const staggerElements = [
          imageRef.current,
          titleRef.current,
          descRef.current,
          galleryRef.current,
          rightColRef.current,
        ].filter(Boolean);

        gsap.set(staggerElements, {
          opacity: 0,
          y: 15,
        });

        const tl = gsap.timeline({
          defaults: {
            ease: ANIMATION_CONFIG.EASE_OUT,
            overwrite: "auto",
          },
        });

        tl.to(overlayRef.current, {
          opacity: 1,
          duration: 0.4,
        })
          .to(
            contentRef.current,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.5,
            },
            "<+=0.05",
          )
          .to(
            staggerElements,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.05,
            },
            "-=0.2",
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
        className="fixed inset-0 bg-background/95 z-40 transition-colors"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        className="relative z-50 flex flex-col transform-gpu
                     bg-card border-x border-b border-t-[3px] border-t-primary border-x-border border-b-border
                     h-[100dvh] w-full shadow-2xl
                     md:max-w-6xl md:h-[85vh] md:max-h-[850px]
                     md:rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 pointer-events-none" />

        <button
          onClick={onClose}
          aria-label="Close project details"
          className="group absolute top-4 right-4 p-2 rounded-full z-[51]
                     bg-background/50 text-foreground/70 border border-border
                     hover:bg-primary/10 hover:text-primary hover:border-primary/40
                     transition-all duration-200 focus:outline-none"
        >
          <FiX className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        <div
          className="flex-grow min-h-0 relative z-10
                     overflow-y-auto md:overflow-y-hidden
                     overscroll-behavior-y-contain
                     scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          style={{ WebkitOverflowScrolling: "touch" }}
          data-lenis-prevent
        >
          <div
            className="flex flex-col md:flex-row gap-8 px-6 pb-8 pt-12 md:p-10
                       md:h-full"
          >
            {/* Left Column */}
            <div
              className="w-full md:w-[45%] flex flex-col space-y-6 flex-shrink-0
                         md:h-full md:overflow-y-auto md:scrollbar-thin md:scrollbar-thumb-border
                         md:scrollbar-track-transparent md:pr-4"
              data-lenis-prevent
            >
              <div
                ref={imageRef}
                className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-border flex-shrink-0 group bg-card"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 90vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80 pointer-events-none" />
              </div>

              <div className="flex-shrink-0 space-y-4 relative">
                <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-full" />

                <div className="pl-6 space-y-3">
                  <h2
                    ref={titleRef}
                    className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
                  >
                    {project.title}
                  </h2>
                  <p
                    ref={descRef}
                    className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light"
                  >
                    {project.shortDescription}
                  </p>
                </div>
              </div>

              <div ref={galleryRef} className="flex-grow min-h-0">
                <MediaGallery items={project.gallery || []} />
              </div>
            </div>

            {/* Right Column */}
            <div
              ref={rightColRef}
              className="w-full md:w-[55%] flex flex-col md:h-full"
            >
              <div
                className="space-y-4 flex-grow min-h-0
                           md:overflow-y-auto md:scrollbar-thin md:scrollbar-thumb-border
                           md:scrollbar-track-transparent md:pr-4"
                data-lenis-prevent
              >
                <ExpandableSection
                  title="About the Project"
                  content={project.longDescription}
                />
                <ExpandableSection
                  title="Key Features"
                  content={project.features}
                  isList={true}
                />
              </div>

              <div className="mt-auto pt-8 space-y-6 flex-shrink-0 border-t border-border">
                <TechStack technologies={project.technologies} />

                <div className="flex flex-col sm:flex-row gap-4">
                  {project.demoLink && (
                    <Link
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-dark font-bold overflow-hidden transition-transform duration-200 active:scale-95 hover:-translate-y-0.5"
                    >
                      <span className="relative z-20 flex items-center gap-2">
                        <FiExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        <span>Live Demo</span>
                        <FiChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  )}
                  {project.githubLink && (
                    <Link
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-secondary/50 text-foreground border border-border font-medium overflow-hidden transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:border-primary/40 active:scale-95"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <FiGithub className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
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
