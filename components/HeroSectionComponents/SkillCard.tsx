import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface SkillCardProps {
	icon: string;
	text: string;
}

const SkillCard = ({ icon, text }: SkillCardProps) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const iconRef = useRef<HTMLDivElement>(null);

	useGSAP(() => {
		if (!cardRef.current || !iconRef.current) return;

		const ctx = gsap.context(() => {
			const hoverTl = gsap.timeline({ paused: true });
			hoverTl
				.to(cardRef.current, {
					y: -5,
					boxShadow: "0 10px 20px rgba(0, 255, 159, 0.15)",
					duration: 0.3,
					ease: "power2.out",
					force3D: true,
				})
				.to(
					iconRef.current,
					{
						scale: 1.1,
						color: "var(--color-primary)",
						duration: 0.3,
						ease: "power2.out",
						force3D: true,
					},
					0
				)
				.to(
					cardRef.current!.querySelector(".card-gradient")!,
					{
						opacity: 1,
						duration: 0.3,
						ease: "power2.out",
					},
					0
				);

			const handleMouseEnter = () => hoverTl.play();
			const handleMouseLeave = () => hoverTl.reverse();

			cardRef.current?.addEventListener("mouseenter", handleMouseEnter);
			cardRef.current?.addEventListener("mouseleave", handleMouseLeave);

			return () => {
				cardRef.current?.removeEventListener("mouseenter", handleMouseEnter);
				cardRef.current?.removeEventListener("mouseleave", handleMouseLeave);
				hoverTl.kill();
			};
		});

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={cardRef}
			className="relative bg-white/5 rounded-xl p-4 cursor-pointer transform-gpu h-16 flex items-center"
			style={{ willChange: "transform" }}
		>
			<div className="card-gradient absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-xl opacity-0" />
			<div className="relative flex items-center gap-3 w-full">
				<div
					ref={iconRef}
					className="text-2xl transform-gpu text-gray-300"
					style={{ willChange: "transform" }}
				>
					{icon}
				</div>
				<div className="text-gray-200 text-sm font-medium">{text}</div>
			</div>
		</div>
	);
};

export default SkillCard;
