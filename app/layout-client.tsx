"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import PageTransition from "@/components/PageTransition";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

const BackgroundBlobs: React.FC = () => (
  <div className="fixed inset-0 blur-3xl opacity-10 pointer-events-none select-none">
    <div className="absolute top-0 -left-4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
    <div className="absolute top-0 -right-4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
    <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
  </div>
);

const LayoutClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  useGSAP(() => {
    if (!isLoading && !isTransitioning && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
        },
      );
    }
  }, [isLoading, isTransitioning]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      {isTransitioning && <PageTransition />}
      <div ref={contentRef} className={`${isTransitioning ? "opacity-0" : ""}`}>
        <BackgroundBlobs />
        <div suppressHydrationWarning>
          <div className="hidden md:block [@media(hover:none)]:hidden">
            <CustomCursor />
          </div>
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default LayoutClient;
