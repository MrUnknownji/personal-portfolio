import Image from "next/image";
import { SocialLink } from "../../types/social";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SocialInfoBoxProps {
	socialLink: SocialLink;
	position: { x: number; y: number };
	opacity: number;
	onHeightChange: (height: number) => void;
}

const SocialInfoBox = ({
	socialLink,
	position,
	opacity,
	onHeightChange,
}: SocialInfoBoxProps) => {
	const boxRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		setMounted(true);

		setScrollY(window.scrollY);

		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			setMounted(false);
		};
	}, []);

	useEffect(() => {
		if (boxRef.current) {
			const height = boxRef.current.offsetHeight;
			onHeightChange(height);
		}
	}, [onHeightChange]);

	const offsetY = 20;

	const adjustedY = position.y - scrollY;

	const content = (
		<div
			ref={boxRef}
			className="fixed pointer-events-none z-50"
			style={{
				left: `${position.x}px`,
				top: `${adjustedY - offsetY}px`,
				opacity: opacity,
				transform: "translate(-50%, -100%)",
				transition: "opacity 0.15s ease-out",
				willChange: "opacity, transform",
			}}
		>
			<div
				className="w-72 p-4 rounded-xl bg-gray-800/95 backdrop-blur-sm
          border border-gray-700/50 shadow-xl"
				style={{
					willChange: "transform, opacity",
				}}
			>
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						{socialLink.profileImage ? (
							<Image
								src={socialLink.profileImage}
								alt={socialLink.label}
								width={48}
								height={48}
								className="rounded-lg object-cover"
							/>
						) : (
							<div
								className="p-2 rounded-lg bg-gray-700/50 w-12 h-12 flex items-center justify-center"
								style={{ color: socialLink.hoverIconColor }}
							>
								{socialLink.icon}
							</div>
						)}
						<div>
							<h3 className="font-semibold text-white">
								{socialLink.username}
							</h3>
							<p className="text-sm text-gray-400">{socialLink.label}</p>
						</div>
					</div>

					<p
						className="text-sm text-gray-300 border-l-2 pl-3 py-1"
						style={{
							borderColor: socialLink.color || socialLink.hoverIconColor,
						}}
					>
						{socialLink.description}
					</p>

					<div className="grid grid-cols-3 gap-2">
						{socialLink.stats.map((stat, index) => (
							<div
								key={index}
								className="text-center p-2 rounded-lg bg-gray-700/30"
							>
								<div className="text-sm font-medium text-white">
									{stat.value}
								</div>
								<div className="text-xs text-gray-400">{stat.label}</div>
							</div>
						))}
					</div>
				</div>

				<div
					className="absolute left-1/2 bottom-0 w-4 h-4 -mb-2 bg-gray-800/95 border-r border-b border-gray-700/50"
					style={{
						transform: "translateX(-50%) rotate(45deg)",
						bottom: "-8px",
					}}
				/>
			</div>
		</div>
	);

	return mounted && typeof document !== "undefined"
		? createPortal(content, document.body)
		: null;
};

export default SocialInfoBox;
