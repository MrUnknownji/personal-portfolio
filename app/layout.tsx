import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import { Waves } from "@/components/WavesBackground";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Sandeep's Portfolio",
  description: "How Bad Possibly It Could Be",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="overflow-x-hidden relative"
        suppressHydrationWarning
      >
        {/* <div className="fixed top-0 left-0 w-screen h-screen">

        <Waves
          lineColor="rgba(255, 255, 255, 0.25)"
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
          />
          </div> */}
        <div className="relative z-10">
          <Header />
          <div className="min-h-screen">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
} 