"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface Spark {
    x: number;
    y: number;
    angle: number;
    startTime: number;
}

interface ClickSparkProps {
    children?: React.ReactNode;
}

const ClickSpark: React.FC<ClickSparkProps> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparksRef = useRef<Spark[]>([]);

    const sparkColor = "#00ff9f";
    const sparkSize = 12;
    const sparkRadius = 35;
    const sparkCount = 8;
    const duration = 500;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    const easeOut = useCallback((t: number) => t * (2 - t), []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const draw = (timestamp: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            sparksRef.current = sparksRef.current.filter((spark) => {
                const elapsed = timestamp - spark.startTime;
                if (elapsed >= duration) return false;

                const progress = elapsed / duration;
                const eased = easeOut(progress);
                const opacity = 1 - eased;

                const distance = eased * sparkRadius;
                const lineLength = sparkSize * (1 - eased * 0.7);

                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

                ctx.strokeStyle = sparkColor;
                ctx.globalAlpha = opacity;
                ctx.lineWidth = 2;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                return true;
            });

            ctx.globalAlpha = 1;
            animationId = requestAnimationFrame(draw);
        };

        animationId = requestAnimationFrame(draw);

        return () => cancelAnimationFrame(animationId);
    }, [easeOut]);

    const handleClick = useCallback((e: MouseEvent) => {
        const now = performance.now();
        const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
            x: e.clientX,
            y: e.clientY,
            angle: (2 * Math.PI * i) / sparkCount + Math.random() * 0.3,
            startTime: now,
        }));

        sparksRef.current.push(...newSparks);
    }, []);

    useEffect(() => {
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [handleClick]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 z-[99998] pointer-events-none"
                style={{ mixBlendMode: "screen" }}
            />
            {children}
        </>
    );
};

export default ClickSpark;
