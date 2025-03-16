import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import { throttle } from "lodash";

export const Subtitle = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const subtitleRef = useRef<HTMLHeadingElement>(null);
	const splitInstanceRef = useRef<SplitType | null>(null);
	const isAnimatingRef = useRef(false);

	useGSAP(() => {
		if (!subtitleRef.current) return;

		// Create split instance once and store it
		splitInstanceRef.current = new SplitType(subtitleRef.current, {
			types: "chars",
		});

		if (!splitInstanceRef.current.chars) return;

		// Initial animation
		const tl = gsap.timeline({
			defaults: { ease: "power4.out", duration: 1 },
		});

		tl.from(
			splitInstanceRef.current.chars,
			{
				y: 50,
				opacity: 0,
				stagger: 0.02,
			},
			"-=0.5"
		);

		// Clean up function
		return () => {
			if (splitInstanceRef.current) {
				splitInstanceRef.current.revert();
			}
		};
	}, []);

	// Create throttled function
	const handleMouseMove = useCallback(() => {
		return throttle((e: MouseEvent) => {
			if (
				isAnimatingRef.current ||
				!containerRef.current ||
				!splitInstanceRef.current?.chars
			)
				return;

			// Prevent multiple animations from running simultaneously
			isAnimatingRef.current = true;

			const chars = splitInstanceRef.current.chars;
			const rect = containerRef.current.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;

			chars.forEach((char: HTMLElement) => {
				if (!char) return;
				const charRect = char.getBoundingClientRect();
				const charCenter = charRect.left + charRect.width / 2 - rect.left;
				const distance = Math.abs(mouseX - charCenter);
				const maxDistance = 100;
				const intensity = 1 - Math.min(distance / maxDistance, 1);

				if (intensity > 0) {
					gsap.to(char, {
						y: -15 * intensity,
						scale: 1 + 0.2 * intensity,
						duration: 0.3,
						ease: "power2.out",
					});
				} else {
					gsap.to(char, {
						y: 0,
						scale: 1,
						duration: 0.3,
						ease: "power2.out",
					});
				}
			});

			// Reset animation flag after a short delay
			setTimeout(() => {
				isAnimatingRef.current = false;
			}, 100);
		}, 16); // ~60fps throttle rate
	}, []);

	// Mouse leave handler to reset all characters
	const handleMouseLeave = useCallback(() => {
		if (!splitInstanceRef.current?.chars) return;

		gsap.to(splitInstanceRef.current.chars, {
			y: 0,
			scale: 1,
			duration: 0.3,
			ease: "power2.out",
		});
	}, []);

	// Set up and clean up event listeners
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Create the throttled handler
		const throttledMouseMove = handleMouseMove();

		// Cast the throttled function to the right type
		const mouseMoveHandler = throttledMouseMove as unknown as EventListener;
		container.addEventListener("mousemove", mouseMoveHandler);
		container.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			container.removeEventListener("mousemove", mouseMoveHandler);
			container.removeEventListener("mouseleave", handleMouseLeave);
			// Cancel any pending throttled calls using proper typing
			throttledMouseMove.cancel();
		};
	}, [handleMouseMove, handleMouseLeave]);

	return (
		<div ref={containerRef} className="subtitle-container">
			<h2
				ref={subtitleRef}
				className="hero-subtitle text-2xl md:text-3xl font-semibold text-[#4FD1C5]"
			>
				Full Stack Developer
			</h2>
		</div>
	);
};
