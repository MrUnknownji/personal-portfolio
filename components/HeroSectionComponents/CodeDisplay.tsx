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
      className="relative flex-1 w-full max-w-xl mx-auto h-[440px]"
      style={{ perspective: "1500px" }}
      aria-hidden="true"
    >
      <div
        ref={codeBlockRef}
        className="w-full h-full transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 bg-[#1e1e1e] rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]
                     border border-[#333] overflow-hidden"
        >
          <div className="h-10 bg-[#252526] flex items-center px-4 border-b border-[#333]">
            <div className="flex space-x-2 pointer-events-none">
              {["#FF5F56", "#FFBD2E", "#27C93F"].map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="ml-4 text-xs text-gray-500 font-sans">portfolio.ts</div>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed overflow-auto h-[calc(100%-2.5rem)]">
            <pre className="whitespace-pre-wrap text-gray-300">
              <span className="text-[#569CD6]">const</span> <span className="text-[#4FC1FF]">Portfolio</span> = {'{\n'}
              <span className="text-[#9CDCFE]">  name</span>: <span className="text-[#CE9178]">&quot;Sandeep Kumar&quot;</span>,{'\n'}
              <span className="text-[#9CDCFE]">  role</span>: <span className="text-[#CE9178]">&quot;Full Stack Developer&quot;</span>,{'\n'}
              <span className="text-[#9CDCFE]">  skills</span>: [{'\n'}
              <span className="text-[#CE9178]">    &quot;TypeScript&quot;</span>,{'\n'}
              <span className="text-[#CE9178]">    &quot;React&quot;</span>,{'\n'}
              <span className="text-[#CE9178]">    &quot;Node.js&quot;</span>,{'\n'}
              <span className="text-[#CE9178]">    &quot;Next.js&quot;</span>,{'\n'}
              <span className="text-[#CE9178]">    &quot;TailwindCSS&quot;</span>,{'\n'}
              <span className="text-[#6A9955]">    {`// ...more`}</span>{'\n'}
              <span>  ]</span>,{'\n'}
              <span className="text-[#9CDCFE]">  passion</span>: <span className="text-[#CE9178]">&quot;Building beautiful web experiences&quot;</span>{'\n'}
              {'}'};
            </pre>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default CodeDisplay;
