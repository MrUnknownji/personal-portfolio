const CodeDisplay = () => {
  return (
      <div className="relative flex-1 w-full max-w-4xl mx-auto p-4 h-[400px] perspective-1000">
        <div
          className="w-full h-full transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateY(10deg)",
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
                  )
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
  );
};

export default CodeDisplay;
