"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const GlobalCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorLabelRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        setIsDesktop(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    }, []);

    useEffect(() => {
        if (!isDesktop || !cursorRef.current) return;

        const cursor = cursorRef.current;
        const cursorLabel = cursorLabelRef.current;

        gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

        const handleMouseMove = (e: MouseEvent) => {
            gsap.set(cursor, { x: e.clientX, y: e.clientY });

            const target = e.target as HTMLElement;
            const cursorText = target.getAttribute("data-cursor-text") ||
                target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text");

            if (cursorText && cursorLabel) {
                cursorLabel.innerText = cursorText;
                gsap.to(cursorLabel, { opacity: 1, scale: 1, duration: 0.2, overwrite: true });
            } else if (cursorLabel) {
                gsap.to(cursorLabel, { opacity: 0, scale: 0.5, duration: 0.2, overwrite: true });
            }
        };

        const handleMouseEnter = () => {
            gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
        };

        const handleMouseLeave = () => {
            gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3 });
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseenter", handleMouseEnter);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        if (document.hasFocus()) handleMouseEnter();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [isDesktop]);

    if (!isDesktop) return null;

    return (
        <div
            ref={cursorRef}
            className="fixed top-3 left-1.5 z-[99999] pointer-events-none will-change-transform"
            style={{ opacity: 0 }}
        >
            <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="1"
                viewBox="0 0 16 16"
                className="h-6 w-6 -rotate-[70deg] transform text-primary"
                style={{ filter: "drop-shadow(0 0 1px #000) drop-shadow(0 0 2px #000)" }}
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
            </svg>

            <div
                ref={cursorLabelRef}
                className="absolute left-6 top-6 min-w-max rounded-full bg-primary px-3 py-1.5 text-xs font-medium whitespace-nowrap text-dark shadow-lg opacity-0 scale-50 origin-top-left"
            >
                View
            </div>
        </div>
    );
};

export default GlobalCursor;
