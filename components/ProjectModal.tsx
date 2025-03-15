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
      CLOSE: 0,
    },
    DURATION: {
      OPEN: 0.3,
      CLOSE: 0.3,
    },
  },
  CONTENT: {
    SCALE: {
      OPEN: 1,
      CLOSE: 0.95,
    },
    DURATION: {
      OPEN: 0.4,
      CLOSE: 0.3,
    },
  },
  HOVER: {
    DURATION: 0.2,
    EASE: "power2.out",
  },
  IMAGE: {
    DURATION: 0.5,
    EASE: "power2.out",
  },
  EASE: {
    OPEN: "expo.out",
    CLOSE: "power2.in",
  },
} as const;

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageOverlayRef = useRef<HTMLDivElement>(null);
  const demoButtonRef = useRef<HTMLAnchorElement>(null);
  const githubButtonRef = useRef<HTMLAnchorElement>(null);
  
  // Use a single context for all animations to prevent conflicts
  const animationContextRef = useRef<gsap.Context | null>(null);

  // Setup hover animations using a single context
  useGSAP(() => {
    if (!isOpen) return;
    
    // Create a single animation context for all hover animations
    animationContextRef.current = gsap.context(() => {
      // Close button hover
      if (closeButtonRef.current) {
        const closeButton = closeButtonRef.current;
        const closeButtonIcon = closeButton.querySelector('svg');
        
        closeButton.addEventListener("mouseenter", () => {
          gsap.to(closeButton, {
            color: "white",
            backgroundColor: "rgba(55, 65, 81, 0.5)",
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
            overwrite: "auto"
          });
          
          if (closeButtonIcon) {
            gsap.to(closeButtonIcon, {
              rotation: 90,
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
              overwrite: "auto"
            });
          }
        });
        
        closeButton.addEventListener("mouseleave", () => {
          gsap.to(closeButton, {
            color: "rgb(156, 163, 175)",
            backgroundColor: "transparent",
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
            overwrite: "auto"
          });
          
          if (closeButtonIcon) {
            gsap.to(closeButtonIcon, {
              rotation: 0,
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
              overwrite: "auto"
            });
          }
        });
      }
      
      // Image hover
      if (imageWrapperRef.current && imageOverlayRef.current) {
        const imageWrapper = imageWrapperRef.current;
        const img = imageWrapper.querySelector('img');
        const overlay = imageOverlayRef.current;
        
        imageWrapper.addEventListener("mouseenter", () => {
          if (img) {
            gsap.to(img, {
              scale: 1.1,
              duration: ANIMATION_CONFIG.IMAGE.DURATION,
              ease: ANIMATION_CONFIG.IMAGE.EASE,
              overwrite: "auto"
            });
          }
          
          gsap.to(overlay, {
            opacity: 1,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
            overwrite: "auto"
          });
        });
        
        imageWrapper.addEventListener("mouseleave", () => {
          if (img) {
            gsap.to(img, {
              scale: 1,
              duration: ANIMATION_CONFIG.IMAGE.DURATION,
              ease: ANIMATION_CONFIG.IMAGE.EASE,
              overwrite: "auto"
            });
          }
          
          gsap.to(overlay, {
            opacity: 0,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
            overwrite: "auto"
          });
        });
      }
      
      // Setup button hover animations
      const setupButtonHover = (button: HTMLElement, isDemo: boolean = false) => {
        if (!button) return;
        
        const arrowIcon = button.querySelector('svg:last-child');
        
        button.addEventListener("mouseenter", () => {
          gsap.to(button, {
            backgroundColor: isDemo 
              ? "rgba(0, 255, 159, 0.9)" 
              : "rgba(55, 65, 81, 0.5)",
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
            overwrite: "auto"
          });
          
          if (arrowIcon) {
            gsap.to(arrowIcon, {
              x: 4,
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
              overwrite: "auto"
            });
          }
        });
        
        button.addEventListener("mouseleave", () => {
          gsap.to(button, {
            backgroundColor: isDemo 
              ? "rgb(0, 255, 159)" 
              : "rgba(55, 65, 81, 0.5)",
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
            overwrite: "auto"
          });
          
          if (arrowIcon) {
            gsap.to(arrowIcon, {
              x: 0,
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
              overwrite: "auto"
            });
          }
        });
      };
      
      // Apply hover animations to buttons
      if (demoButtonRef.current) {
        setupButtonHover(demoButtonRef.current, true);
      }
      
      if (githubButtonRef.current) {
        setupButtonHover(githubButtonRef.current);
      }
    });
    
    // Cleanup function
    return () => {
      if (animationContextRef.current) {
        animationContextRef.current.revert(); // This removes all animations and event listeners
        animationContextRef.current = null;
      }
    };
  }, [isOpen]); // Only re-run when isOpen changes

  const handleCloseAnimation = useCallback(() => {
    if (!overlayRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      onComplete: onClose,
      defaults: {
        ease: ANIMATION_CONFIG.EASE.CLOSE,
        overwrite: "auto"
      }
    });

    tl.to(overlayRef.current, {
      opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE,
      duration: ANIMATION_CONFIG.OVERLAY.DURATION.CLOSE,
    })
    .to(contentRef.current, {
      opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.CLOSE,
      scale: ANIMATION_CONFIG.CONTENT.SCALE.CLOSE,
      duration: ANIMATION_CONFIG.CONTENT.DURATION.CLOSE,
    }, "<");
  }, [onClose]);

  useGSAP(() => {
    if (isOpen && overlayRef.current && contentRef.current) {
      // Set initial state to prevent flicker
      gsap.set(contentRef.current, {
        opacity: 0,
        scale: ANIMATION_CONFIG.CONTENT.SCALE.CLOSE,
      });
      gsap.set(overlayRef.current, {
        opacity: 0,
      });
      gsap.set([imageRef.current, detailsRef.current], {
        opacity: 0,
        y: 20,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: ANIMATION_CONFIG.EASE.OPEN,
          overwrite: "auto"
        }
      });

      tl.to(overlayRef.current, {
        opacity: ANIMATION_CONFIG.OVERLAY.OPACITY.OPEN,
        duration: ANIMATION_CONFIG.OVERLAY.DURATION.OPEN,
      })
      .to(contentRef.current, {
        opacity: 1,
        scale: ANIMATION_CONFIG.CONTENT.SCALE.OPEN,
        duration: ANIMATION_CONFIG.CONTENT.DURATION.OPEN,
        clearProps: "transform", // Clear transform after animation to prevent weird behavior
      }, "<")
      .to([imageRef.current, detailsRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "transform", // Clear transform after animation
      }, "-=0.2");
    }
    
    return () => {
      // Clean up any lingering animations when component unmounts
      if (animationContextRef.current) {
        animationContextRef.current.revert();
        animationContextRef.current = null;
      }
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="min-h-screen px-4 text-center">
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleCloseAnimation}
        />
        <div
          ref={contentRef}
          className="inline-block w-full max-w-5xl p-6 my-8 overflow-hidden text-left align-middle 
            bg-gray-800/95 backdrop-blur-sm shadow-xl rounded-2xl relative h-[90vh] border border-gray-700/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            <button
              ref={closeButtonRef}
              onClick={handleCloseAnimation}
              className="absolute top-4 right-4 p-2 text-gray-400 rounded-lg z-10"
              style={{ willChange: "color, background-color" }}
            >
              <FiX className="w-5 h-5" style={{ willChange: "transform" }} />
            </button>

            <div className="flex flex-col md:flex-row gap-6 h-full">
              <div ref={imageRef} className="md:w-1/2 space-y-4">
                <div
                  ref={imageWrapperRef}
                  className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg 
                    border border-gray-700/50"
                  style={{ willChange: "transform" }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    style={{ willChange: "transform" }}
                    priority
                  />
                  <div
                    ref={imageOverlayRef}
                    className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0"
                    style={{ willChange: "opacity" }}
                  />
                </div>
                <DialogTitle
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent 
                  bg-clip-text text-transparent"
                >
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
                          ref={demoButtonRef}
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                            bg-primary text-secondary shadow-lg relative overflow-hidden"
                          style={{ willChange: "background-color" }}
                        >
                          <FiExternalLink className="w-5 h-5" />
                          <span className="font-medium">Live Demo</span>
                          <FiChevronRight
                            className="w-5 h-5"
                            style={{ willChange: "transform" }}
                          />
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          ref={githubButtonRef}
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                            bg-gray-700/50 text-gray-300 shadow-lg border border-gray-600/50 relative overflow-hidden"
                          style={{ willChange: "background-color" }}
                        >
                          <FiGithub className="w-5 h-5" />
                          <span className="font-medium">View Code</span>
                          <FiChevronRight
                            className="w-5 h-5"
                            style={{ willChange: "transform" }}
                          />
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
