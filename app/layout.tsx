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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
  title: "Sandeep's Portfolio",
  description: "How Bad Possibly It Could Be",
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

        <ClickSpark />
        <DynamicCursor />
      </body>
    </html>
  );
}
