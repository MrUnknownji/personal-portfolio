import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	FiMail,
	FiPhone,
	FiMapPin,
	FiGithub,
	FiLinkedin,
	FiTwitter,
} from "react-icons/fi";
import InfoItem from "./InfoItem";

const CONTACT_INFO = [
	{
		icon: <FiMail className="w-5 h-5" />,
		label: "Email",
		value: "sandeepkhati788@gmail.com",
		link: "mailto:sandeepkhati788@gmail.com",
	},
	{
		icon: <FiPhone className="w-5 h-5" />,
		label: "Phone",
		value: "+91 1234567890",
		link: "tel:+911234567890",
	},
	{
		icon: <FiMapPin className="w-5 h-5" />,
		label: "Location",
		value: "Punjab, India",
		link: "https://maps.google.com",
	},
] as const;

const SOCIAL_LINKS = [
	{
		icon: <FiGithub className="w-6 h-6" />,
		label: "GitHub",
		link: "https://github.com/MrUnknownji",
	},
	{
		icon: <FiLinkedin className="w-6 h-6" />,
		label: "LinkedIn",
		link: "https://linkedin.com/in/sandeep-kumar-sk1707",
	},
	{
		icon: <FiTwitter className="w-6 h-6" />,
		label: "Twitter",
		link: "https://twitter.com/MrUnknownG786",
	},
] as const;

const ANIMATION_CONFIG = {
	CONTAINER: {
		DURATION: 0.8,
		EASE: "power3.out",
		Y_OFFSET: 30,
		OPACITY: 0,
	},
	ITEMS: {
		DURATION: 0.6,
		STAGGER: 0.1,
		Y_OFFSET: 20,
		OPACITY: 0,
		EASE: "power2.out",
	},
	SOCIAL: {
		DURATION: 0.5,
		STAGGER: 0.1,
		SCALE: 0.8,
		OPACITY: 0,
		EASE: "back.out(1.7)",
	},
	HOVER: {
		DURATION: 0.3,
		SCALE: 1.1,
		Y_OFFSET: -2,
		EASE: "power2.out",
		COLOR: {
			NORMAL: "rgb(156, 163, 175)",
			HOVER: "rgb(79, 209, 197)",
		},
		BG: {
			NORMAL: "rgba(31, 41, 55, 0.5)",
			HOVER: "rgba(31, 41, 55, 0.7)",
		},
	},
	SCROLL_TRIGGER: {
		START: "top 80%",
		END: "bottom 20%",
		TOGGLE_ACTIONS: "play none none reverse",
	},
	FLOATING: {
		DURATION: 2,
		Y_OFFSET: 5,
		EASE: "sine.inOut",
	},
} as const;

