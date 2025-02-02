"use client";
import ContactForm from "@/components/ContactForm";
import HeroSection from "@/components/HeroSection";
import TechnicalSkills from "@/components/TechnicalSkills";
import AboutMe from "@/components/AboutMe";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AboutMe />
      <TechnicalSkills />
      <ContactForm />
    </>
  );
};

export default Home;
