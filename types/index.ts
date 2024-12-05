// Project Types
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

// Skill Types
export interface Skill {
  name: string;
  icon: string;
  proficiency: number;
  category: SkillCategory;
}

export type SkillCategory = 'frontend' | 'backend' | 'tools' | 'other';

// Section Types
export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
}

// Animation Types
export interface AnimationConfig {
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
}

// Component Props Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Contact Form Types
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Social Media Types
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}
