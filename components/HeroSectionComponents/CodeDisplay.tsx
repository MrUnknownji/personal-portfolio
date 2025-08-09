"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CodeDisplay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const codeBlock = codeBlockRef.current;
      if (!container || !codeBlock) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "bottom top",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        codeBlock,
        {
          rotateY: 18,
          rotateX: -6,
          z: -60,
          opacity: 0,
        },
        {
          rotateY: 12,
          rotateX: 0,
          z: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
        },
      ).to(
        codeBlock,
        {
          rotateX: -2,
          rotateY: 14,
          y: -5,
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
        "-=0.5",
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full max-w-xl mx-auto h-[400px]"
      style={{ perspective: "1500px" }}
      aria-hidden="true"
    >
      <div
        ref={codeBlockRef}
        className="w-full h-full transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 bg-secondary/85 rounded-2xl shadow-2xl shadow-black/30
                     border border-neutral/30 overflow-hidden
                     ring-1 ring-inset ring-white/10"
        >
          <div className="h-8 bg-gradient-to-b from-neutral/60 to-neutral/50 flex items-center px-4 border-b border-neutral/30 shadow-inner shadow-black/20">
            <div className="flex space-x-2 pointer-events-none">
              {["bg-red-500/90", "bg-yellow-500/90", "bg-green-500/90"].map(
                (color, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${color} ring-1 ring-black/20`}
                  />
                ),
              )}
            </div>
          </div>
          <div className="p-4 font-mono text-sm overflow-auto h-[calc(100%-2rem)] scrollbar-thin scrollbar-thumb-neutral/40 scrollbar-track-transparent">
            <pre className="whitespace-pre-wrap">
              <code className="text-primary">{`const Portfolio = {\n`}</code>
              <code className="text-blue-400">{`  name`}</code>
              <code className="text-gray-400">{`: `}</code>
              <code className="text-green-400">{`"Sandeep Kumar"`}</code>
              <code className="text-gray-400">{`,\n`}</code>
              <code className="text-blue-400">{`  role`}</code>
              <code className="text-gray-400">{`: `}</code>
              <code className="text-green-400">{`"Full Stack Developer"`}</code>
              <code className="text-gray-400">{`,\n`}</code>
              <code className="text-blue-400">{`  skills`}</code>
              <code className="text-gray-400">{`: [\n`}</code>
              <code className="text-green-400">{`    "TypeScript"`}</code>
              <code className="text-gray-400">{`,\n`}</code>
              <code className="text-green-400">{`    "React"`}</code>
              <code className="text-gray-400">{`,\n`}</code>
              <code className="text-green-400">{`    "Node.js"`}</code>
              <code className="text-gray-400">{`,\n`}</code>
              <code className="text-green-400">{`    "Next.js"`}</code>
              <code className="text-gray-400">{`,\n`}</code>
              <code className="text-green-400">{`    "TailwindCSS"`}</code>
              <code className="text-gray-400">{`,\n`}</code>
              <code className="text-gray-500">{`    ...\n`}</code>
              <code className="text-gray-400">{`  ],\n`}</code>
              <code className="text-blue-400">{`  passion`}</code>
              <code className="text-gray-400">{`: `}</code>
              <code className="text-green-400">{`"Building beautiful web experiences"`}</code>
              <code className="text-gray-400">{`\n`}</code>
              <code className="text-primary">{`};`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeDisplay;
