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
      className="group/infoitem relative flex items-center gap-5 p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 shadow-md
                 transition-all duration-500 ease-out overflow-hidden
                 hover:bg-[#111] hover:border-primary/40 hover:shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.3)] hover:-translate-y-1"
    >
      {/* Inner Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover/infoitem:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Shimmer Sweep Effect */}
      <div
        className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover/infoitem:animate-[shimmer_2s_infinite]
                   bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
        style={{ width: "200%" }}
      />

      <div
        className="relative z-10 flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-black/20 text-primary border border-white/5
                   transition-all duration-300 ease-out
                   group-hover/infoitem:scale-110 group-hover/infoitem:bg-primary group-hover/infoitem:text-black"
      >
        {icon}
      </div>

      <div className="relative z-10">
        <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1 transition-colors duration-300 group-hover/infoitem:text-primary/80">
          {label}
        </div>
        <div className="text-white font-medium text-lg tracking-tight transition-colors duration-300 group-hover/infoitem:text-white">
          {value}
        </div>
      </div>
    </Link>
  );
};

export default InfoItem;
