"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "@/components/Footer";

// Dynamically import CustomCursor to reduce initial bundle size
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

const BackgroundBlobs = () => (
  <div className="fixed inset-0 blur-3xl opacity-10 pointer-events-none select-none">
    <div className="absolute top-0 -left-4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
    <div className="absolute top-0 -right-4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
    <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
  </div>
);

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <BackgroundBlobs />
      <div>
        <div className="hidden md:block [@media(hover:none)]:hidden">
          <CustomCursor />
        </div>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
