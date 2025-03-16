"use client";
import { useEffect } from "react";
import Lenis from "lenis";

// Define props interface to allow customization of scroll behavior
interface SmoothScrollProps {
	children: React.ReactNode;
	// Smoothness controls
	duration?: number; // Duration of the scroll animation (higher = smoother but slower)
	lerp?: number; // Linear interpolation factor (lower = smoother but more delayed)
	wheelMultiplier?: number; // How much wheel events affect scrolling (lower = smoother)
	touchMultiplier?: number; // How much touch events affect scrolling
	easing?: (t: number) => number; // Easing function for the scroll animation
	infinite?: boolean; // Whether scrolling should loop
}

export default function SmoothScroll({
	children,
	// Default values for smooth scrolling
	duration = 1, // Default: 1.8 (increase for smoother, decrease for more responsive)
	lerp = 0.1, // Default: 0.1 (lower = smoother but more delayed, 0.05-0.15 is a good range)
	wheelMultiplier = 1, // Default: 1 (lower = smoother wheel scrolling)
	touchMultiplier = 2, // Default: 2 (lower = smoother touch scrolling)
	easing = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // Default easing function
	infinite = false, // Default: false
}: SmoothScrollProps) {
	useEffect(() => {
		// Create a new Lenis instance with the provided parameters
		const lenis = new Lenis({
			duration, // Controls animation duration
			easing, // Controls the acceleration curve
			orientation: "vertical",
			gestureOrientation: "vertical",
			lerp, // Controls smoothness (lower = smoother but more delayed)
			wheelMultiplier, // Controls wheel sensitivity
			touchMultiplier, // Controls touch sensitivity
			infinite, // Controls whether scrolling should loop
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	}, [duration, easing, lerp, wheelMultiplier, touchMultiplier, infinite]);

	return <>{children}</>;
}
