import type { Metadata, Viewport } from "next";
import { Fredoka, Instrument_Sans } from "next/font/google";
import Dock from "@/components/lumen/Dock";
import Inspector from "@/components/lumen/Inspector";
import LightEngine from "@/components/lumen/LightEngine";
import ReviewFooter from "@/components/lumen/ReviewFooter";
import ReviewHeader from "@/components/lumen/ReviewHeader";
import { springCssVariables } from "@/lib/lumen/springs";
import "./lumen.css";

// Lumen Draft is under review: it lives at /review, outside the live site's shell, and
// search engines are asked not to index it.
const display = Fredoka({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--ld-font-display",
  display: "swap",
});
const text = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--ld-font-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Sandeep Kumar · Lumen Draft review", template: "%s · Lumen Draft review" },
  description:
    "A redesign of Sandeep Kumar's portfolio in the Lumen Draft design language, under review.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ECEEE7" },
    { media: "(prefers-color-scheme: dark)", color: "#1D1F1B" },
  ],
};

const toCss = (variables: Record<string, string>) =>
  Object.entries(variables)
    .map(([key, value]) => `${key}:${value}`)
    .join(";");

// Springs become CSS easings once, on the server. Reduced motion gets critically damped ones.
const springStyles = `:root{${toCss(springCssVariables())}}@media (prefers-reduced-motion: reduce){:root{${toCss(springCssVariables(true))}}}`;
const themeScript = `try{var t=localStorage.getItem("ld-theme");if(t==="dark"||t==="light")document.documentElement.dataset.ldTheme=t}catch(e){}`;

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`ld ${display.variable} ${text.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <style dangerouslySetInnerHTML={{ __html: springStyles }} />
      <a className="ld-skip" href="#ld-main">
        Skip to content
      </a>
      <ReviewHeader />
      <main id="ld-main" tabIndex={-1}>
        {children}
      </main>
      <ReviewFooter />
      <Dock />
      <svg id="ld-holdring" className="ld-holdring" viewBox="0 0 56 56" aria-hidden="true">
        <circle className="ld-holdring-halo" cx="28" cy="28" r="27" />
        <circle className="ld-holdring-arc" cx="28" cy="28" r="23" />
      </svg>
      <div id="ld-live" className="ld-sr-only" aria-live="polite" />
      <LightEngine />
      <Inspector />
    </div>
  );
}
