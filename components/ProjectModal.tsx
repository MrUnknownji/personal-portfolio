import Image from "next/image";
import { useEffect, useRef } from "react";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import { Dialog, DialogTitle } from "@/components/ui/Dialog";
import { Project } from "@/types/Project";
import gsap from "gsap";

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!isOpen || !overlay || !content) {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      return;
    }

    animationRef.current = gsap.timeline();

    animationRef.current
      .fromTo(overlay, { opacity: 0 }, { opacity: 0.6, duration: 0.3 })
      .fromTo(
        content,
        {
          opacity: 0,
          scale: 0.9,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
      );
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    if (!overlayRef.current || !contentRef.current) return;

    const overlay = overlayRef.current;
    const content = contentRef.current;
    gsap
      .timeline()
      .to(overlay, {
        opacity: 0,
        duration: 0.3,
      })
      .to(content, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        onComplete: onClose,
      });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <div className="min-h-screen px-4 text-center">
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm opacity-0"
          onClick={handleClose}
        />

        <div
          ref={contentRef}
          className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle bg-gray-900 shadow-xl rounded-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100/10 rounded-lg transition-colors z-10"
            >
              <FiX className="w-6 h-6 text-gray-400" />
            </button>

            <div className="relative w-full h-48 mb-6 overflow-hidden rounded-lg">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <DialogTitle className="text-2xl font-bold text-white mb-2">
              {project.title}
            </DialogTitle>

            <p className="text-gray-400 mb-4">{project.longDescription}</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Features
                </h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FiX className="w-6 h-6 text-primary mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm text-primary bg-primary/10 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <FiExternalLink className="w-5 h-5" />
                    <span>Live Demo</span>
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <FiGithub className="w-5 h-5" />
                    <span>View Code</span>
                  </a>
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
