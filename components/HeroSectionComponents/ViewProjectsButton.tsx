import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ViewProjectsButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sweepRef.current || !buttonRef.current) return;

    gsap.set(sweepRef.current, {
      rotate: -45,
      x: "100%",
      y: "-100%",
      opacity: 0,
    });

    const tl = gsap.timeline({ paused: true });

    tl.to(sweepRef.current, {
      x: "-100%",
      y: "100%",
      opacity: 1,
      duration: 1,
      ease: "power2.inOut",
    });

    const handleEnter = () => {
      gsap.set(sweepRef.current, { x: "100%", y: "-100%", opacity: 0 });
      tl.play(0);
    };

    const handleLeave = () => {
      gsap.set(sweepRef.current, { x: "-100%", y: "100%", opacity: 1 });
      gsap.to(sweepRef.current, {
        x: "100%",
        y: "-100%",
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    };

    const currentButtonRef = buttonRef.current;

    currentButtonRef.addEventListener("mouseenter", handleEnter);
    currentButtonRef.addEventListener("mouseleave", handleLeave);

    return () => {
      currentButtonRef.removeEventListener("mouseenter", handleEnter);
      currentButtonRef.removeEventListener("mouseleave", handleLeave);
      tl.kill();
      gsap.killTweensOf(sweepRef.current);
    };
  }, []);

  return (
    <Link href="/my-projects">
      <div
        ref={buttonRef}
        className="relative overflow-hidden group px-8 py-3 rounded-xl
          bg-primary/15 border border-white/20 cursor-pointer"
      >
        <div
          ref={sweepRef}
          className="absolute inset-0 w-[200%] h-[200%] top-[-50%] left-[-50%]"
          style={{
            background:
              "linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-70" />

        <div className="relative flex items-center justify-center">
          <span className="text-white font-medium z-10">View My Projects</span>
        </div>

        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ViewProjectsButton;
