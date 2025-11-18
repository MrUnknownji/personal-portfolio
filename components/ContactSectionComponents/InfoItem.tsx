import React from "react";
import Link from "next/link";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  link: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, link }) => {
  return (
    <Link
      href={link}
      target={label === "Email" || label === "Phone" ? "_self" : "_blank"}
      rel={
        label === "Email" || label === "Phone"
          ? undefined
          : "noopener noreferrer"
      }
      className="group/infoitem flex items-center gap-4 p-4 rounded-lg bg-frosted-dark
                       transform-gpu transition-all duration-300 ease-out
                       hover:bg-neutral/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]"
    >
      <div
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary
                                   transition-colors duration-300 ease-out
                                   group-hover/infoitem:bg-primary/20"
      >
        {icon}
      </div>

      <div>
        <div
          className="text-sm text-muted transition-colors duration-300 ease-out
                                       group-hover/infoitem:text-light"
        >
          {label}
        </div>
        <div
          className="text-light font-medium transition-colors duration-300 ease-out
                                       group-hover/infoitem:text-white"
        >
          {value}
        </div>
      </div>
    </Link>
  );
};

export default InfoItem;
