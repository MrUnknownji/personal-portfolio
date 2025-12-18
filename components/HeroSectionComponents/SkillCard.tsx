"use client";

interface SkillCardProps {
  icon: React.ReactNode;
  text: string;
}

const SkillCard = ({ icon, text }: SkillCardProps) => {
  return (
    <div
      className="relative group bg-white/[0.05] rounded-lg p-3 h-14 flex items-center
                 border border-white/[0.08] w-full sm:w-auto overflow-hidden
                 transition-all duration-300 ease-out
                 hover:bg-white/[0.08] hover:border-primary/20"
    >
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/5 text-neutral-400
                        group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
          {icon}
        </div>
        <div className="text-neutral-300 text-sm font-medium tracking-wide group-hover:text-white transition-colors duration-300">
          {text}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
