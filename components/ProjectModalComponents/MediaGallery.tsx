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
  DURATION_NORMAL: 0.4,
  EASE_IN: "power3.in",
  EASE_OUT: "power3.out",
  SCALE_CLOSE: 0.9,
  SCALE_OPEN: 0.95,
  THUMB_HOVER_SCALE: 1.05,
  THUMB_HOVER_DURATION: 0.3,
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
    const tl = gsap.timeline({
      onComplete: () => {
        setIsPreviewOpen(false);
        setSelectedItem(null);
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
  }, [selectedItem, isPreviewOpen]);

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
      <div className="flex flex-wrap gap-4">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => openPreview(item)}
            className="relative w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-0.75rem)] aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 40vw, 15vw"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                  <FiPlay className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={isPreviewOpen} onClose={handleClosePreviewAnimation}>
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div
            ref={previewOverlayRef}
            className="fixed inset-0 bg-dark/90 backdrop-blur-xl"
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
              className="absolute top-4 right-4 p-2.5 text-white/70 hover:text-white bg-black/20 hover:bg-white/10 rounded-full z-20 transition-colors backdrop-blur-md border border-white/5"
              aria-label="Close media preview"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="w-full h-full flex items-center justify-center p-1 md:p-2">
              {selectedItem?.type === "image" ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedItem.src}
                    alt={selectedItem.alt || "Preview Image"}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              ) : selectedItem?.type === "video" ? (
                isVideoError ? (
                  <div className="flex flex-col items-center justify-center text-muted">
                    <FiVideoOff className="w-12 h-12 mb-4 opacity-50" />
                    <p>Video unavailable</p>
                  </div>
                ) : (
                  <video
                    key={selectedItem.src}
                    src={selectedItem.src}
                    controls
                    autoPlay
                    onError={() => setIsVideoError(true)}
                    className="w-full h-full object-contain outline-none"
                  >
                    Your browser does not support the video tag.
                  </video>
                )
              ) : null}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
