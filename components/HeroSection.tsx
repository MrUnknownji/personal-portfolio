"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Typed from "typed.js";

const HeroSection = () => {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: [
          "Building robust backend systems",
          "Crafting intuitive front-end interfaces",
          "Optimizing database performance",
          "Implementing secure authentication",
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        backDelay: 1500,
      });

      return () => {
        typed.destroy();
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 w-full max-w-6xl shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <h3 className="text-accent font-semibold text-xl mb-2">
              {"Hello, I'm"}
            </h3>
            <h1 className="text-white font-bold text-4xl md:text-5xl mb-3">
              Sandeep Kumar
            </h1>
            <h2 className="text-primary text-2xl md:text-3xl mb-6">
              Full Stack Developer
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              {`I'm passionate about crafting efficient, scalable solutions and
              creating exceptional user experiences. With a focus on clean code
              and continuous learning, I strive to make a positive impact
              through technology.`}
            </p>
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4">
                I specialize in:
              </h3>
              <span ref={typedRef} className="text-accent text-xl"></span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: "🚀", text: "Problem Solving" },
                { icon: "🌱", text: "Continuous Learning" },
                { icon: "🤝", text: "Team Collaboration" },
                { icon: "⏱️", text: "Time Management" },
                { icon: "💡", text: "Creative Thinking" },
                { icon: "🔍", text: "Attention to Detail" },
              ].map((skill, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition duration-300"
                >
                  <div className="text-primary text-3xl mb-2">{skill.icon}</div>
                  <div className="text-white font-medium">{skill.text}</div>
                </div>
              ))}
            </div>
            <Link
              href="/my-projects"
              className="inline-block bg-primary text-secondary font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition duration-300"
            >
              Explore My Projects
            </Link>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">
              <div className="w-72 h-[32rem] bg-gradient-to-br from-primary to-accent rounded-[2.5rem] shadow-xl transform rotate-6 transition duration-500 hover:rotate-0">
                <div className="absolute inset-[3px] bg-secondary rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                  <div className="text-primary text-opacity-10 text-[10px] leading-none">
                    {/* Simulating code background */}
                    {"{".repeat(1000)} {"}".repeat(1000)} {"(".repeat(1000)}{" "}
                    {")".repeat(1000)} {"[".repeat(1000)} {"]".repeat(1000)}{" "}
                    {"//".repeat(1000)} {"#".repeat(1000)} {"$".repeat(1000)}{" "}
                    {"%".repeat(1000)} {"^".repeat(1000)} {"&".repeat(1000)}{" "}
                    {"*".repeat(1000)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-primary text-5xl font-bold">SK</span>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-primary opacity-20 blur-3xl rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
