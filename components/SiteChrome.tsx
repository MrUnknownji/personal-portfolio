import "@/app/globals.css";
import "@/app/styles/chrome.css";
import "@/app/styles/hero.css";
import "@/app/styles/work.css";
import "@/app/styles/lab.css";
import "@/app/styles/about.css";
import "@/app/styles/toolkit.css";
import "@/app/styles/contact.css";
import "@/app/styles/assistant.css";
import "@/app/styles/build-file.css";
import "@/app/styles/preferences.css";
import { Barlow_Condensed, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyBot from "@/components/LazyBot";
import PortfolioPreferences from "@/components/PortfolioPreferences";
import { selectedProjects, toProjectSummary } from "@/data/projects";

const projectSummaries = selectedProjects.map(toProjectSummary);

const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: "800",
  variable: "--font-display",
  display: "swap",
});
const bodyFont = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const labelFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-label",
  display: "swap",
  // Labels are small and secondary; let the body and display fonts load first.
  preload: false,
});

// The live site's fonts are declared here, not in the root layout, so /review doesn't preload them.
const fontVariables = `:root{--font-display:${displayFont.style.fontFamily};--font-body:${bodyFont.style.fontFamily};--font-label:${labelFont.style.fontFamily}}`;

// The live portfolio's header, footer, assistant, and styles. Pages under /review use their own shell.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fontVariables }} />
      <PortfolioPreferences />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header workPreviewImage={selectedProjects[0].image} projectCount={selectedProjects.length} />
      <main id="main" className="relative min-h-screen" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <LazyBot projects={projectSummaries} />
    </>
  );
}
