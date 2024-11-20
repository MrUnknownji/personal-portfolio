import { useEffect, useRef } from "react";
import gsap from "gsap";

const CodeDisplay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5,
        zIndex: 10,
      });

      gsap.to(codeBlockRef.current, {
        rotateY: "+=3",
        zIndex: 10,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex-1 hidden lg:block">
      <div className="relative w-full h-full flex items-center">
        <div className="relative w-full h-[400px] perspective-1000">
          <div
            ref={codeBlockRef}
            className="w-full h-full transform-gpu group"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateY(15deg)",
            }}
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div
                className="absolute inset-[-2px] rounded-2xl border-[2px] border-transparent
                before:absolute before:inset-0 before:rounded-2xl before:border-[2px]
                before:border-primary before:animate-border-rotate
                after:absolute after:inset-0 after:rounded-2xl after:border-[2px]
                after:border-primary after:animate-border-rotate-reverse"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/90 to-gray-900/90 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
              <div className="h-8 bg-gray-800/90 flex items-center px-4">
                <div className="flex space-x-2">
                  {["bg-red-500", "bg-yellow-500", "bg-green-500"].map(
                    (color, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${color}`}
                      />
                    ),
                  )}
                </div>
              </div>
              <div className="p-4 h-[calc(100%-2rem)] overflow-hidden">
                <pre className="text-sm font-mono">
                  <code className="text-green-400">
                    {`const developer = {
  name: 'Sandeep Kumar',
  role: 'Full Stack Developer',
  skills: ['React', 'Node.js', 'TypeScript'],
  passion: 'Building amazing web experiences',

  code() {
    while(true) {
      learn();
      build();
      improve();
    }
  }
};

developer.code();`}
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
