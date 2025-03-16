import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const HireBadge = () => {
	const badgeRef = useRef<HTMLDivElement>(null);
	const pulseRef = useRef<HTMLSpanElement>(null);
	const dotRef = useRef<HTMLSpanElement>(null);

	useGSAP(() => {
		if (!badgeRef.current || !pulseRef.current || !dotRef.current) return;

		const ctx = gsap.context(() => {
			// Pulse animation instead of animate-ping
			gsap.to(pulseRef.current, {
				scale: 1.5,
				opacity: 0,
				duration: 1.5,
				repeat: -1,
				ease: "power1.inOut",
				force3D: true,
			});

			// Badge hover animation
			const hoverTl = gsap.timeline({ paused: true });
			hoverTl
				.to(badgeRef.current, {
					scale: 1.05,
					duration: 0.2,
					ease: "power2.out",
					force3D: true,
				})
				.to(
					".pulse-ring",
					{
						scale: 1.5,
						opacity: 0,
						duration: 0.8,
						ease: "power2.out",
						force3D: true,
					},
					0
				);

			const handleMouseEnter = () => hoverTl.play();
			const handleMouseLeave = () => hoverTl.reverse();

			badgeRef.current?.addEventListener("mouseenter", handleMouseEnter);
			badgeRef.current?.addEventListener("mouseleave", handleMouseLeave);

			return () => {
				badgeRef.current?.removeEventListener("mouseenter", handleMouseEnter);
				badgeRef.current?.removeEventListener("mouseleave", handleMouseLeave);
				hoverTl.kill();
			};
		});

		return () => ctx.revert();
	}, []);

	return (
		<div className="relative inline-block">
			<span
				ref={badgeRef}
				className="relative inline-flex items-center px-4 py-2 rounded-full
        bg-primary/10 text-primary text-sm font-medium border border-primary/20
        hover:bg-primary/20 transition-colors duration-300 cursor-pointer transform-gpu"
				style={{ willChange: "transform" }}
			>
				<span className="pulse-ring absolute inset-0 border-2 border-primary/30 rounded-full" />
				<span className="relative flex h-2 w-2 mr-2">
					<span
						ref={pulseRef}
						className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 transform-gpu"
						style={{ willChange: "transform, opacity" }}
					/>
					<span
						ref={dotRef}
						className="relative inline-flex rounded-full h-2 w-2 bg-primary"
					/>
				</span>
				Available for hire
			</span>
		</div>
	);
};

export default HireBadge;
