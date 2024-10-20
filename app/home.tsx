"use client";
import ContactForm from "@/components/ContactForm";
import HeroSection from "@/components/HeroSection";
import TechnicalSkills from "@/components/TechnicalSkills";
import AboutMe from "@/components/AboutMe";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutMe />
      <TechnicalSkills />
      <ContactForm />
    </div>
  );
}
