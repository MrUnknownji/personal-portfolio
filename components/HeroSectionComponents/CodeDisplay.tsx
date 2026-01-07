"use client";
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { SparklesCore } from "@/components/ui/Sparkles";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FiCode, FiTerminal } from "react-icons/fi";

const BEFORE_CODE = [
  { line: 1, content: <><span className="text-[#6a9955]">{"// What I do?"}</span></> },
  { line: 2, content: <></> },
  { line: 3, content: <><span className="text-[#c586c0]">const</span> <span className="text-[#79c0ff]">challenges</span> = {"["}</> },
  { line: 4, content: <><span className="pl-4 text-[#ce9178]">&quot;Complex problems&quot;</span>,</> },
  { line: 5, content: <><span className="pl-4 text-[#ce9178]">&quot;Scaling issues&quot;</span>,</> },
  { line: 6, content: <><span className="pl-4 text-[#ce9178]">&quot;Legacy code&quot;</span>,</> },
  { line: 7, content: <><span className="pl-4 text-[#ce9178]">&quot;Performance gaps&quot;</span>,</> },
  { line: 8, content: <>{"];"}</> },
  { line: 9, content: <></> },
  { line: 10, content: <><span className="text-[#6a9955]">{"// Need a solution?"}</span></> },
];

const AFTER_CODE = [
  { line: 1, content: <><span className="text-[#c586c0]">const</span> <span className="text-[#79c0ff]">Sandeep</span> = {"{"}</> },
  { line: 2, content: <><span className="pl-4 text-[#9cdcfe]">role</span>: <span className="text-[#ce9178]">&quot;Full Stack Dev&quot;</span>,</> },
  { line: 3, content: <><span className="pl-4 text-[#9cdcfe]">expertise</span>: {"["}</> },
  { line: 4, content: <><span className="pl-8 text-[#ce9178]">&quot;React&quot;</span>, <span className="text-[#ce9178]">&quot;Next.js&quot;</span>,</> },
  { line: 5, content: <><span className="pl-8 text-[#ce9178]">&quot;Node.js&quot;</span>, <span className="text-[#ce9178]">&quot;TypeScript&quot;</span>,</> },
  { line: 6, content: <><span className="pl-4">{"]"}</span>,</> },
  { line: 7, content: <><span className="pl-4 text-[#9cdcfe]">solves</span>: <span className="text-[#ce9178]">&quot;Your challenges&quot;</span>,</> },
  { line: 8, content: <><span className="pl-4 text-[#9cdcfe]">status</span>: <span className="text-[#4ec9b0]">AVAILABLE</span>,</> },
  { line: 9, content: <>{"};"}  </> },
  { line: 10, content: <><span className="text-[#6a9955]">{"// Let's build! 🚀"}</span></> },
];

type CodeLine = { line: number; content: React.ReactNode };

