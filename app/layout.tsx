import type { Metadata, Viewport } from "next";
import { Outfit, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroller from "@/components/SmoothScroller";
import Template from "./template";
import Bot from "@/components/Bot";
import CustomCursor from "@/components/ui/CustomCursor";
import ClickSpark from "@/components/ui/ClickSpark";

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

import { Meteors } from "@/components/ui/Meteors";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${outfit.variable} ${poppins.variable}`} lang="en">
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-background"></div>
          {/* Meteor Shower Background */}
          <Meteors number={30} />
        </div>
        <Header />

        <SmoothScroller>
          <main className="relative z-10 min-h-screen">
            <Template>{children}</Template>
          </main>
          <Footer />
        </SmoothScroller>
        <Bot />
        <CustomCursor />
        <ClickSpark />
      </body>
    </html>
  );
}
