import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import Image from "next/image";
import {
  FiPlay,
  FiX,
  FiVideoOff,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
} from "react-icons/fi";
import { Dialog } from "@/components/ui/Dialog";
import { MediaItem } from "@/types/Project";

interface MediaGalleryProps {
  items: MediaItem[];
}

export const MediaGallery = ({ items }: MediaGalleryProps) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % items.length);
    setIsVideoError(false);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsVideoError(false);
  }, [items.length]);

  const handleClosePreviewAnimation = useCallback(() => {
    setIsPreviewOpen(false);
    setSelectedIndex(-1);
  }, []);

  const openPreview = (index: number) => {
    setSelectedIndex(index);
    setIsVideoError(false);
    setIsPreviewOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPreviewOpen) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewOpen, handleNext, handlePrev, handleClosePreviewAnimation]);

  useEffect(() => {
    if (isPreviewOpen && thumbnailStripRef.current && selectedIndex >= 0) {
      const activeThumb = thumbnailStripRef.current.querySelector<HTMLElement>(
        `[data-media-index="${selectedIndex}"]`,
      );
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedIndex, isPreviewOpen]);

  if (!items || items.length === 0) {
    return null;
  }

  const visibleItems = items.slice(0, visibleCount);
  const thumbnailStart = Math.max(
    0,
    Math.min(selectedIndex - 3, items.length - 7),
  );
  const thumbnailItems = items
    .map((item, index) => ({ item, index }))
    .slice(thumbnailStart, thumbnailStart + 7);

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h4 className="text-lg font-medium text-foreground/90 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-primary rounded-full inline-block"></span>
        Gallery
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {visibleItems.map((item, index) => (
          <button
            key={item.src}
            onClick={() => openPreview(index)}
            className={`
              relative rounded-xl overflow-hidden border border-border bg-card group focus:outline-none
              transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-primary/50
              ${index === 0 ? "col-span-2 aspect-[21/9]" : "col-span-1 aspect-video"}
            `}
            aria-label={`View ${item.type} ${index + 1}`}
          >
            <Image
              src={
                item.type === "image"
                  ? item.src
                  : "https://placehold.co/320x180/1e1e1e/cccccc/png?text=Video"
              }
              alt={item.alt || `${item.type} ${index + 1}`}
              fill
              className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
              sizes={
                index === 0
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 50vw, 25vw"
              }
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-[background-color,opacity] duration-150 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-150 p-3 rounded-full bg-primary border border-primary text-primary-foreground">
                {item.type === "video" ? (
                  <FiPlay className="w-6 h-6 fill-current" />
                ) : (
                  <FiZoomIn className="w-6 h-6" />
                )}
              </div>
            </div>

            {/* Type Indicator Badge (always visible) */}
            {item.type === "video" && (
              <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-[#0a0a0a]/80 border border-white/10 text-xs font-medium text-foreground/90 flex items-center gap-1.5 pointer-events-none">
                <FiPlay className="w-3 h-3 fill-current" />
                <span>Video</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {items.length > 6 && (
        <button
          type="button"
          className="mt-4 min-h-11 rounded-full border border-primary/30 px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => setVisibleCount((count) => (count > 6 ? 6 : items.length))}
          aria-expanded={visibleCount > 6}
        >
          {visibleCount > 6 ? "Show fewer gallery items" : `Show ${items.length - 6} more`}
        </button>
      )}

      <Dialog
        open={isPreviewOpen}
        onClose={handleClosePreviewAnimation}
        ariaLabel="Project media preview"
      >
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div
            className="fixed inset-0 bg-background/95"
            onClick={handleClosePreviewAnimation}
          />
          {/*
             Fixed size container for consistent UI.
             Using aspect-video max-width or fixed height to prevent layout shifts.
          */}
          <div
            className="relative z-[70] w-full max-w-6xl h-[50vh] md:h-[80vh] bg-card rounded-xl flex flex-col overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              data-autofocus
              onClick={handleClosePreviewAnimation}
              className="absolute top-4 right-4 p-2.5 text-foreground/50 hover:text-foreground bg-background/50 hover:bg-background rounded-full z-20 transition-all duration-300 border border-border hover:scale-105"
              aria-label="Close media preview"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="relative flex-grow min-h-0 w-full flex items-center justify-center bg-background/10">
              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 z-30 p-3 rounded-full bg-background/80 hover:bg-card text-foreground/70 hover:text-foreground border border-border transition-[transform,background-color,color] duration-150 hover:scale-105"
                aria-label="Previous media item"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 z-30 p-3 rounded-full bg-background/80 hover:bg-card text-foreground/70 hover:text-foreground border border-border transition-[transform,background-color,color] duration-150 hover:scale-105"
                aria-label="Next media item"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>

              {/* Main Content */}
              <div className="w-full h-full p-4 md:p-8 flex items-center justify-center">
                {selectedIndex >= 0 &&
                items[selectedIndex]?.type === "image" ? (
                  <div className="relative w-full h-full max-w-5xl mx-auto">
                    <Image
                      key={items[selectedIndex].src}
                      src={items[selectedIndex].src}
                      alt={items[selectedIndex].alt || "Preview Image"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  </div>
                ) : selectedIndex >= 0 &&
                  items[selectedIndex]?.type === "video" ? (
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
                      preload="metadata"
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
            <div className="flex-shrink-0 w-full bg-card border-t border-border p-5 flex flex-col gap-5">
              {/* Counter */}
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold tracking-wide text-foreground/80">
                  {items[selectedIndex]?.alt || "Gallery Image"}
                </span>
                <span className="text-xs font-mono font-bold tracking-wider text-primary bg-primary/10 px-3 py-1 rounded border border-primary/20">
                  {selectedIndex + 1} / {items.length}
                </span>
              </div>

              {/* Thumbnail Strip */}
              <div
                ref={thumbnailStripRef}
                className="flex gap-3 overflow-x-auto pb-2 px-2 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]"
                style={{ scrollBehavior: "smooth" }}
              >
                {thumbnailItems.map(({ item, index }) => (
                  <button
                    key={item.src}
                    data-media-index={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(index);
                      setIsVideoError(false);
                    }}
                    aria-label={`Open thumbnail ${index + 1}`}
                    className={`
                      relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border transition-all duration-300 ease-out
                      ${
                        selectedIndex === index
                          ? "border-primary border-2 scale-[1.02] opacity-100 shadow-[4px_4px_0px_var(--primary)]"
                          : "border-border opacity-50 hover:opacity-100 hover:border-border/80"
                      }
                    `}
                  >
                    <Image
                      src={
                        item.type === "image"
                          ? item.src
                          : "https://placehold.co/320x180/111111/dddddd/png?text=Video"
                      }
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                        <FiPlay className="w-3 h-3 text-primary fill-current" />
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
