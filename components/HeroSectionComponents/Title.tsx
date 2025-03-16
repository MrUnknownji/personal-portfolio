import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";

interface EventHandlerMap {
	enter: (event: MouseEvent) => void;
	leave: (event: MouseEvent) => void;
}

export const Title = () => {
	const titleRef = useRef<HTMLHeadingElement>(null);
	const splitInstanceRef = useRef<SplitType | null>(null);
	const wrapperRefs = useRef<HTMLSpanElement[]>([]);
	const eventHandlersRef = useRef<Map<HTMLSpanElement, EventHandlerMap>>(
		new Map()
	);
	const activeAnimationsRef = useRef<Map<HTMLSpanElement, gsap.core.Tween[]>>(
		new Map()
	);

	useGSAP(() => {
		if (!titleRef.current) return;

		// Create split instance once and store it
		splitInstanceRef.current = new SplitType(titleRef.current, {
			types: "chars",
		});
		if (!splitInstanceRef.current.chars) return;

		// Initial animation
		const tl = gsap.timeline({
			defaults: { ease: "power4.out", duration: 1 },
		});

		tl.from(splitInstanceRef.current.chars, {
			y: 100,
			opacity: 0,
			rotateX: -90,
			stagger: 0.02,
		});

		// Create wrappers for hover effect - only do this once
		splitInstanceRef.current.chars.forEach((char) => {
			if (!char.parentNode) return;

			// Create wrapper and elements
			const wrapper = document.createElement("span");
			wrapper.style.position = "relative";
			wrapper.style.display = "inline-block";

			const originalContent = char.innerHTML;
			char.innerHTML = "";
			char.style.position = "relative";
			char.style.display = "inline-block";

			const original = document.createElement("span");
			original.innerHTML = originalContent;
			original.style.position = "relative";
			original.style.display = "block";

			const clone = document.createElement("span");
			clone.innerHTML = originalContent;
			clone.style.position = "absolute";
			clone.style.left = "0";
			clone.style.top = "0";
			clone.style.opacity = "0";
			clone.style.color = "#4FD1C5";
			clone.style.transform = "translateY(100%)";

			// Append elements
			wrapper.appendChild(original);
			wrapper.appendChild(clone);
			char.appendChild(wrapper);

			// Store wrapper for cleanup
			wrapperRefs.current.push(wrapper);
		});

		// Clean up function
		return () => {
			if (splitInstanceRef.current) {
				splitInstanceRef.current.revert();
			}
			wrapperRefs.current = [];
			eventHandlersRef.current.clear();

			// Kill any active animations
			activeAnimationsRef.current.forEach((tweens) => {
				tweens.forEach((tween) => tween.kill());
			});
			activeAnimationsRef.current.clear();
		};
	}, []);

	// Set up and clean up event listeners separately after DOM elements are created
	useEffect(() => {
		// Add event listeners to all wrappers
		wrapperRefs.current.forEach((wrapper) => {
			const handleMouseEnter = () => {
				const original = wrapper.children[0] as HTMLElement;
				const clone = wrapper.children[1] as HTMLElement;

				// Kill any active animations on this wrapper
				const activeAnimations = activeAnimationsRef.current.get(wrapper) || [];
				activeAnimations.forEach((tween) => tween.kill());

				// Create new animations
				const tweens = [
					gsap.to(original, {
						y: "-100%",
						opacity: 0,
						duration: 0.3,
						ease: "power2.inOut",
					}),
					gsap.to(clone, {
						y: "0%",
						opacity: 1,
						duration: 0.3,
						ease: "power2.inOut",
					}),
				];

				// Store the new animations
				activeAnimationsRef.current.set(wrapper, tweens);
			};

			const handleMouseLeave = () => {
				const original = wrapper.children[0] as HTMLElement;
				const clone = wrapper.children[1] as HTMLElement;

				// Kill any active animations on this wrapper
				const activeAnimations = activeAnimationsRef.current.get(wrapper) || [];
				activeAnimations.forEach((tween) => tween.kill());

				// Create new animations
				const tweens = [
					gsap.to(original, {
						y: "0%",
						opacity: 1,
						duration: 0.3,
						ease: "power2.inOut",
					}),
					gsap.to(clone, {
						y: "100%",
						opacity: 0,
						duration: 0.3,
						ease: "power2.inOut",
					}),
				];

				// Store the new animations
				activeAnimationsRef.current.set(wrapper, tweens);
			};

			// Store handlers for cleanup
			eventHandlersRef.current.set(wrapper, {
				enter: handleMouseEnter,
				leave: handleMouseLeave,
			});

			// Add event listeners
			wrapper.addEventListener("mouseenter", handleMouseEnter);
			wrapper.addEventListener("mouseleave", handleMouseLeave);
		});

		// Capture the current value of eventHandlersRef for cleanup
		const currentEventHandlers = eventHandlersRef.current;

		// Clean up function
		return () => {
			wrapperRefs.current.forEach((wrapper) => {
				const handlers = currentEventHandlers.get(wrapper);
				if (handlers) {
					wrapper.removeEventListener("mouseenter", handlers.enter);
					wrapper.removeEventListener("mouseleave", handlers.leave);
				}
			});
		};
	}, []);

	return (
		<div className="overflow-hidden py-2">
			<h1
				ref={titleRef}
				className="hero-title text-white font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight"
			>
				Sandeep Kumar
			</h1>
		</div>
	);
};
