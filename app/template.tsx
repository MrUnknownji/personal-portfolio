"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import PageLoader from "@/components/PageLoader";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

export default function Template({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const timeline = useRef<gsap.core.Timeline | null>(null);

	const createTransitionTimeline = () => {
		if (timeline.current) timeline.current.kill();

		timeline.current = gsap.timeline({
			onComplete: () => {
				setIsTransitioning(false);
				ScrollTrigger.refresh();
			},
			defaults: { ease: "power4.inOut" },
		});

		return timeline.current
			.fromTo(
				".transition-overlay",
				{ yPercent: 100, display: "block" },
				{ yPercent: 0, duration: 0.6 }
			)
			.fromTo(
				".page-content",
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.5, clearProps: "all" },
				">-0.2"
			);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
			setIsTransitioning(true);
			createTransitionTimeline();
		}, 1500);

		return () => {
			clearTimeout(timer);
			if (timeline.current) timeline.current.kill();
		};
	}, []);

	useEffect(() => {
		if (!isLoading) {
			const handleRouteChange = () => {
				setIsTransitioning(true);
				createTransitionTimeline();
			};

			window.addEventListener("popstate", handleRouteChange);
			return () => {
				window.removeEventListener("popstate", handleRouteChange);
				if (timeline.current) timeline.current.kill();
			};
		}
	}, [isLoading]);

	if (isLoading) {
		return <PageLoader />;
	}

	return (
		<>
			<div className="page-content relative z-10">{children}</div>
			<div
				className="transition-overlay fixed inset-0 bg-gray-950 z-50 transform translate-y-full pointer-events-none"
				style={{ display: isTransitioning ? "block" : "none" }}
			/>
		</>
	);
}
