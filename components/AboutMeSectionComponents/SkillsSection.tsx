import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
	CONTAINER: {
		DURATION: 0.8,
		EASE: "power3.out",
	},
	SKILLS: {
		STAGGER: 0.05,
		DURATION: 0.4,
		SCALE: {
			START: 0.8,
			END: 1,
		},
		EASE: "back.out(1.7)",
	},
	CATEGORY: {
		STAGGER: 0.2,
		DURATION: 0.6,
		Y_OFFSET: 40,
		EASE: "power2.out",
	},
	HOVER: {
		SCALE: 1.1,
		DURATION: 0.2,
		EASE: "power1.out",
	},
} as const;

const skillsData = {
	frontend: [
		"React",
		"Next.js",
		"TypeScript",
		"Tailwind CSS",
		"GSAP",
		"Framer Motion",
	],
	backend: ["Node.js", "Express", "MongoDB", "REST APIs"],
	tools: ["Git", "Docker", "AWS", "Vercel", "Postman", "Swagger"],
	other: [
		"UI/UX Design",
		"Performance Optimization",
		"SEO",
		"Responsive Design",
		"React Native",
		"App Development",
	],
} as const;

const SkillsSection = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const skillsRef = useRef<HTMLDivElement>(null);
	const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
	const [initialAnimationComplete, setInitialAnimationComplete] =
		useState(false);

	useGSAP(
		() => {
			if (!containerRef.current || !titleRef.current || !skillsRef.current)
				return;

			const skillItems = skillsRef.current.querySelectorAll(".skill-item");
			const categories = Array.from(skillsRef.current.children);

			// Main animation timeline with single trigger
			const mainTl = gsap.timeline({
				scrollTrigger: {
					trigger: containerRef.current,
					start: "top 80%",
					end: "bottom 20%",
					toggleActions: "play none none reverse",
					markers: false,
				},
				onComplete: () => setInitialAnimationComplete(true),
				onReverseComplete: () => setInitialAnimationComplete(false),
			});

			// Title animation
			mainTl.fromTo(
				titleRef.current,
				{
					opacity: 0,
					y: 30,
				},
				{
					opacity: 1,
					y: 0,
					duration: ANIMATION_CONFIG.CONTAINER.DURATION,
					ease: ANIMATION_CONFIG.CONTAINER.EASE,
				}
			);

			// Staggered entrance for categories
			categories.forEach((category, index) => {
				mainTl.fromTo(
					category,
					{
						opacity: 0,
						y: ANIMATION_CONFIG.CATEGORY.Y_OFFSET,
					},
					{
						opacity: 1,
						y: 0,
						duration: ANIMATION_CONFIG.CATEGORY.DURATION,
						ease: ANIMATION_CONFIG.CATEGORY.EASE,
					},
					index === 0 ? "-=0.4" : "-=0.2"
				);
			});

			// Skills animation
			mainTl.fromTo(
				skillItems,
				{
					opacity: 0,
					scale: ANIMATION_CONFIG.SKILLS.SCALE.START,
				},
				{
					opacity: 1,
					scale: ANIMATION_CONFIG.SKILLS.SCALE.END,
					duration: ANIMATION_CONFIG.SKILLS.DURATION,
					stagger: ANIMATION_CONFIG.SKILLS.STAGGER,
					ease: ANIMATION_CONFIG.SKILLS.EASE,
				},
				"-=0.2"
			);

			// Category highlight animations (added to main timeline)
			categories.forEach((category, index) => {
				mainTl.fromTo(
					category,
					{
						backgroundColor: "rgba(17, 17, 17, 0.3)",
						borderColor: "rgba(0, 255, 159, 0.1)",
					},
					{
						backgroundColor: "rgba(0, 255, 159, 0.05)",
						borderColor: "rgba(0, 255, 159, 0.3)",
						duration: 0.4,
						ease: "power2.out",
					},
					`-=${0.2 * (categories.length - index)}`
				);
			});

			// Floating animation for categories
			gsap
				.timeline({
					scrollTrigger: {
						trigger: containerRef.current,
						start: "top bottom",
						end: "bottom top",
						scrub: 0.5,
					},
				})
				.to(categories, {
					y: (i) => Math.sin(i * Math.PI) * (i % 2 === 0 ? 10 : -10),
					ease: "none",
				});
		},
		{ scope: containerRef }
	);

	// Set up hover animations separately, only after initial animations are complete
	useEffect(() => {
		if (!initialAnimationComplete || !skillsRef.current) return;

		const skillItems = skillsRef.current.querySelectorAll(".skill-item");
		const hoverAnimations = new Map();

		// Create hover animations
		skillItems.forEach((item) => {
			const hoverTl = gsap.timeline({ paused: true });

			hoverTl.to(item, {
				scale: ANIMATION_CONFIG.HOVER.SCALE,
				backgroundColor: "rgba(0, 255, 159, 0.2)",
				color: "#ffffff",
				duration: ANIMATION_CONFIG.HOVER.DURATION,
				ease: ANIMATION_CONFIG.HOVER.EASE,
			});

			hoverAnimations.set(item, hoverTl);

			const handleMouseEnter = () => hoverAnimations.get(item).play();
			const handleMouseLeave = () => hoverAnimations.get(item).reverse();

			item.addEventListener("mouseenter", handleMouseEnter);
			item.addEventListener("mouseleave", handleMouseLeave);
		});

		// Cleanup function
		return () => {
			skillItems.forEach((item) => {
				const hoverTl = hoverAnimations.get(item);
				if (hoverTl) {
					hoverTl.kill();
				}
				item.removeEventListener("mouseenter", () => {});
				item.removeEventListener("mouseleave", () => {});
			});
		};
	}, [initialAnimationComplete]);

	return (
		<div
			ref={containerRef}
			className="space-y-8"
			style={{ willChange: "transform" }}
		>
			<h3
				ref={titleRef}
				className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
			>
				Skills & Technologies
			</h3>

			<div ref={skillsRef} className="grid gap-6 sm:grid-cols-2">
				{Object.entries(skillsData).map(([category, skills], index) => (
					<div
						key={category}
						ref={(el: HTMLDivElement | null) => {
							categoryRefs.current[index] = el;
						}}
						className="p-4 rounded-xl bg-gray-900/30 border border-primary/10 space-y-3"
						style={{ willChange: "transform, opacity, background-color" }}
					>
						<h4 className="text-lg font-medium capitalize text-gray-200">
							{category}
						</h4>
						<div className="flex flex-wrap gap-2">
							{skills.map((skill) => (
								<span
									key={skill}
									className="skill-item px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm
                    cursor-pointer"
									style={{ willChange: "transform, opacity, background-color" }}
								>
									{skill}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SkillsSection;
