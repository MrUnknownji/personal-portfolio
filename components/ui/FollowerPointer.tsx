"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

export const FollowerPointerCard = ({
    children,
    className,
    title,
}: {
    children: React.ReactNode;
    className?: string;
    title?: string | React.ReactNode;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const pointerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const isInsideRef = useRef(false);
    const mousePos = useRef({ x: 0, y: 0 });
    const pointerPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const container = ref.current;
        const pointer = pointerRef.current;
        const label = labelRef.current;
        if (!container || !pointer) return;

        const lerp = 0.15;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mousePos.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleMouseEnter = () => {
            isInsideRef.current = true;
            gsap.to(pointer, { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" });
            if (label) {
                gsap.to(label, { scale: 1, opacity: 1, duration: 0.25, delay: 0.05, ease: "power2.out" });
            }
        };

        const handleMouseLeave = () => {
            isInsideRef.current = false;
            gsap.to(pointer, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.in" });
            if (label) {
                gsap.to(label, { scale: 0.5, opacity: 0, duration: 0.15, ease: "power2.in" });
            }
        };

        const updatePointer = () => {
            if (isInsideRef.current) {
                pointerPos.current.x += (mousePos.current.x - pointerPos.current.x) * lerp;
                pointerPos.current.y += (mousePos.current.y - pointerPos.current.y) * lerp;
                gsap.set(pointer, { x: pointerPos.current.x, y: pointerPos.current.y });
            }
        };

        gsap.set(pointer, { scale: 0, opacity: 0, xPercent: -50, yPercent: -50 });
        if (label) gsap.set(label, { scale: 0.5, opacity: 0 });

        gsap.ticker.add(updatePointer);
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            gsap.ticker.remove(updatePointer);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={ref}
            style={{ cursor: "none" }}
            className={cn("relative", className)}
        >
            <div
                ref={pointerRef}
                className="absolute z-50 pointer-events-none"
                style={{ top: 0, left: 0, opacity: 0 }}
            >
                <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="1"
                    viewBox="0 0 16 16"
                    className="h-6 w-6 -translate-x-[12px] -translate-y-[10px] -rotate-[70deg] transform stroke-primary text-primary"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
                </svg>

                <div
                    ref={labelRef}
                    className="min-w-max rounded-full bg-primary px-3 py-1.5 text-xs font-medium whitespace-nowrap text-dark shadow-lg"
                >
                    {title || "View"}
                </div>
            </div>
            {children}
        </div>
    );
};

export default FollowerPointerCard;
