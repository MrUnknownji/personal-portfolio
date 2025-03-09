import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface SkillCardProps {
  icon: string;
  text: string;
}

const SkillCard = ({ icon, text }: SkillCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current || !iconRef.current) return;

    const ctx = gsap.context(() => {
      const hoverTl = gsap.timeline({ paused: true });
      hoverTl
        .to(iconRef.current, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
          force3D: true
        })
        .to(cardRef.current!.querySelector('.card-gradient')!, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        }, 0);

      const handleMouseEnter = () => hoverTl.play();
      const handleMouseLeave = () => hoverTl.reverse();

      cardRef.current?.addEventListener("mouseenter", handleMouseEnter);
      cardRef.current?.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        cardRef.current?.removeEventListener("mouseenter", handleMouseEnter);
        cardRef.current?.removeEventListener("mouseleave", handleMouseLeave);
        hoverTl.kill();
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-white/5 rounded-xl p-4 cursor-pointer transform-gpu"
      style={{ willChange: "transform" }}
    >
      <div className="card-gradient absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-xl opacity-0" />
      <div className="relative flex items-center gap-3">
        <div
          ref={iconRef}
          className="text-2xl transform-gpu"
          style={{ willChange: "transform" }}
        >
          {icon}
        </div>
        <div className="text-gray-200 text-sm font-medium">
          {text}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
