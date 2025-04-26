import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { FiPlay, FiX, FiVideoOff } from "react-icons/fi";
import { Dialog } from "@/components/ui/Dialog";
import { MediaItem } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MediaGalleryProps {
  items: MediaItem[];
}

const PREVIEW_ANIMATION_CONFIG = {
  DURATION_FAST: 0.2,
  DURATION_NORMAL: 0.3,
  EASE_IN: "power2.in",
  EASE_OUT: "power3.out",
  SCALE_CLOSE: 0.95,
  SCALE_OPEN: 0.95,
  THUMB_HOVER_SCALE: 1.05,
  THUMB_HOVER_DURATION: 0.2,
} as const;

export const MediaGallery = ({ items }: MediaGalleryProps) => {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const previewOverlayRef = useRef<HTMLDivElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP();

  const openPreview = (item: MediaItem) => {
    setSelectedItem(item);
    setIsVideoError(false);
    setIsPreviewOpen(true);
  };

  const handleClosePreviewAnimation = useCallback(() => {
    gsap.to([previewOverlayRef.current, previewContentRef.current], {
      opacity: 0,
      duration: PREVIEW_ANIMATION_CONFIG.DURATION_FAST,
      ease: PREVIEW_ANIMATION_CONFIG.EASE_IN,
      onComplete: () => {
        setIsPreviewOpen(false);
        setSelectedItem(null);
      },
      overwrite: true,
    });
    gsap.to(previewContentRef.current, {
      scale: PREVIEW_ANIMATION_CONFIG.SCALE_CLOSE,
      duration: PREVIEW_ANIMATION_CONFIG.DURATION_FAST,
      ease: PREVIEW_ANIMATION_CONFIG.EASE_IN,
      overwrite: true,
    });
  }, []);

  useEffect(() => {
    if (isPreviewOpen) {
      setIsVideoError(false);
    }
  }, [selectedItem, isPreviewOpen]);

  useGSAP(
    () => {
      if (isPreviewOpen) {
        gsap.set(previewOverlayRef.current, { opacity: 0 });
        gsap.set(previewContentRef.current, {
          opacity: 0,
          scale: PREVIEW_ANIMATION_CONFIG.SCALE_OPEN,
        });

        gsap.to(previewOverlayRef.current, {
          opacity: 1,
          duration: PREVIEW_ANIMATION_CONFIG.DURATION_NORMAL,
          ease: PREVIEW_ANIMATION_CONFIG.EASE_OUT,
        });
        gsap.to(previewContentRef.current, {
          opacity: 1,
          scale: 1,
          duration: PREVIEW_ANIMATION_CONFIG.DURATION_NORMAL,
          ease: PREVIEW_ANIMATION_CONFIG.EASE_OUT,
          delay: 0.05,
        });
      }
    },
    { dependencies: [isPreviewOpen] },
  );

  const handleThumbHover = contextSafe(
    (target: HTMLElement, isEnter: boolean) => {
      gsap.to(target, {
        boxShadow: isEnter
          ? "0 5px 15px rgba(0, 0, 0, 0.2)"
          : "0 2px 4px rgba(0, 0, 0, 0.1)",
        borderColor: isEnter ? "var(--color-primary)" : "var(--color-neutral)",
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
    <div className="mt-4 pt-4 border-t border-neutral/30">
      <h4 className="text-lg font-medium text-light/90 mb-3">Gallery</h4>
      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => openPreview(item)}
            className="relative w-[calc(50%-0.375rem)] sm:w-[calc(33.33%-0.5rem)] aspect-video rounded-lg overflow-hidden border border-neutral/70 shadow-md group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors duration-200 ease-out transform-gpu"
            aria-label={`View ${item.type} ${index + 1}`}
            style={{ backfaceVisibility: "hidden" }}
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
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 40vw, 15vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent transition-opacity duration-200 group-hover:opacity-70" />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-2 bg-black/60 rounded-full">
                  <FiPlay className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 drop-shadow-lg" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={isPreviewOpen} onClose={handleClosePreviewAnimation}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={previewOverlayRef}
            className="fixed inset-0 bg-dark/90"
            onClick={handleClosePreviewAnimation}
          />
          <div
            ref={previewContentRef}
            className="relative z-50 max-w-4xl w-full max-h-[85vh] bg-secondary rounded-lg shadow-xl flex flex-col overflow-hidden border border-neutral/30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClosePreviewAnimation}
              className="absolute top-2 right-2 p-2 text-muted hover:text-light bg-neutral/50 hover:bg-neutral/70 rounded-full z-10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Close media preview"
            >
              <FiX className="w-5 h-5" />
            </button>

            {selectedItem?.type === "image" ? (
              <div className="relative w-full h-auto max-h-[85vh]">
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.alt || "Preview Image"}
                  width={1600}
                  height={900}
                  className="object-contain w-full h-full max-h-[85vh]"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ) : selectedItem?.type === "video" ? (
              isVideoError ? (
                <div className="flex flex-col items-center justify-center w-full aspect-video bg-dark text-muted">
                  <FiVideoOff className="w-16 h-16 mb-4" />
                  <p>Video unavailable</p>
                </div>
              ) : (
                <video
                  key={selectedItem.src}
                  src={selectedItem.src}
                  controls
                  autoPlay
                  onError={() => setIsVideoError(true)}
                  className="w-full max-h-[85vh] object-contain aspect-video bg-dark"
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : null}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
