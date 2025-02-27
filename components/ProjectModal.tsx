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
  OVERLAY: {
    OPACITY: {
      OPEN: 0.5,
      CLOSE: 0
    },
    DURATION: {
      OPEN: 0.3,
      CLOSE: 0.3
    }
  },
  CONTENT: {
    SCALE: {
      OPEN: 1,
      CLOSE: 0.95
    },
    DURATION: {
      OPEN: 0.4,
      CLOSE: 0.3
    }
  },
  EASE: {
    OPEN: "expo.out",
    CLOSE: "power2.in"
  }
} as const;

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleCloseAnimation = useCallback(() => {
    if (!overlayRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      onComplete: onClose
    });

    tl.to(overlayRef.current, {
      opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE,
      duration: ANIMATION_CONFIG.OVERLAY.DURATION.CLOSE,
      ease: ANIMATION_CONFIG.EASE.CLOSE,
    })
    .to(contentRef.current, {
      opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE,
      scale: ANIMATION_CONFIG.CONTENT.SCALE.CLOSE,
      duration: ANIMATION_CONFIG.CONTENT.DURATION.CLOSE,
      ease: ANIMATION_CONFIG.EASE.CLOSE,
    }, "<");
  }, [onClose]);

  useGSAP(() => {
    if (isOpen && overlayRef.current && contentRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        overlayRef.current,
        { opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE },
        {
          opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.OPEN,
          duration: ANIMATION_CONFIG.OVERLAY.DURATION.OPEN,
          ease: ANIMATION_CONFIG.EASE.OPEN,
        }
      )
      .fromTo(
        contentRef.current,
        { 
          opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE, 
          scale: ANIMATION_CONFIG.CONTENT.SCALE.CLOSE 
        },
        {
          opacity: 1,
          scale: ANIMATION_CONFIG.CONTENT.SCALE.OPEN,
          duration: ANIMATION_CONFIG.CONTENT.DURATION.OPEN,
          ease: ANIMATION_CONFIG.EASE.OPEN,
        },
        "<"
      )
      .fromTo(
        [imageRef.current, detailsRef.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out"
        },
        "-=0.2"
      );
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="min-h-screen px-4 text-center">
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0"
          onClick={handleCloseAnimation}
        />
        <div
          ref={contentRef}
          className="inline-block w-full max-w-5xl p-6 my-8 overflow-hidden text-left align-middle 
            bg-gray-800/95 backdrop-blur-sm shadow-xl rounded-2xl relative transform transition-all 
            duration-300 h-[90vh] border border-gray-700/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            <button
              onClick={handleCloseAnimation}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 
                rounded-lg transition-colors z-10 group"
            >
              <FiX className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-200" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 h-full">
              <div ref={imageRef} className="md:w-1/2 space-y-4">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg 
                  border border-gray-700/50 group">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <DialogTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent 
                  bg-clip-text text-transparent">
                  {project.title}
                </DialogTitle>
                <p className="text-gray-300 text-sm md:text-base">
                  {project.shortDescription}
                </p>
              </div>

              <div ref={detailsRef} className="md:w-1/2 flex flex-col h-full">
                <div className="flex flex-col h-full gap-6">
                  <div className="h-[35vh]">
                    <ExpandableSection
                      title="Description"
                      content={project.longDescription}
                      isList={false}
                    />
                  </div>
                  <div className="h-[35vh]">
                    <ExpandableSection
                      title="Features"
                      content={project.features}
                      isList={true}
                    />
                  </div>
                  <div className="mt-auto space-y-6">
                    <TechStack technologies={project.technologies} />
                    <div className="flex flex-col sm:flex-row gap-4">
                      {project.demoLink && (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                            bg-primary text-secondary hover:bg-primary/90 transition-colors shadow-lg 
                            group relative overflow-hidden"
                        >
                          <FiExternalLink className="w-5 h-5" />
                          <span className="font-medium">Live Demo</span>
                          <FiChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                            bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-colors shadow-lg 
                            border border-gray-600/50 group relative overflow-hidden"
                        >
                          <FiGithub className="w-5 h-5" />
                          <span className="font-medium">View Code</span>
                          <FiChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
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
