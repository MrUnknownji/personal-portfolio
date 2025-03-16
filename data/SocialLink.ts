import { SocialLink } from "@/types/social";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import React from "react";

export const socialLinks: SocialLink[] = [
	{
		icon: React.createElement(FiGithub, { className: "w-6 h-6" }),
		href: "https://github.com/MrUnknownji",
		label: "GitHub",
		bgColor: "rgba(45, 186, 78, 0)",
		hoverBgColor: "rgba(45, 186, 78, 0.1)",
		iconColor: "rgb(209, 213, 219)",
		hoverIconColor: "rgb(45, 186, 78)",
		color: "#2ecc71",
		description: "Check out my open source projects and contributions",
		stats: [
			{ label: "Repositories", value: "20+" },
			{ label: "Followers", value: "100+" },
			{ label: "Following", value: "50+" },
		],
		username: "MrUnknownji",
		profileImage: "https://placehold.co/600x600?text=Sandeep+Kumar",
	},
	{
		icon: React.createElement(FiLinkedin, { className: "w-6 h-6" }),
		href: "https://linkedin.com/in/sandeep-kumar-sk1707",
		label: "LinkedIn",
		bgColor: "rgba(0, 119, 181, 0)",
		hoverBgColor: "rgba(0, 119, 181, 0.1)",
		iconColor: "rgb(209, 213, 219)",
		hoverIconColor: "rgb(0, 119, 181)",
		color: "#3498db",
		description: "Connect with me professionally",
		stats: [
			{ label: "Connections", value: "500+" },
			{ label: "Endorsements", value: "50+" },
			{ label: "Posts", value: "25+" },
		],
		username: "sandeep-kumar-sk1707",
		profileImage: "https://placehold.co/600x600?text=Sandeep+Kumar",
	},
	{
		icon: React.createElement(FiTwitter, { className: "w-6 h-6" }),
		href: "https://twitter.com/MrUnknownG786",
		label: "Twitter",
		bgColor: "rgba(29, 161, 242, 0)",
		hoverBgColor: "rgba(29, 161, 242, 0.1)",
		iconColor: "rgb(209, 213, 219)",
		hoverIconColor: "rgb(29, 161, 242)",
		color: "#00acee",
		description: "Follow me for tech insights and updates",
		stats: [
			{ label: "Followers", value: "250+" },
			{ label: "Following", value: "300+" },
			{ label: "Tweets", value: "500+" },
		],
		username: "@MrUnknownG786",
		profileImage: "https://placehold.co/600x600?text=Sandeep+Kumar",
	},
];