const CodePanel = memo(({ lines, label, icon: Icon }: { lines: CodeLine[]; label: string; icon: React.ElementType }) => (
  <div className="w-full h-full bg-[#1e1e1e] rounded-xl overflow-hidden">
    <div className="h-10 bg-[#252526] flex items-center px-4 border-b border-white/5 justify-between">
      <div className="flex space-x-2 pointer-events-none">
        {["#FF5F56", "#FFBD2E", "#27C93F"].map((color, index) => (
          <div key={index} className="w-3 h-3 rounded-full opacity-80" style={{ backgroundColor: color }} />
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] rounded-md text-xs text-muted-foreground font-sans border border-white/5">
        <Icon className="w-3 h-3 text-primary" />
        {label}
      </div>
      <div className="w-12" />
    </div>
    <div className="p-5 font-mono text-sm leading-relaxed h-[calc(100%-2.5rem)]">
      <div className="flex flex-col gap-0.5">
        {lines.map((item) => (
          <div key={item.line} className="flex gap-4">
            <div className="w-5 text-right text-gray-600 select-none text-xs">{item.line}</div>
            <div className="text-gray-300 whitespace-nowrap">{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

interface CodeCompareProps {
  className?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
}

const CodeCompare = ({
  className,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = true,
  autoplayDuration = 6000,
}: CodeCompareProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderLineRef = useRef<HTMLDivElement>(null);
  const beforePanelRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const sliderPositionRef = useRef(initialSliderPercentage);
  const isHoveredRef = useRef(false);
  const autoplayProgressRef = useRef(0);

  const updateSliderVisual = useCallback((percent: number) => {
    sliderPositionRef.current = percent;
    if (sliderLineRef.current) {
      sliderLineRef.current.style.left = `${percent}%`;
    }
    if (beforePanelRef.current) {
      beforePanelRef.current.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    }
  }, []);



  useEffect(() => {
    if (!autoplay) return;

    let lastTime = performance.now();
    const speed = 100 / autoplayDuration;
    let direction = 1;

    const animate = (currentTime: number) => {
      if (isHoveredRef.current) {
        lastTime = currentTime;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = currentTime - lastTime;
      lastTime = currentTime;

      autoplayProgressRef.current += direction * speed * delta;

      if (autoplayProgressRef.current >= 100) {
        autoplayProgressRef.current = 100;
        direction = -1;
      } else if (autoplayProgressRef.current <= 0) {
        autoplayProgressRef.current = 0;
        direction = 1;
      }

      updateSliderVisual(autoplayProgressRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [autoplay, autoplayDuration, updateSliderVisual]);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.fromTo(
      container,
      { rotateY: 15, rotateX: -5, opacity: 0, scale: 0.95 },
      { rotateY: 8, rotateX: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
    );
  }, { scope: containerRef });

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (slideMode === "drag") {
      setIsDragging(false);
    }
    autoplayProgressRef.current = sliderPositionRef.current;
  };

  const handleStart = useCallback((clientX: number) => {
    if (slideMode === "drag") {
      setIsDragging(true);
    }
  }, [slideMode]);

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback((clientX: number) => {
    if (!sliderRef.current || !isHoveredRef.current) return;
    if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      updateSliderVisual(percent);
    }
  }, [slideMode, isDragging, updateSliderVisual]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => handleStart(e.clientX), [handleStart]);
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => handleMove(e.clientX), [handleMove]);
  const handleTouchStart = useCallback((e: React.TouchEvent) => { if (!autoplay) handleStart(e.touches[0].clientX); }, [handleStart, autoplay]);
  const handleTouchEnd = useCallback(() => { if (!autoplay) handleEnd(); }, [handleEnd, autoplay]);
  const handleTouchMove = useCallback((e: React.TouchEvent) => { if (!autoplay) handleMove(e.touches[0].clientX); }, [handleMove, autoplay]);



  return (
    <div className="relative flex-1 w-full max-w-xl mx-auto h-[420px] perspective-1000">
      <div
        ref={containerRef}
        className="w-full h-full transform-gpu will-change-transform"
        style={{ transformStyle: "preserve-3d", opacity: 0 }}
      >
        <div
          ref={sliderRef}
          className={cn("code-resizer-handle w-full h-full overflow-hidden rounded-xl border border-primary/20 shadow-2xl shadow-primary/10", className)}
          style={{ position: "relative" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          <div
            ref={sliderLineRef}
            className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent from-[5%] to-[95%] via-primary to-transparent"
            style={{ left: `${initialSliderPercentage}%`, top: "0", zIndex: 40 }}
          >
            <div className="w-32 h-full [mask-image:radial-gradient(80px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-primary/40 via-transparent to-transparent z-20" />
            <div className="w-16 h-1/2 [mask-image:radial-gradient(40px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-accent/60 via-transparent to-transparent z-10" />
            <div className="w-12 h-3/4 top-1/2 -translate-y-1/2 absolute -right-6 [mask-image:radial-gradient(60px_at_left,white,transparent)]">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1.2}
                particleDensity={200}
                className="w-full h-full"
                particleColor="#00ff9f"
              />
            </div>
            {showHandlebar && (
              <div className="h-8 w-5 rounded-md top-1/2 -translate-y-1/2 bg-primary z-30 -right-2.5 absolute flex items-center justify-center">
                <div className="flex flex-col gap-0.5">
                  <div className="w-0.5 h-3 bg-dark/60 rounded-full" />
                </div>
              </div>
            )}
          </div>

          <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
            <div
              ref={beforePanelRef}
              className="absolute inset-0 z-20 rounded-xl w-full h-full select-none overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - initialSliderPercentage}% 0 0)` }}
            >
              <CodePanel lines={BEFORE_CODE} label="problem.ts" icon={FiCode} />
            </div>
          </div>

          <div className="absolute top-0 left-0 z-[19] rounded-xl w-full h-full select-none">
            <CodePanel lines={AFTER_CODE} label="solution.ts" icon={FiTerminal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeCompare;
