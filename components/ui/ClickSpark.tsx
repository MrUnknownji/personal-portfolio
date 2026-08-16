"use client";

import { useCallback, useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  angle: number;
  startTime: number;
};

const SPARK_COLOR = "#ff9233";
const SPARK_COUNT = 8;
const SPARK_RADIUS = 35;
const SPARK_SIZE = 12;
const SPARK_DURATION = 500;

export default function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const drawRef = useRef<(timestamp: number) => void>(() => undefined);

  useEffect(() => {
    drawRef.current = (timestamp: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((spark) => {
        const progress = (timestamp - spark.startTime) / SPARK_DURATION;
        if (progress >= 1) return false;

        const eased = progress * (2 - progress);
        const distance = eased * SPARK_RADIUS;
        const lineLength = SPARK_SIZE * (1 - eased * 0.7);
        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);

        context.strokeStyle = SPARK_COLOR;
        context.globalAlpha = 1 - eased;
        context.lineWidth = 2;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(
          x1 + lineLength * Math.cos(spark.angle),
          y1 + lineLength * Math.sin(spark.angle),
        );
        context.stroke();
        return true;
      });
      context.globalAlpha = 1;

      if (sparksRef.current.length) {
        animationFrameRef.current = requestAnimationFrame(drawRef.current);
      } else {
        animationFrameRef.current = null;
        canvas.style.display = "none";
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let resizeFrame: number | null = null;

    const resizeCanvas = () => {
      resizeFrame = null;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const scheduleResize = () => {
      if (resizeFrame === null) resizeFrame = requestAnimationFrame(resizeCanvas);
    };

    resizeCanvas();
    window.addEventListener("resize", scheduleResize);
    return () => {
      window.removeEventListener("resize", scheduleResize);
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
    };
  }, []);

  const createSpark = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || event.button !== 0) return;

    const startTime = performance.now();
    const sparks = Array.from({ length: SPARK_COUNT }, (_, index) => ({
      x: event.clientX,
      y: event.clientY,
      angle: (Math.PI * 2 * index) / SPARK_COUNT + Math.random() * 0.24,
      startTime,
    }));

    sparksRef.current = [...sparksRef.current, ...sparks].slice(-64);
    canvas.dataset.sparkBursts = String(
      Number(canvas.dataset.sparkBursts || "0") + 1,
    );
    canvas.style.display = "block";
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(drawRef.current);
    }
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const canvas = canvasRef.current;
    if (canvas) canvas.dataset.sparkReady = "true";
    window.addEventListener("click", createSpark);
    return () => {
      window.removeEventListener("click", createSpark);
      if (canvas) delete canvas.dataset.sparkReady;
    };
  }, [createSpark]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99998]"
      style={{ display: "none", mixBlendMode: "screen" }}
    />
  );
}
