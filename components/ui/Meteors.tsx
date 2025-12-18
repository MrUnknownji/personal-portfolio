"use client";
import { cn } from "@/lib/utils";
import React, { useMemo, useState, useEffect } from "react";

// Seeded random number generator for consistent values between SSR and client
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export const Meteors = ({
    number = 20,
    className,
}: {
    number?: number;
    className?: string;
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate deterministic meteor data based on index (seed)
    const meteorData = useMemo(() => {
        return Array.from({ length: number }, (_, idx) => {
            const positionPercent = (idx / number) * 120 - 10;
            const delay = seededRandom(idx * 100) * 8;
            const duration = 4 + seededRandom(idx * 200) * 4;
            return { positionPercent, delay, duration };
        });
    }, [number]);

    if (!mounted) {
        return null; // Don't render anything on server to avoid hydration mismatch
    }

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {meteorData.map((meteor, idx) => (
                <span
                    key={"meteor" + idx}
                    className={cn(
                        "absolute h-0.5 w-0.5 rounded-full bg-primary shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
                        "before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-primary before:to-transparent",
                    )}
                    style={{
                        top: "-40px",
                        left: `${meteor.positionPercent}%`,
                        animation: `meteor ${meteor.duration}s linear ${meteor.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
};
