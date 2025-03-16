import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import { throttle } from "lodash";

export const Description = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const splitInstanceRef = useRef<SplitType | null>(null);
	const isAnimatingRef = useRef(false);

	useGSAP(() => {
		if (!descriptionRef.current) return;

		splitInstanceRef.current = new SplitType(descriptionRef.current, {
			types: "chars",
		});

		const chars = splitInstanceRef.current.chars;
		if (!chars) return;

		const tl = gsap.timeline({
			defaults: { ease: "power4.out", duration: 1 },
		});

		tl.from(
			chars,
			{
				y: 20,
				opacity: 0,
				stagger: 0.01,
			},
			"-=0.5"
		);

		return () => {
			if (splitInstanceRef.current) {
				splitInstanceRef.current.revert();
			}
		};
	}, []);

	const handleMouseMove = useCallback(() => {
		return throttle((e: MouseEvent) => {
			if (
				isAnimatingRef.current ||
				!containerRef.current ||
				!splitInstanceRef.current?.chars
			)
				return;

			isAnimatingRef.current = true;
			const chars = splitInstanceRef.current.chars;
			const rect = containerRef.current.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			// Process each character individually
			chars.forEach((char: HTMLElement) => {
				if (!char) return;
				const charRect = char.getBoundingClientRect();
				const charCenterX = charRect.left + charRect.width / 2 - rect.left;
				const charCenterY = charRect.top + charRect.height / 2 - rect.top;

				const distance = Math.sqrt(
					Math.pow(mouseX - charCenterX, 2) + Math.pow(mouseY - charCenterY, 2)
				);

				const maxDistance = 100;
				const intensity = 1 - Math.min(distance / maxDistance, 1);

				if (intensity > 0) {
					gsap.to(char, {
						color: "#4FD1C5",
						scale: 1 + 0.2 * intensity,
						opacity: 0.5 + 0.5 * intensity,
						duration: 0.3,
						ease: "power2.out",
					});
				} else {
					gsap.to(char, {
						color: "#9CA3AF",
						scale: 1,
						opacity: 1,
						duration: 0.3,
						ease: "power2.out",
					});
				}
			});

			// Set a timeout to allow new animations after current ones complete
			setTimeout(() => {
				isAnimatingRef.current = false;
			}, 100);
		}, 16);
	}, []);

	const handleMouseLeave = useCallback(() => {
		if (!splitInstanceRef.current?.chars) return;

		gsap.to(splitInstanceRef.current.chars, {
			color: "#9CA3AF",
			scale: 1,
			opacity: 1,
			duration: 0.3,
			ease: "power2.out",
		});
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Create the throttled handler
		const throttledMouseMove = handleMouseMove();

		const mouseMoveHandler = throttledMouseMove as unknown as EventListener;
		container.addEventListener("mousemove", mouseMoveHandler);
		container.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			container.removeEventListener("mousemove", mouseMoveHandler);
			container.removeEventListener("mouseleave", handleMouseLeave);
			throttledMouseMove.cancel();
		};
	}, [handleMouseMove, handleMouseLeave]);

	return (
		<div ref={containerRef} className="overflow-hidden cursor-pointer">
			<p
				ref={descriptionRef}
				className="hero-description text-gray-300 text-lg leading-relaxed max-w-2xl"
			>
				Transforming ideas into elegant digital solutions with clean code and
				innovative thinking.
			</p>
		</div>
	);
};
