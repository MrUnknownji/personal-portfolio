import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

interface InfoItemProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	link: string;
}

const ANIMATION_CONFIG = {
	HOVER: {
		DURATION: 0.3,
		EASE: "power2.out",
		X_OFFSET: 4,
		BG: {
			NORMAL: "rgba(31, 41, 55, 0.5)",
			HOVER: "rgba(31, 41, 55, 0.7)",
		},
		BORDER: {
			NORMAL: "rgba(55, 65, 81, 0.5)",
			HOVER: "rgba(79, 209, 197, 0.3)",
		},
		TEXT: {
			LABEL: {
				NORMAL: "rgba(156, 163, 175, 1)",
				HOVER: "rgba(209, 213, 219, 1)",
			},
			VALUE: {
				NORMAL: "rgba(229, 231, 235, 1)",
				HOVER: "rgba(255, 255, 255, 1)",
			},
		},
		ICON_BG: {
			NORMAL: "rgba(79, 209, 197, 0.1)",
			HOVER: "rgba(79, 209, 197, 0.2)",
		},
	},
};

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, link }) => {
	const linkRef = useRef<HTMLAnchorElement>(null);
	const iconBgRef = useRef<HTMLDivElement>(null);
	const labelRef = useRef<HTMLDivElement>(null);
	const valueRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (
			!linkRef.current ||
			!iconBgRef.current ||
			!labelRef.current ||
			!valueRef.current
		)
			return;

		const link = linkRef.current;

		const handleMouseEnter = () => {
			gsap.to(link, {
				x: ANIMATION_CONFIG.HOVER.X_OFFSET,
				backgroundColor: ANIMATION_CONFIG.HOVER.BG.HOVER,
				borderColor: ANIMATION_CONFIG.HOVER.BORDER.HOVER,
				duration: ANIMATION_CONFIG.HOVER.DURATION,
				ease: ANIMATION_CONFIG.HOVER.EASE,
				force3D: true,
			});

			gsap.to(iconBgRef.current, {
				backgroundColor: ANIMATION_CONFIG.HOVER.ICON_BG.HOVER,
				duration: ANIMATION_CONFIG.HOVER.DURATION,
				ease: ANIMATION_CONFIG.HOVER.EASE,
			});

			gsap.to(labelRef.current, {
				color: ANIMATION_CONFIG.HOVER.TEXT.LABEL.HOVER,
				duration: ANIMATION_CONFIG.HOVER.DURATION,
				ease: ANIMATION_CONFIG.HOVER.EASE,
			});

			gsap.to(valueRef.current, {
				color: ANIMATION_CONFIG.HOVER.TEXT.VALUE.HOVER,
				duration: ANIMATION_CONFIG.HOVER.DURATION,
				ease: ANIMATION_CONFIG.HOVER.EASE,
			});
		};

		const handleMouseLeave = () => {
			gsap.to(link, {
				x: 0,
				backgroundColor: ANIMATION_CONFIG.HOVER.BG.NORMAL,
				borderColor: ANIMATION_CONFIG.HOVER.BORDER.NORMAL,
				duration: ANIMATION_CONFIG.HOVER.DURATION,
				ease: ANIMATION_CONFIG.HOVER.EASE,
				force3D: true,
			});

			gsap.to(iconBgRef.current, {
				backgroundColor: ANIMATION_CONFIG.HOVER.ICON_BG.NORMAL,
				duration: ANIMATION_CONFIG.HOVER.DURATION,
				ease: ANIMATION_CONFIG.HOVER.EASE,
			});

			gsap.to(labelRef.current, {
				color: ANIMATION_CONFIG.HOVER.TEXT.LABEL.NORMAL,
				duration: ANIMATION_CONFIG.HOVER.DURATION,
				ease: ANIMATION_CONFIG.HOVER.EASE,
			});

			gsap.to(valueRef.current, {
				color: ANIMATION_CONFIG.HOVER.TEXT.VALUE.NORMAL,
				duration: ANIMATION_CONFIG.HOVER.DURATION,
				ease: ANIMATION_CONFIG.HOVER.EASE,
			});
		};

		link.addEventListener("mouseenter", handleMouseEnter);
		link.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			link.removeEventListener("mouseenter", handleMouseEnter);
			link.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, []);

	return (
		<Link
			ref={linkRef}
			href={link}
			className="group flex items-center gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 transform-gpu"
		>
			<div
				ref={iconBgRef}
				className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary"
			>
				{icon}
			</div>
			<div>
				<div ref={labelRef} className="text-sm text-gray-400">
					{label}
				</div>
				<div ref={valueRef} className="text-gray-200">
					{value}
				</div>
			</div>
		</Link>
	);
};

export default InfoItem;
