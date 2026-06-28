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
                 transition-[transform,border-color] duration-150 ease-out overflow-hidden
                 hover:border-primary/50 hover:-translate-y-0.5 transform-gpu"
    >
      <div className="absolute z-[1] inset-y-4 left-0 w-0.5 origin-center scale-y-0 bg-primary/80 transition-transform duration-150 group-hover/infoitem:scale-y-100 pointer-events-none transform-gpu" />

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
