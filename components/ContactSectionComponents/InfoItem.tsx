import React from "react";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  link: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, link }) => {
  const isDirectContact = label === "Email" || label === "Phone";

  return (
    <a
      href={link}
      target={isDirectContact ? "_self" : "_blank"}
      rel={isDirectContact ? undefined : "noopener noreferrer"}
      className="group/infoitem relative flex items-center gap-5 p-5 rounded-2xl bg-[#0a0a0a] border border-white/10
                 transition-[transform,border-color,background-color] duration-150 ease-out overflow-hidden
                 hover:bg-[#111] hover:border-primary/50 hover:-translate-y-0.5"
    >
      {/* Inner Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover/infoitem:opacity-100 transition-opacity duration-150 pointer-events-none" />

      {/* Shimmer Sweep Effect */}
      <div
        className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover/infoitem:animate-[shimmer_650ms_ease-out_1]
                   bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
        style={{ width: "200%" }}
      />

      <div
        className="relative z-10 flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-black/20 text-primary border border-white/5
                   transition-[transform,background-color,color] duration-150 ease-out
                   group-hover/infoitem:scale-105 group-hover/infoitem:bg-primary group-hover/infoitem:text-black"
      >
        {icon}
      </div>

      <div className="relative z-10">
        <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1 transition-colors duration-150 group-hover/infoitem:text-primary/80">
          {label}
        </div>
        <div className="text-white font-medium text-lg tracking-tight">
          {value}
        </div>
      </div>
    </a>
  );
};

export default InfoItem;