const ContactInfo = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const itemsRef = useRef<HTMLDivElement[]>([]);
	const socialRef = useRef<HTMLDivElement>(null);
	const socialTitleRef = useRef<HTMLHeadingElement>(null);
	const socialItemsRef = useRef<HTMLAnchorElement[]>([]);

	useGSAP(() => {
		if (
			!containerRef.current ||
			!socialRef.current ||
			!contentRef.current ||
			!titleRef.current ||
			!socialTitleRef.current
		)
			return;

		// Set initial states
		gsap.set(titleRef.current, {
			opacity: ANIMATION_CONFIG.CONTAINER.OPACITY,
			y: ANIMATION_CONFIG.CONTAINER.Y_OFFSET,
		});

		gsap.set(itemsRef.current, {
			y: ANIMATION_CONFIG.ITEMS.Y_OFFSET,
			opacity: ANIMATION_CONFIG.ITEMS.OPACITY,
		});

		gsap.set(socialTitleRef.current, {
			opacity: ANIMATION_CONFIG.ITEMS.OPACITY,
			y: ANIMATION_CONFIG.ITEMS.Y_OFFSET,
		});

		gsap.set(socialItemsRef.current, {
			scale: ANIMATION_CONFIG.SOCIAL.SCALE,
			opacity: ANIMATION_CONFIG.SOCIAL.OPACITY,
		});

		// Create the main timeline with ScrollTrigger
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: containerRef.current,
				start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
				end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
				toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
				markers: false,
			},
		});

		// Animate title
		tl.to(titleRef.current, {
			opacity: 1,
			y: 0,
			duration: ANIMATION_CONFIG.CONTAINER.DURATION,
			ease: ANIMATION_CONFIG.CONTAINER.EASE,
		});

		// Animate contact info items with stagger
		tl.to(
			itemsRef.current,
			{
				y: 0,
				opacity: 1,
				duration: ANIMATION_CONFIG.ITEMS.DURATION,
				stagger: ANIMATION_CONFIG.ITEMS.STAGGER,
				ease: ANIMATION_CONFIG.ITEMS.EASE,
				clearProps: "transform",
			},
			"-=0.4"
		);

		// Animate social section title
		tl.to(
			socialTitleRef.current,
			{
				opacity: 1,
				y: 0,
				duration: ANIMATION_CONFIG.ITEMS.DURATION,
				ease: ANIMATION_CONFIG.ITEMS.EASE,
			},
			"-=0.3"
		);

		// Animate social icons with stagger
		tl.to(
			socialItemsRef.current,
			{
				scale: 1,
				opacity: 1,
				duration: ANIMATION_CONFIG.SOCIAL.DURATION,
				stagger: ANIMATION_CONFIG.SOCIAL.STAGGER,
				ease: ANIMATION_CONFIG.SOCIAL.EASE,
				clearProps: "transform",
			},
			"-=0.2"
		);

		// Add subtle floating animation to contact info items
		tl.to(
			itemsRef.current,
			{
				y: (i) => Math.sin(i * Math.PI) * ANIMATION_CONFIG.FLOATING.Y_OFFSET,
				duration: ANIMATION_CONFIG.FLOATING.DURATION,
				ease: ANIMATION_CONFIG.FLOATING.EASE,
				repeat: -1,
				yoyo: true,
				stagger: 0.2,
			},
			"-=0.5"
		);

		// Set up hover animations for social links
		socialItemsRef.current.forEach((item) => {
			item.addEventListener("mouseenter", () => {
				gsap.to(item, {
					scale: ANIMATION_CONFIG.HOVER.SCALE,
					y: ANIMATION_CONFIG.HOVER.Y_OFFSET,
					color: ANIMATION_CONFIG.HOVER.COLOR.HOVER,
					backgroundColor: ANIMATION_CONFIG.HOVER.BG.HOVER,
					duration: ANIMATION_CONFIG.HOVER.DURATION,
					ease: ANIMATION_CONFIG.HOVER.EASE,
					force3D: true,
				});
			});

			item.addEventListener("mouseleave", () => {
				gsap.to(item, {
					scale: 1,
					y: 0,
					color: ANIMATION_CONFIG.HOVER.COLOR.NORMAL,
					backgroundColor: ANIMATION_CONFIG.HOVER.BG.NORMAL,
					duration: ANIMATION_CONFIG.HOVER.DURATION,
					ease: ANIMATION_CONFIG.HOVER.EASE,
					force3D: true,
				});
			});
		});

		return () => {
			// Clean up event listeners and ScrollTrigger instances
			socialItemsRef.current.forEach((item) => {
				item.removeEventListener("mouseenter", () => {});
				item.removeEventListener("mouseleave", () => {});
			});

			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	}, []);

	return (
		<div ref={containerRef} className="w-full relative">
			<div ref={contentRef} className="space-y-8">
				<div>
					<h3
						ref={titleRef}
						className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6"
					>
						Contact Information
					</h3>
					<div className="space-y-6">
						{CONTACT_INFO.map((info, index) => (
							<div
								key={info.label}
								ref={(el) => {
									if (el) itemsRef.current[index] = el;
								}}
								className="transform-gpu"
							>
								<InfoItem {...info} />
							</div>
						))}
					</div>
				</div>

				<div ref={socialRef}>
					<h4
						ref={socialTitleRef}
						className="text-lg font-semibold text-gray-200 mb-4"
					>
						Connect With Me
					</h4>
					<div className="flex gap-4">
						{SOCIAL_LINKS.map((social, index) => (
							<a
								key={social.label}
								ref={(el) => {
									if (el) socialItemsRef.current[index] = el;
								}}
								href={social.link}
								target="_blank"
								rel="noopener noreferrer"
								className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 transform-gpu"
								aria-label={social.label}
								style={{
									willChange: "transform, opacity, background-color, color",
								}}
							>
								{social.icon}
							</a>
						))}
					</div>
				</div>

				<div className="absolute -left-4 -bottom-4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
				<div className="absolute -right-4 -top-4 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
			</div>
		</div>
	);
};

export default ContactInfo;
