"use client";
import ContactForm from "@/components/ContactForm";
import HeroSection from "@/components/HeroSection";
import AboutMe from "@/components/AboutMe";

const Home: React.FC = () => {
	return (
		<>
			<HeroSection />
			<AboutMe />
			<ContactForm />
		</>
	);
};

export default Home;
