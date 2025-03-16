export interface Project {
	id: number;
	title: string;
	shortDescription: string;
	longDescription: string;
	image: string;
	technologies: string[];
	features: string[];
	demoLink?: string;
	githubLink?: string;
	category: string;
}

export interface Skill {
	name: string;
	icon: string;
	proficiency: number;
	category: SkillCategory;
}

export type SkillCategory = "frontend" | "backend" | "tools" | "other";

export interface Section {
	id: string;
	title: string;
	subtitle?: string;
	content: string;
}

export interface AnimationConfig {
	duration?: number;
	ease?: string;
	delay?: number;
	stagger?: number;
}

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export interface ButtonProps {
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
}

export interface ContactForm {
	name: string;
	email: string;
	message: string;
}

export interface SocialLink {
	platform: string;
	url: string;
	icon: string;
}

export interface NavItem {
	label: string;
	href: string;
	isExternal?: boolean;
}
