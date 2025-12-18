import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { FiPlay, FiX, FiVideoOff, FiChevronLeft, FiChevronRight, FiZoomIn } from "react-icons/fi";
import { Dialog } from "@/components/ui/Dialog";
import { MediaItem } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MediaGalleryProps {
  items: MediaItem[];
}

const PREVIEW_ANIMATION_CONFIG = {
  DURATION_FAST: 0.2,
  DURATION_NORMAL: 0.4,
  EASE_IN: "power3.in",
  EASE_OUT: "power3.out",
  SCALE_CLOSE: 0.9,
  SCALE_OPEN: 0.95,
  THUMB_HOVER_SCALE: 1.05,
  THUMB_HOVER_DURATION: 0.3,
} as const;

export const MediaGallery = ({ items }: MediaGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const previewOverlayRef = useRef<HTMLDivElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP();

  const openPreview = (index: number) => {
    setSelectedIndex(index);
    setIsVideoError(false);
    setIsPreviewOpen(true);
  };

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % items.length);
    setIsVideoError(false);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsVideoError(false);
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPreviewOpen) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") handleClosePreviewAnimation();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewOpen, handleNext, handlePrev]);

  useEffect(() => {
    if (isPreviewOpen && thumbnailStripRef.current && selectedIndex >= 0) {
      const activeThumb = thumbnailStripRef.current.children[selectedIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  }, [selectedIndex, isPreviewOpen]);

  const handleClosePreviewAnimation = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsPreviewOpen(false);
        setSelectedIndex(-1);
      }
    });

    tl.to(previewContentRef.current, {
      opacity: 0,
      scale: PREVIEW_ANIMATION_CONFIG.SCALE_CLOSE,
      duration: PREVIEW_ANIMATION_CONFIG.DURATION_FAST,
      ease: PREVIEW_ANIMATION_CONFIG.EASE_IN,
    })
      .to(previewOverlayRef.current, {
        opacity: 0,
        duration: PREVIEW_ANIMATION_CONFIG.DURATION_FAST,
        ease: PREVIEW_ANIMATION_CONFIG.EASE_IN,
      }, "<");

  }, []);

  useEffect(() => {
    if (isPreviewOpen) {
      setIsVideoError(false);
    }
  }, [selectedIndex, isPreviewOpen]);

  useGSAP(
    () => {
      if (isPreviewOpen) {
        gsap.set(previewOverlayRef.current, { opacity: 0 });
        gsap.set(previewContentRef.current, {
          opacity: 0,
          scale: PREVIEW_ANIMATION_CONFIG.SCALE_OPEN,
        });

        const tl = gsap.timeline();

        tl.to(previewOverlayRef.current, {
          opacity: 1,
          duration: PREVIEW_ANIMATION_CONFIG.DURATION_NORMAL,
          ease: PREVIEW_ANIMATION_CONFIG.EASE_OUT,
        })
          .to(previewContentRef.current, {
            opacity: 1,
            scale: 1,
            duration: PREVIEW_ANIMATION_CONFIG.DURATION_NORMAL,
            ease: "back.out(1.2)",
          }, "<+=0.1");
      }
    },
    { dependencies: [isPreviewOpen] },
  );

  const handleThumbHover = contextSafe(
    (target: HTMLElement, isEnter: boolean) => {
      gsap.to(target, {
        boxShadow: isEnter
          ? "0 10px 25px rgba(0, 255, 159, 0.15)"
          : "0 2px 4px rgba(0, 0, 0, 0.1)",
        borderColor: isEnter ? "var(--color-primary)" : "rgba(255, 255, 255, 0.1)",
        y: isEnter ? -4 : 0,
        duration: PREVIEW_ANIMATION_CONFIG.THUMB_HOVER_DURATION,
        ease: PREVIEW_ANIMATION_CONFIG.EASE_OUT,
        overwrite: true,
      });
    },
  );

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-white/10">
      <h4 className="text-lg font-medium text-light/90 mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-primary rounded-full inline-block"></span>
        Gallery
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => openPreview(index)}
            className={`
              relative rounded-xl overflow-hidden border border-white/10 bg-white/5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
              ${index === 0 ? 'col-span-2 aspect-[21/9]' : 'col-span-1 aspect-video'}
            `}
            aria-label={`View ${item.type} ${index + 1}`}
            onMouseEnter={(e) => handleThumbHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleThumbHover(e.currentTarget, false)}
          >
            <Image
              src={
                item.type === "image"
                  ? item.src
                  : "https://placehold.co/320x180/1e1e1e/00ff9f/png?text=Video"
              }
              alt={item.alt || `${item.type} ${index + 1}`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 p-3 rounded-full bg-white/20 border border-white/20 text-white shadow-xl">
                {item.type === "video" ? (
                  <FiPlay className="w-6 h-6 fill-white" />
                ) : (
                  <FiZoomIn className="w-6 h-6" />
                )}
              </div>
            </div>

            {/* Type Indicator Badge (always visible) */}
            {item.type === "video" && (
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/80 border border-white/10 text-xs font-medium text-white/90 flex items-center gap-1.5 pointer-events-none">
                <FiPlay className="w-3 h-3 fill-white" />
                <span>Video</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={isPreviewOpen} onClose={handleClosePreviewAnimation}>
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div
            ref={previewOverlayRef}
            className="fixed inset-0 bg-dark/95"
            onClick={handleClosePreviewAnimation}
          />
          {/*
             Fixed size container for consistent UI.
             Using aspect-video max-width or fixed height to prevent layout shifts.
          */}
          <div
            ref={previewContentRef}
            className="relative z-[70] w-full max-w-6xl h-[50vh] md:h-[80vh] bg-black/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClosePreviewAnimation}
              className="absolute top-4 right-4 p-2.5 text-white/70 hover:text-white bg-black/40 hover:bg-white/10 rounded-full z-20 transition-colors border border-white/5"
              aria-label="Close media preview"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="relative flex-grow min-h-0 w-full flex items-center justify-center bg-black/20">
              {/* Navigation Arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 z-30 p-3 rounded-full bg-black/40 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 transition-all duration-200 hover:scale-110"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 z-30 p-3 rounded-full bg-black/40 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 transition-all duration-200 hover:scale-110"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>

              {/* Main Content */}
              <div className="w-full h-full p-4 md:p-8 flex items-center justify-center">
                {selectedIndex >= 0 && items[selectedIndex]?.type === "image" ? (
                  <div className="relative w-full h-full max-w-5xl mx-auto">
                    <Image
                      key={items[selectedIndex].src}
                      src={items[selectedIndex].src}
                      alt={items[selectedIndex].alt || "Preview Image"}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : selectedIndex >= 0 && items[selectedIndex]?.type === "video" ? (
                  isVideoError ? (
                    <div className="flex flex-col items-center justify-center text-muted">
                      <FiVideoOff className="w-12 h-12 mb-4 opacity-50" />
                      <p>Video unavailable</p>
                    </div>
                  ) : (
                    <video
                      key={items[selectedIndex].src}
                      src={items[selectedIndex].src}
                      controls
                      autoPlay
                      onError={() => setIsVideoError(true)}
                      className="w-full h-full object-contain outline-none max-w-5xl mx-auto"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : null}
              </div>
            </div>

            {/* Footer with Counter and Thumbnails */}
            <div className="flex-shrink-0 w-full bg-black/60 border-t border-white/10 p-4 flex flex-col gap-4">
              {/* Counter */}
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-white/90">
                  {items[selectedIndex]?.alt || "Gallery Image"}
                </span>
                <span className="text-sm font-mono text-primary/80 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  {selectedIndex + 1} / {items.length}
                </span>
              </div>

              {/* Thumbnail Strip */}
              <div
                ref={thumbnailStripRef}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent px-2"
                style={{ scrollBehavior: 'smooth' }}
              >
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                    className={`
                      relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border transition-all duration-300
                      ${selectedIndex === index
                        ? "border-primary ring-2 ring-primary/30 scale-105 opacity-100"
                        : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                      }
                    `}
                  >
                    <Image
                      src={item.type === "image" ? item.src : "https://placehold.co/320x180/1e1e1e/00ff9f/png?text=Video"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <FiPlay className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
