import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SkillCardProps {
  icon: string;
  text: string;
}

const SkillCard = ({ icon, text }: SkillCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });

      const hoverTl = gsap.timeline({ paused: true });
      hoverTl.to(iconRef.current, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      });

      cardRef.current?.addEventListener("mouseenter", () => hoverTl.play());
      cardRef.current?.addEventListener("mouseleave", () => hoverTl.reverse());
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4
        cursor-pointer group"
    >
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute inset-[-2px] rounded-xl border-[2px] border-transparent
          before:absolute before:inset-0 before:rounded-xl before:border-[2px]
          before:border-primary before:animate-border-rotate
          after:absolute after:inset-0 after:rounded-xl after:border-[2px]
          after:border-primary after:animate-border-rotate-reverse"
        />
      </div>

      <div className="flex items-center gap-3">
        <div
          ref={iconRef}
          className="text-2xl transition-transform duration-300"
        >
          {icon}
        </div>
        <div className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors duration-300">
          {text}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
