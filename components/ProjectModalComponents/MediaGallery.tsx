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
} as const;

export const MediaGallery = ({ items }: MediaGalleryProps) => {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const previewOverlayRef = useRef<HTMLDivElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);

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
          scale: PREVIEW_ANIMATION_CONFIG.SCALE_CLOSE,
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
            className="relative w-[calc(50%-0.375rem)] sm:w-[calc(33.33%-0.5rem)] aspect-video rounded-lg overflow-hidden border border-neutral/40 shadow-md group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-transform duration-200 ease-out hover:scale-105 hover:shadow-lg"
            aria-label={`View ${item.type} ${index + 1}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={
                item.type != "video"
                  ? item.src
                  : "https://placehold.co/1280x720/333333/00ffc3/png?text=Preview"
              }
              alt={item.alt || `${item.type} ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 40vw, 15vw"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-200" />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <FiPlay className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 drop-shadow-lg" />
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={isPreviewOpen} onClose={handleClosePreviewAnimation}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={previewOverlayRef}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleClosePreviewAnimation}
          />
          <div
            ref={previewContentRef}
            className="relative z-50 max-w-4xl w-full max-h-[85vh] bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden border border-neutral/30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClosePreviewAnimation}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full z-10 transition-colors"
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
                <div className="flex flex-col items-center justify-center w-full aspect-video bg-neutral-800 text-muted">
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
                  className="w-full max-h-[85vh] object-contain aspect-video"
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
