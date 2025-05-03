import type { Metadata, Viewport } from "next";
import { Outfit, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import gsap from "gsap";
// import GsapInitializer from "@/components/GsapInitializer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Sandeep's Portfolio",
  description: "How Bad Possibly It Could Be",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${outfit.variable} bg-secondary text-light`}>
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-dark via-secondary to-dark"></div>
          <div
            className="absolute inset-0 backdrop-blur-2xl"
            style={{
              maskImage:
                "radial-gradient(circle at 50% 50%, white 0%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10">
          <Header />
          {/* <GsapInitializer> */}
            <main className="min-h-screen">{children}</main>
          {/* </GsapInitializer> */}
          <Footer />
        </div>

      </body>
    </html>
  );
}
