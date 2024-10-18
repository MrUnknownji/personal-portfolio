"use client";
import ContactForm from "@/components/ContactForm";
import HeroSection from "@/components/HeroSection";
import TechnicalSkills from "@/components/TechnicalSkills";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TechnicalSkills />
      <div className="text-center py-12">
        <Link
          href="/my-projects"
          className="bg-primary text-secondary font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition duration-300"
        >
          View My Projects
        </Link>
      </div>
      <ContactForm />
    </div>
  );
}
