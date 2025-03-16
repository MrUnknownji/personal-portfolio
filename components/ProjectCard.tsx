"use client";
import React, { memo, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Project } from "@/types/Project";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ProjectCardProps {
	project: Project;
	onClick: () => void;
}

const ANIMATION_CONFIG = {
	HOVER: {
		CARD: {
			SCALE: 1.06,
			DURATION: 0.3,
			EASE: "power3.out",
		},
		IMAGE: {
			SCALE: 1.12,
			DURATION: 0.4,
			EASE: "power2.out",
		},
		OVERLAY: {
			OPACITY: 0.9,
			DURATION: 0.3,
			EASE: "power2.out",
		},
	},
	TECH_TAGS: {
		MAX_DISPLAY: 3,
		STAGGER: 0.05,
	},
} as const;

const ProjectCardComponent: React.FC<ProjectCardProps> = ({
	project,
	onClick,
}) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const techTagsRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const isAnimatingRef = useRef(false);

	// Cleanup function to ensure all animations are properly killed
	useEffect(() => {
		// Capture ref values inside the effect to avoid React Hook warnings
		const timeline = timelineRef.current;
		const card = cardRef.current;
		const image = imageRef.current;
		const overlay = overlayRef.current;
		const techTags = techTagsRef.current;

		return () => {
			if (timeline) {
				timeline.kill();
			}

			// Reset all animated elements
			if (card) {
				gsap.set(card, { clearProps: "all" });
			}
			if (image) {
				gsap.set(image, { clearProps: "all" });
			}
			if (overlay) {
				gsap.set(overlay, { clearProps: "all" });
			}
			if (techTags && techTags.children.length > 0) {
				gsap.set(Array.from(techTags.children), { clearProps: "all" });
			}
		};
	}, []);

	// Create a single reusable timeline for hover animations
	const setupHoverAnimation = useCallback((isEntering: boolean) => {
		// Don't create a new timeline if one is already running
		if (isAnimatingRef.current) {
			if (timelineRef.current) {
				// Just reverse the current timeline if needed
				if (isEntering) {
					timelineRef.current.play();
				} else {
					timelineRef.current.reverse();
				}
				return;
			}
		}

		isAnimatingRef.current = true;

		// Kill any existing timeline to prevent conflicts
		if (timelineRef.current) {
			timelineRef.current.kill();
			timelineRef.current = null;
		}

		// Create a new timeline
		timelineRef.current = gsap.timeline({
			defaults: {
				duration: ANIMATION_CONFIG.HOVER.CARD.DURATION,
				ease: ANIMATION_CONFIG.HOVER.CARD.EASE,
				overwrite: "auto",
			},
			onComplete: () => {
				isAnimatingRef.current = false;
				if (!isEntering) {
					// Clear transforms when animation completes and we're not hovering
					if (cardRef.current) gsap.set(cardRef.current, { clearProps: "all" });
					if (imageRef.current)
						gsap.set(imageRef.current, { clearProps: "all" });
					if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });

					// Clear tech tags animations if they exist
					if (techTagsRef.current && techTagsRef.current.children.length > 0) {
						gsap.set(Array.from(techTagsRef.current.children), {
							clearProps: "all",
						});
					}
				}
			},
			onReverseComplete: () => {
				isAnimatingRef.current = false;
				// Clear transforms when reverse animation completes
				if (cardRef.current) gsap.set(cardRef.current, { clearProps: "all" });
				if (imageRef.current) gsap.set(imageRef.current, { clearProps: "all" });
				if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });

				// Clear tech tags animations if they exist
				if (techTagsRef.current && techTagsRef.current.children.length > 0) {
					gsap.set(Array.from(techTagsRef.current.children), {
						clearProps: "all",
					});
				}
			},
			paused: true,
		});

		// Build the timeline
		timelineRef.current
			.to(cardRef.current, {
				scale: isEntering ? ANIMATION_CONFIG.HOVER.CARD.SCALE : 1,
				y: isEntering ? -5 : 0,
				boxShadow: isEntering
					? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
					: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
			})
			.to(
				imageRef.current,
				{
					scale: isEntering ? ANIMATION_CONFIG.HOVER.IMAGE.SCALE : 1,
					duration: ANIMATION_CONFIG.HOVER.IMAGE.DURATION,
					ease: ANIMATION_CONFIG.HOVER.IMAGE.EASE,
				},
				"<"
			)
			.to(
				overlayRef.current,
				{
					opacity: isEntering ? ANIMATION_CONFIG.HOVER.OVERLAY.OPACITY : 0,
					duration: ANIMATION_CONFIG.HOVER.OVERLAY.DURATION,
					ease: ANIMATION_CONFIG.HOVER.OVERLAY.EASE,
				},
				"<"
			);

		// Only animate tech tags if they exist
		if (techTagsRef.current?.children.length) {
			if (isEntering) {
				timelineRef.current.fromTo(
					Array.from(techTagsRef.current.children),
					{ y: 5, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						stagger: ANIMATION_CONFIG.TECH_TAGS.STAGGER,
						duration: 0.2,
					},
					"<+=0.1"
				);
			} else {
				timelineRef.current.to(
					Array.from(techTagsRef.current.children),
					{
						y: 0,
						opacity: 1,
						stagger: 0,
						duration: 0.2,
					},
					"<"
				);
			}
		}

		// Play the timeline immediately
		timelineRef.current.play();
	}, []);

	const handleMouseEnter = useCallback(() => {
		setupHoverAnimation(true);
	}, [setupHoverAnimation]);

	const handleMouseLeave = useCallback(() => {
		setupHoverAnimation(false);
	}, [setupHoverAnimation]);

	useGSAP(
		() => {
			// Set initial states
			gsap.set([cardRef.current, imageRef.current], {
				scale: 1,
				transformOrigin: "center",
				clearProps: "transform", // Clear any leftover transforms
			});
			gsap.set(overlayRef.current, { opacity: 0 });
		},
		{ scope: cardRef }
	);

	return (
		<div
			ref={cardRef}
			className="bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md cursor-pointer transform-gpu"
			onClick={onClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{
				willChange: "transform",
				backfaceVisibility: "hidden",
			}}
		>
			<div
				ref={imageContainerRef}
				className="relative h-48 md:h-56 lg:h-60 overflow-hidden"
			>
				<Image
					ref={imageRef}
					src={project.image}
					alt={project.title}
					fill
					className="object-cover transform-gpu"
					style={{
						objectFit: "cover",
						backfaceVisibility: "hidden",
					}}
					priority
				/>
				<div
					ref={overlayRef}
					className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-0 flex items-end justify-start p-4 md:p-6 transform-gpu"
					style={{ backfaceVisibility: "hidden" }}
				>
					<span className="text-white text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
						View Details
					</span>
				</div>
			</div>

			<div ref={contentRef} className="p-4 md:p-6">
				<h3 className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2 md:mb-3">
					{project.title}
				</h3>
				<p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
					{project.shortDescription}
				</p>
				<div ref={techTagsRef} className="flex flex-wrap gap-1 md:gap-2">
					{project.technologies
						.slice(0, ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY)
						.map((tech, index) => (
							<span
								key={index}
								className="bg-gray-700/80 backdrop-blur-sm text-accent text-xs md:text-sm px-2 md:px-3 py-1 rounded-full border border-accent/20"
							>
								{tech}
							</span>
						))}
					{project.technologies.length >
						ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY && (
						<span className="bg-gray-700/80 backdrop-blur-sm text-accent text-xs md:text-sm px-2 md:px-3 py-1 rounded-full border border-accent/20">
							+
							{project.technologies.length -
								ANIMATION_CONFIG.TECH_TAGS.MAX_DISPLAY}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

const ProjectCard = memo(ProjectCardComponent);
export default ProjectCard;
