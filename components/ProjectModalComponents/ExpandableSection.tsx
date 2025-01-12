import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import gsap from "gsap";
import { FiChevronRight, FiX } from "react-icons/fi";

interface ExpandableSectionProps {
  title: string;
  content: string | string[];
  isList?: boolean;
}

const ExpandableSection = ({
  title,
  content,
  isList,
}: ExpandableSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [needsFade, setNeedsFade] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current && containerRef.current) {
        const isOverflowing =
          contentRef.current.scrollHeight > containerRef.current.clientHeight;
        setNeedsFade(isOverflowing);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [content]);

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    if (dialogRef.current) {
      gsap.to(dialogRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setIsDialogOpen(false),
      });
    }
  }, []);

  return (
    <div className="relative h-full" ref={containerRef}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-8">
        <div ref={contentRef} className="absolute inset-0 overflow-hidden">
          {!isList ? (
            <p className="text-gray-400 pr-8">{content}</p>
          ) : (
            <ul className="space-y-3 pr-8">
              {(content as string[]).map((item, index) => (
                <li key={index} className="flex items-start">
                  <FiX className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {needsFade && (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800 via-gray-800/95 to-transparent pointer-events-none" />
            <button
              onClick={handleOpenDialog}
              className="absolute bottom-1 right-1 text-primary/70 hover:text-primary focus:outline-none p-1.5 z-10 rounded-full hover:bg-gray-700/50 transition-all"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseDialog}
            />
            <div
              ref={dialogRef}
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-xl relative z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
              <div className="max-h-[60vh] overflow-y-auto">
                {!isList ? (
                  <p className="text-gray-400">{content}</p>
                ) : (
                  <ul className="space-y-3">
                    {(content as string[]).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <FiX className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={handleCloseDialog}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export { ExpandableSection };
