import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type EyeState = 'open' | 'closed' | 'happy' | 'angry' | 'surprised' | 'thinking' | 'error' | 'dizzy' | 'confused' | 'sad';

interface UseBotEyesProps {
    eyeContextRef: React.MutableRefObject<CanvasRenderingContext2D | null>;
    eyeCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    eyeTextureRef: React.MutableRefObject<THREE.CanvasTexture | null>;
    eyeState: EyeState;
    clockRef: React.MutableRefObject<THREE.Clock>;
}

export const useBotEyes = ({
    eyeContextRef,
    eyeCanvasRef,
    eyeTextureRef,
    eyeState,
    clockRef,
}: UseBotEyesProps) => {
    const eyeStateRef = useRef(eyeState);

    useEffect(() => {
        eyeStateRef.current = eyeState;
    }, [eyeState]);

    useEffect(() => {
        const ctx = eyeContextRef.current;
        const canvas = eyeCanvasRef.current;
        const texture = eyeTextureRef.current;
        if (!ctx || !canvas || !texture) return;

        let animationFrameId: number;

        const draw = () => {
            const time = clockRef.current.getElapsedTime();

            if (eyeState === 'thinking') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const neonColor = '#ff9233';
                ctx.fillStyle = neonColor;
                ctx.shadowColor = neonColor;
                ctx.shadowBlur = 20;

                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const spacing = 50;
                const radius = 12;

                for (let i = -1; i <= 1; i++) {
                    const yOffset = Math.sin(time * 8 + i) * 15;
                    const x = centerX + (i * spacing);
                    const y = centerY + yOffset;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                texture.needsUpdate = true;
                animationFrameId = requestAnimationFrame(draw);
            } else if (eyeState === 'dizzy') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const neonColor = '#ff9233';
                ctx.strokeStyle = neonColor;
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.shadowColor = neonColor;
                ctx.shadowBlur = 20;

                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const spacing = 40;

                // Spiral eyes
                const drawSpiral = (x: number, y: number, offset: number) => {
                    ctx.beginPath();
                    for (let i = 0; i < 30; i++) {
                        const angle = 0.5 * i + time * 5 + offset;
                        const radius = 1 * i;
                        const px = x + radius * Math.cos(angle);
                        const py = y + radius * Math.sin(angle);
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.stroke();
                };

                drawSpiral(centerX - spacing, centerY, 0);
                drawSpiral(centerX + spacing, centerY, Math.PI);

                texture.needsUpdate = true;
                animationFrameId = requestAnimationFrame(draw);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const neonColor = '#ff8c00';
                ctx.strokeStyle = neonColor;
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.shadowColor = neonColor;
                ctx.shadowBlur = 20;

                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const spacing = 40;


                if (eyeState === 'open') {
                    const ringRadius = 20;
                    ctx.beginPath(); ctx.arc(centerX - spacing, centerY, ringRadius, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(centerX + spacing, centerY, ringRadius, 0, Math.PI * 2); ctx.stroke();
                } else if (eyeState === 'closed') {
                    const w = 50;
                    ctx.beginPath(); ctx.moveTo(centerX - spacing - w / 2, centerY); ctx.lineTo(centerX - spacing + w / 2, centerY); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(centerX + spacing - w / 2, centerY); ctx.lineTo(centerX + spacing + w / 2, centerY); ctx.stroke();
                } else if (eyeState === 'happy') {
                    ctx.beginPath(); ctx.arc(centerX - spacing, centerY + 5, 20, Math.PI, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(centerX + spacing, centerY + 5, 20, Math.PI, Math.PI * 2); ctx.stroke();
                } else if (eyeState === 'sad') {
                    ctx.beginPath(); ctx.moveTo(centerX - spacing - 20, centerY + 5); ctx.lineTo(centerX - spacing + 15, centerY - 10); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(centerX + spacing + 20, centerY + 5); ctx.lineTo(centerX + spacing - 15, centerY - 10); ctx.stroke();
                } else if (eyeState === 'angry') {
                    ctx.beginPath(); ctx.moveTo(centerX - spacing - 20, centerY - 20); ctx.lineTo(centerX - spacing + 20, centerY + 10); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(centerX + spacing + 20, centerY - 20); ctx.lineTo(centerX + spacing - 20, centerY + 10); ctx.stroke();
                } else if (eyeState === 'surprised') {
                    const r = 25;
                    ctx.beginPath(); ctx.arc(centerX - spacing, centerY, r, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(centerX + spacing, centerY, r, 0, Math.PI * 2); ctx.stroke();
                    // Surprised look
                    ctx.beginPath(); ctx.arc(centerX - spacing, centerY, 5, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(centerX + spacing, centerY, 5, 0, Math.PI * 2); ctx.fill();
                } else if (eyeState === 'error') {
                    const s = 15;
                    ctx.beginPath(); ctx.moveTo(centerX - spacing - s, centerY - s); ctx.lineTo(centerX - spacing + s, centerY + s); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(centerX - spacing + s, centerY - s); ctx.lineTo(centerX - spacing - s, centerY + s); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(centerX + spacing - s, centerY - s); ctx.lineTo(centerX + spacing + s, centerY + s); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(centerX + spacing + s, centerY - s); ctx.lineTo(centerX + spacing - s, centerY + s); ctx.stroke();
                } else if (eyeState === 'confused') {
                    // One big, one small
                    const r1 = 25;
                    const r2 = 10;
                    ctx.beginPath(); ctx.arc(centerX - spacing, centerY, r1, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(centerX + spacing, centerY, r2, 0, Math.PI * 2); ctx.stroke();
                }
                texture.needsUpdate = true;
            }
        };

        draw();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [eyeState]);

    return { eyeStateRef };
};
