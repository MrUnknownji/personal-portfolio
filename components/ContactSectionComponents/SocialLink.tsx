import React from "react";

interface SocialLinkProps {
  icon: React.ReactNode;
  label: string;
  link: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, label, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="social-icon-link group w-12 h-12 flex items-center justify-center rounded-lg bg-neutral/30 text-muted
                 border border-transparent
                 transition-all duration-300 ease-out transform-gpu
                 hover:bg-neutral/50 hover:text-primary hover:border-primary/30"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

export default SocialLink;
