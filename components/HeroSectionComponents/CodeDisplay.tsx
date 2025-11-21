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

  const codeLines = [
    { line: 1, content: <><span className="text-[#c586c0]">const</span> <span className="text-[#79c0ff]">Portfolio</span> = {'{'}</> },
    { line: 2, content: <><span className="text-[#9cdcfe]">  name</span>: <span className="text-[#ce9178]">&quot;Sandeep Kumar&quot;</span>,</> },
    { line: 3, content: <><span className="text-[#9cdcfe]">  role</span>: <span className="text-[#ce9178]">&quot;Full Stack Developer&quot;</span>,</> },
    { line: 4, content: <><span className="text-[#9cdcfe]">  skills</span>: [</> },
    { line: 5, content: <><span className="text-[#ce9178]">    &quot;TypeScript&quot;</span>, <span className="text-[#ce9178]">&quot;React&quot;</span>,</> },
    { line: 6, content: <><span className="text-[#ce9178]">    &quot;Node.js&quot;</span>, <span className="text-[#ce9178]">&quot;Next.js&quot;</span>,</> },
    { line: 7, content: <><span className="text-[#ce9178]">    &quot;PostgreSQL&quot;</span>, <span className="text-[#ce9178]">&quot;AWS&quot;</span>,</> },
    { line: 8, content: <><span className="text-[#ce9178]">    &quot;Docker&quot;</span>, <span className="text-[#ce9178]">&quot;TailwindCSS&quot;</span></> },
    { line: 9, content: <><span className="text-[#6a9955]">{`    // ...loading more skills`}</span></> },
    { line: 10, content: <>  ],</> },
    { line: 11, content: <><span className="text-[#9cdcfe]">  passion</span>: <span className="text-[#ce9178]">&quot;Building scalable systems&quot;</span>,</> },
    { line: 12, content: <><span className="text-[#9cdcfe]">  status</span>: <span className="text-[#ce9178]">&quot;Available for hire&quot;</span></> },
    { line: 13, content: <>{"}"};<span className="animate-pulse text-white">|</span></> },
  ];

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
          className="absolute inset-0 bg-[#1e1e1e] rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]
                     border border-white/10 overflow-hidden"
        >
          {/* Title Bar */}
          <div className="h-10 bg-[#2d2d2d] flex items-center px-4 border-b border-white/5 justify-between">
             <div className="flex space-x-2 pointer-events-none">
              {["#FF5F56", "#FFBD2E", "#27C93F"].map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] rounded-md text-xs text-gray-400 font-sans border border-white/5">
                <span className="text-[#79c0ff]">TS</span>
                portfolio.ts
             </div>
             <div className="w-12" />
          </div>

          {/* Code Area */}
          <div className="p-6 font-mono text-sm leading-relaxed overflow-hidden h-[calc(100%-2.5rem)] bg-[#1e1e1e]">
             <div className="flex flex-col gap-1">
                {codeLines.map((item) => (
                   <div key={item.line} className="flex gap-4">
                      <div className="w-6 text-right text-gray-600 select-none text-xs pt-[2px]">{item.line}</div>
                      <div className="text-gray-300 whitespace-nowrap">
                         {item.content}
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Glow reflection */}
           <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none" />
           <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default CodeDisplay;
