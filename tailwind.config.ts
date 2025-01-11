import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00ff9f",
        secondary: "#1A202C",
        accent: "#81E6D9",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scroll: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        borderRotate: {
          "0%, 100%": {
            clipPath: "inset(0 0 98% 0)",
          },
          "25%": {
            clipPath: "inset(0 98% 0 0)",
          },
          "50%": {
            clipPath: "inset(98% 0 0 0)",
          },
          "75%": {
            clipPath: "inset(0 0 0 98%)",
          },
        },
        borderRotateReverse: {
          "0%, 100%": {
            clipPath: "inset(98% 0 0 0)",
          },
          "25%": {
            clipPath: "inset(0 0 0 98%)",
          },
          "50%": {
            clipPath: "inset(0 0 98% 0)",
          },
          "75%": {
            clipPath: "inset(0 98% 0 0)",
          },
        },
        shine: {
          "0%": { transform: "translateX(-80%)" },
          "100%": { transform: "translateX(80%)" },
        },
        "border-flow": {
          "0%, 100%": { backgroundPosition: "200% 50%" },
          "50%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        wave: "wave 2.5s infinite",
        "fade-in-down": "fadeInDown 0.5s ease-out",
        scroll: "scroll 20s linear infinite",
        blob: "blob 7s infinite",
        "border-rotate": "borderRotate 3s linear infinite",
        "border-rotate-reverse": "borderRotateReverse 3s linear infinite",
        shine: "shine 1.5s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "border-flow": "border-flow 3s ease infinite",
      },
    },
  },
  plugins: [],
};
export default config;
