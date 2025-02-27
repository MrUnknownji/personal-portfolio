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
      className="group flex items-center gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 transition-all duration-300 hover:bg-gray-800/70 hover:border-primary/30 transform-gpu hover:translate-x-1"
    >
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {label}
        </div>
        <div className="text-gray-200 group-hover:text-white transition-colors duration-300">
          {value}
        </div>
      </div>
    </Link>
  );
};

export default InfoItem;
