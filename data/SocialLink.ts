import { SocialLink } from "@/types/social";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

export const socialLinks: SocialLink[] = [
  {
    Icon: FiGithub,
    href: "https://github.com",
    label: "GitHub",
    color: "#2ecc71",
    username: "@yourusername",
    profileImage: "https://placehold.co/600x400?text=Sandeep+Kumar",
  },
  {
    Icon: FiLinkedin,
    href: "https://linkedin.com",
    label: "LinkedIn",
    color: "#3498db",
    username: "Your Name",
    profileImage: "https://placehold.co/600x400?text=Sandeep+Kumar",
  },
  {
    Icon: FiTwitter,
    href: "https://twitter.com",
    label: "Twitter",
    color: "#00acee",
    username: "@yourusername",
    profileImage: "https://placehold.co/600x400?text=Sandeep+Kumar",
  },
];
