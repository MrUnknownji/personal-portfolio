import Image from "next/image";
import { useRef, useCallback } from "react";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
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

const OVERLAY_OPACITY_OPEN = 0.5;
const OVERLAY_OPACITY_CLOSE = 0;
const CONTENT_SCALE_OPEN = 1;
const CONTENT_SCALE_CLOSE = 0.95;
const ANIMATION_DURATION_CLOSE = 0.3;
const ANIMATION_DURATION_OPEN_OVERLAY = 0.3;
const ANIMATION_DURATION_OPEN_CONTENT = 0.4;
const EASE_TYPE_OPEN = "expo.out";
const EASE_TYPE_CLOSE = "power2.in";

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCloseAnimation = useCallback(() => {
    if (!overlayRef.current || !contentRef.current) return;

    gsap.to(overlayRef.current, {
      opacity: OVERLAY_OPACITY_CLOSE,
      duration: ANIMATION_DURATION_CLOSE,
      ease: EASE_TYPE_CLOSE,
      overwrite: true,
    });
    gsap.to(contentRef.current, {
      opacity: OVERLAY_OPACITY_CLOSE,
      scale: CONTENT_SCALE_CLOSE,
      duration: ANIMATION_DURATION_CLOSE,
      ease: EASE_TYPE_CLOSE,
      overwrite: true,
      onComplete: onClose,
    });
  }, [onClose]);

  useGSAP(() => {
    if (isOpen && overlayRef.current && contentRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: OVERLAY_OPACITY_CLOSE },
        {
          opacity: OVERLAY_OPACITY_OPEN,
          duration: ANIMATION_DURATION_OPEN_OVERLAY,
          ease: EASE_TYPE_OPEN,
          overwrite: true,
        },
      );
      gsap.fromTo(
        contentRef.current,
        { opacity: OVERLAY_OPACITY_CLOSE, scale: CONTENT_SCALE_CLOSE },
        {
          opacity: 1,
          scale: CONTENT_SCALE_OPEN,
          duration: ANIMATION_DURATION_OPEN_CONTENT,
          ease: EASE_TYPE_OPEN,
          overwrite: true,
        },
      );
    } else if (!isOpen && overlayRef.current && contentRef.current) {
      gsap.set(overlayRef.current, { opacity: OVERLAY_OPACITY_CLOSE });
      gsap.set(contentRef.current, {
        opacity: OVERLAY_OPACITY_CLOSE,
        scale: CONTENT_SCALE_CLOSE,
      });
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
          className="inline-block w-full max-w-5xl p-6 my-8 overflow-hidden text-left align-middle bg-gray-800 shadow-xl rounded-2xl relative transform transition-all duration-300 h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors z-10"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 h-full">
              <div className="md:w-1/2">
                <div className="relative w-full aspect-video mb-4 overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <DialogTitle className="text-2xl font-bold text-white mb-3">
                  {project.title}
                </DialogTitle>
              </div>
              <div className="md:w-1/2 flex flex-col h-full">
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
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                      {" "}
                      {project.demoLink && (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-secondary hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <FiExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors shadow-sm"
                        >
                          <FiGithub className="w-4 h-4" />
                          <span>View Code</span>
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
