import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  DM_Sans,
  Figtree,
  Fraunces,
  Fredoka,
  IBM_Plex_Sans,
  Instrument_Sans,
  JetBrains_Mono,
  Space_Grotesk,
  Unbounded,
} from "next/font/google";
import ReviewFooter from "@/components/lumen/ReviewFooter";
import ReviewHeader from "@/components/lumen/ReviewHeader";
import TweakPanel from "@/components/lumen/TweakPanel";
import { EARLY_SCRIPT } from "@/components/lumen/tweaks";
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

// Alternates for the tweak panel. Not preloaded: a browser fetches a face only once a tweak uses it.
// (Font loaders must each be assigned to a module-level const, with literal options.)
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--ldf-bricolage",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  preload: false,
  display: "swap",
  variable: "--ldf-fraunces",
});
const space = Space_Grotesk({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--ldf-space",
});
const unbounded = Unbounded({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--ldf-unbounded",
});
const dm = DM_Sans({ subsets: ["latin"], preload: false, display: "swap", variable: "--ldf-dm" });
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  preload: false,
  display: "swap",
  variable: "--ldf-plex",
});
const figtree = Figtree({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--ldf-figtree",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--ldf-mono",
});
const alternates = [bricolage, fraunces, space, unbounded, dm, plex, figtree, mono]
  .map((font) => font.variable)
  .join(" ");

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
    <div className={`ld ${display.variable} ${text.variable} ${alternates}`}>
      <script dangerouslySetInnerHTML={{ __html: themeScript + EARLY_SCRIPT }} />
      <style dangerouslySetInnerHTML={{ __html: springStyles }} />
      <a className="ld-skip" href="#ld-main">
        Skip to content
      </a>
      <ReviewHeader />
      <main id="ld-main" tabIndex={-1}>
        {children}
      </main>
      <ReviewFooter />
      <TweakPanel />
    </div>
  );
}
