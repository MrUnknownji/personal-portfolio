import React, { useRef } from "react";

interface InfoItemProps {
  icon: "email" | "phone" | "location";
  text: string;
  link: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, text, link }) => {
  const itemRef = useRef<HTMLAnchorElement>(null);

  const renderIcon = () => {
    const commonClasses =
      "w-5 h-5 text-primary group-hover:text-accent [transition:color_0.3s]";

    switch (icon) {
      case "email":
        return (
          <svg
            className={commonClasses}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "phone":
        return (
          <svg
            className={commonClasses}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        );
      case "location":
        return (
          <svg
            className={commonClasses}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
    }
  };

  return (
    <a
      ref={itemRef}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="info-item group flex items-center p-3 rounded-lg
        bg-secondary/50 border border-primary/10
        hover:border-primary/30 [transition:border-color_0.3s]"
    >
      <div
        className="p-2 rounded-lg bg-primary/10 mr-4
        group-hover:bg-primary/20 [transition:background-color_0.3s]"
      >
        {renderIcon()}
      </div>
      <span
        className="text-gray-300 group-hover:text-gray-100
        [transition:color_0.3s]"
      >
        {text}
      </span>
      <svg
        className="w-4 h-4 ml-auto text-primary opacity-0 group-hover:opacity-100
          transform translate-x-2 group-hover:translate-x-0
          [transition:all_0.3s]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  );
};

export default InfoItem;
