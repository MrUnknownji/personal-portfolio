import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const CodeDisplay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !codeBlockRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 0.5, force3D: true },
      );

      gsap.to(codeBlockRef.current, {
        rotateY: "+=3",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        force3D: true
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full max-w-4xl mx-auto opacity-0"
      style={{ willChange: "opacity" }}
    >
      <div className="relative p-4 h-full">
        <div className="relative h-[400px] perspective-1000">
          <div
            ref={codeBlockRef}
            className="w-full h-full transform-gpu"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateY(5deg) scale(0.98)",
              willChange: "transform"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
              <div className="h-8 bg-gray-800/90 flex items-center px-4">
                <div className="flex space-x-2">
                  {["bg-red-500", "bg-yellow-500", "bg-green-500"].map(
                    (color, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${color}`}
                      />
                    ),
                  )}
                </div>
              </div>
              <div className="p-4">
                <pre className="text-sm">
                  <code className="text-primary">
                    {`const Portfolio = {
  name: "Sandeep Kumar",
  role: "Full Stack Developer",
  skills: [
    "TypeScript",
    "React",
    "Node.js",
    "Next.js",
    "TailwindCSS"
  ],
  passion: "Building beautiful web experiences"
};`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeDisplay;
