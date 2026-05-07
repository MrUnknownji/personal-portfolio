import type { Metadata, Viewport } from "next";
import { Outfit, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroller from "@/components/SmoothScroller";
import Template from "./template";
import LazyBot from "@/components/LazyBot";
import ClickSpark from "@/components/ui/ClickSpark";
import DynamicCursor from "@/components/ui/DynamicCursor";
import ResponsiveMeteors from "@/components/ui/ResponsiveMeteors";
import GlobalBackground from "@/components/GlobalBackground";
import ScrollMandala from "@/components/ui/ScrollMandala";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0908",
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Sandeep Kumar | Full Stack Developer",
    template: "%s | Sandeep Kumar",
  },
  description:
    "Portfolio of Sandeep Kumar, a full stack developer building performant web, mobile, and AI-powered product experiences.",
  openGraph: {
    title: "Sandeep Kumar | Full Stack Developer",
    description:
      "Explore Sandeep Kumar's full stack projects, technical skills, and contact information.",
    url: "/",
    siteName: "Sandeep Kumar Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandeep Kumar | Full Stack Developer",
    description:
      "Full stack developer portfolio featuring web, mobile, and AI-powered products.",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${outfit.variable} ${poppins.variable}`} lang="en">
      <body className="bg-transparent text-foreground" suppressHydrationWarning>
        <GlobalBackground />
        <ResponsiveMeteors />
        <Header />

        <SmoothScroller>
          <main className="relative min-h-screen">
            <Template>{children}</Template>
          </main>
          <Footer />
        </SmoothScroller>
        <LazyBot />
        <ScrollMandala />

        <ClickSpark />
        <DynamicCursor />
      </body>
    </html>
  );
}
