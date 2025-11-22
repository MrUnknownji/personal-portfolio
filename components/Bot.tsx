'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { chatWithBot } from '@/app/actions/chat';
import { IoSend } from "react-icons/io5";

export default function Bot() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    const [bubbleText, setBubbleText] = useState<string | null>(null);
    const [eyeState, setEyeState] = useState<'open' | 'closed' | 'happy' | 'angry' | 'surprised' | 'thinking' | 'error'>('open');

    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const headPivotRef = useRef<THREE.Group | null>(null);
    const eyeTextureRef = useRef<THREE.CanvasTexture | null>(null);
    const eyeContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const eyeCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestRef = useRef<number | null>(null);
    const mouseRef = useRef(new THREE.Vector2());
    const targetRotationRef = useRef(new THREE.Vector2());
    const isRightClickingRef = useRef(false);
    const nextBlinkTimeRef = useRef(2);
    const clockRef = useRef(new THREE.Clock());
    const robotRef = useRef<THREE.Group | null>(null);
    const isHoveredRef = useRef(false);
    const isProcessingRef = useRef(false);
    const isCooldownRef = useRef(false);
    const inputRef = useRef(input);

    useEffect(() => {
        inputRef.current = input;
    }, [input]);

    useEffect(() => {
        isProcessingRef.current = isProcessing;
    }, [isProcessing]);


    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.set(0, 2.2, 9.5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(450, 450);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;

        const container = containerRef.current;
        if (container) {
            container.appendChild(renderer.domElement);
        }
        rendererRef.current = renderer;

        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7);
        mainLight.castShadow = true;
        scene.add(mainLight);
        const rimLight = new THREE.DirectionalLight(0x00ff99, 3.0);
        rimLight.position.set(-5, 5, -8);
        scene.add(rimLight);

        const eyeCanvas = document.createElement('canvas');
        eyeCanvas.width = 512;
        eyeCanvas.height = 256;
        const ctx = eyeCanvas.getContext('2d');
        if (ctx) eyeContextRef.current = ctx;
        eyeCanvasRef.current = eyeCanvas;

        const eyeTexture = new THREE.CanvasTexture(eyeCanvas);
        eyeTexture.colorSpace = THREE.SRGBColorSpace;
        eyeTexture.offset.x = 0.25;
        eyeTextureRef.current = eyeTexture;

        const matBody = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.5 });
        const matAccent = new THREE.MeshStandardMaterial({ color: 0x00ff99, emissive: 0x00ff99, emissiveIntensity: 0.8, roughness: 0.2 });
        const matScreen = new THREE.MeshStandardMaterial({
            color: 0x000000, roughness: 0.1, map: eyeTexture,
            emissive: 0xffffff, emissiveMap: eyeTexture, emissiveIntensity: 1.5
        });

        const robot = new THREE.Group();
        robotRef.current = robot;
        scene.add(robot);

        // Set initial scale
        robot.scale.set(0.5, 0.5, 0.5);

        const body = new THREE.Mesh(new THREE.SphereGeometry(1.6, 48, 48), matBody);
        body.scale.set(1, 1.3, 0.9);
        body.position.y = 1.8;
        body.castShadow = true;
        robot.add(body);

        const chest = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), matAccent);
        chest.scale.set(1, 0.5, 0.5);
        chest.position.set(0, 1.8, 1.31);
        robot.add(chest);

        const headPivot = new THREE.Group();
        headPivot.position.y = 3.5;
        robot.add(headPivot);
        headPivotRef.current = headPivot;

        const head = new THREE.Mesh(new THREE.SphereGeometry(1.7, 48, 48), matBody);
        head.scale.set(1.2, 1, 1.1);
        head.position.y = 0.8;
        head.castShadow = true;
        headPivot.add(head);

        const visor = new THREE.Mesh(new THREE.SphereGeometry(1.45, 48, 32), matScreen);
        visor.scale.set(1.1, 0.8, 0.5);
        visor.position.set(0, 0.8, 1.26);
        headPivot.add(visor);

        const earGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
        earGeo.rotateZ(Math.PI / 2);
        const leftEar = new THREE.Mesh(earGeo, matBody);
        leftEar.position.set(-1.9, 0.8, 0);
        headPivot.add(leftEar);
        const leftEarGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32), matAccent);
        leftEarGlow.rotateZ(Math.PI / 2);
        leftEarGlow.position.set(-2.16, 0.8, 0);
        headPivot.add(leftEarGlow);

        const rightEar = new THREE.Mesh(earGeo, matBody);
        rightEar.position.set(1.9, 0.8, 0);
        headPivot.add(rightEar);
        const rightEarGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32), matAccent);
        rightEarGlow.rotateZ(Math.PI / 2);
        rightEarGlow.position.set(2.16, 0.8, 0);
        headPivot.add(rightEarGlow);

        const animate = () => {
            requestRef.current = requestAnimationFrame(animate);
            const t = clockRef.current.getElapsedTime();

            robot.position.y = Math.sin(t * 1.2) * 0.1 - 0.2;
            robot.rotation.z = Math.sin(t * 0.8) * 0.02;

            targetRotationRef.current.x = -mouseRef.current.y * 0.4;
            targetRotationRef.current.y = mouseRef.current.x * 0.6;

            headPivot.rotation.x += (targetRotationRef.current.x - headPivot.rotation.x) * 0.05;
            headPivot.rotation.y += (targetRotationRef.current.y - headPivot.rotation.y) * 0.05;
            robot.rotation.y += (targetRotationRef.current.y * 0.2 - robot.rotation.y) * 0.05;

            const targetScale = (isHoveredRef.current || isProcessingRef.current || isCooldownRef.current) ? 1.0 : 0.5;
            robot.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        const ctx = eyeContextRef.current;
        const canvas = eyeCanvasRef.current;
        const texture = eyeTextureRef.current;
        if (!ctx || !canvas || !texture) return;

        let animationFrameId: number;

        const draw = () => {
            if (eyeState === 'thinking') {
                const time = clockRef.current.getElapsedTime();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const neonColor = '#00ff99';
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
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const neonColor = '#00ff99';
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
                    ctx.beginPath(); ctx.arc(centerX - spacing, centerY + 10, 20, 0, Math.PI); ctx.stroke();
                    ctx.beginPath(); ctx.arc(centerX + spacing, centerY + 10, 20, 0, Math.PI); ctx.stroke();
                } else if (eyeState === 'angry') {
                    ctx.beginPath(); ctx.moveTo(centerX - spacing - 20, centerY - 20); ctx.lineTo(centerX - spacing + 20, centerY + 10); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(centerX + spacing + 20, centerY - 20); ctx.lineTo(centerX + spacing - 20, centerY + 10); ctx.stroke();
                } else if (eyeState === 'surprised') {
                    const r = 25;
                    ctx.beginPath(); ctx.arc(centerX - spacing, centerY, r, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(centerX + spacing, centerY, r, 0, Math.PI * 2); ctx.stroke();
                } else if (eyeState === 'error') {
                    const s = 15;
                    ctx.beginPath(); ctx.moveTo(centerX - spacing - s, centerY - s); ctx.lineTo(centerX - spacing + s, centerY + s); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(centerX - spacing + s, centerY - s); ctx.lineTo(centerX - spacing - s, centerY + s); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(centerX + spacing - s, centerY - s); ctx.lineTo(centerX + spacing + s, centerY + s); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(centerX + spacing + s, centerY - s); ctx.lineTo(centerX + spacing - s, centerY + s); ctx.stroke();
                }
                texture.needsUpdate = true;
            }
        };

        draw();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [eyeState]);

    const eyeStateRef = useRef(eyeState);

    useEffect(() => {
        eyeStateRef.current = eyeState;
    }, [eyeState]);

    useEffect(() => {
        const blinkInterval = setInterval(() => {
            const t = clockRef.current.getElapsedTime();
            if (eyeState === 'open' && !isRightClickingRef.current && !isProcessing && !isCooldown && t > nextBlinkTimeRef.current) {
                setEyeState('closed');
                setTimeout(() => {
                    if (eyeStateRef.current === 'closed' && !isRightClickingRef.current && !isProcessing && !isCooldown) {
                        setEyeState('open');
                    }
                    nextBlinkTimeRef.current = t + 3 + Math.random() * 4;
                }, 150);
            }
        }, 100);
        return () => clearInterval(blinkInterval);
    }, [eyeState, isProcessing, isCooldown]);

    useEffect(() => {
        const handleWindowMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const botCenterX = rect.left + rect.width / 2;
            const botCenterY = rect.top + rect.height / 2;

            const dx = e.clientX - botCenterX;
            const dy = e.clientY - botCenterY;

            const x = (dx / window.innerWidth) * 4;
            const y = -(dy / window.innerHeight) * 4;

            mouseRef.current.set(
                Math.max(-2, Math.min(2, x)),
                Math.max(-2, Math.min(2, y))
            );
        };

        const handleWindowRightClick = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleWindowMouseDown = (e: MouseEvent) => {
            if (e.button === 2) {
                isRightClickingRef.current = true;
                setEyeState('closed');
            }
            if (e.button === 0 && isRightClickingRef.current) {
                isRightClickingRef.current = false;
                setEyeState('open');
            }
        };

        const handleWindowMouseUp = () => {
            if (isRightClickingRef.current) {
                isRightClickingRef.current = false;
                setEyeState('open');
            }
        };

        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('contextmenu', handleWindowRightClick);
        window.addEventListener('mousedown', handleWindowMouseDown);
        window.addEventListener('mouseup', handleWindowMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('contextmenu', handleWindowRightClick);
            window.removeEventListener('mousedown', handleWindowMouseDown);
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, []);

    const handleMouseEnter = () => {
        setChatOpen(true);
        isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
        isHoveredRef.current = false;
        if (!input && !isProcessing && !isCooldown) {
            setChatOpen(false);
        }
    };

    const handleDoubleClick = () => {
        setEyeState('angry');
        setBubbleText("Hey! Personal space! 🤖");
        setTimeout(() => {
            setBubbleText(null);
            setEyeState('open');
        }, 2000);
    };

    const handleSend = async () => {
        if (!input.trim() || isProcessing) return;

        const userMsg = input;
        setInput('');
        setIsProcessing(true);
        isProcessingRef.current = true;
        setEyeState('thinking');
        setBubbleText("Thinking...");

        try {
            const response = await chatWithBot(userMsg);
            setBubbleText(response);
            setEyeState('happy');
        } catch (error) {
            setBubbleText("Error connecting to brain.");
            setEyeState('error');
        } finally {
            setIsProcessing(false);
            isProcessingRef.current = false;
            setIsCooldown(true);
            isCooldownRef.current = true;
            setTimeout(() => {
                setIsCooldown(false);
                isCooldownRef.current = false;
                if (eyeStateRef.current === 'happy') {
                    setEyeState('open');
                }
                if (!isHoveredRef.current && !inputRef.current) {
                    setChatOpen(false);
                }
            }, 2000);
        }
    };

    return (
        <div
            className={`fixed z-50 transition-all duration-300 ease-in-out w-[450px] h-[450px] ${chatOpen
                ? 'bottom-10 right-0'
                : '-bottom-10 -right-30'
                }`
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={handleDoubleClick}
        >
            {chatOpen && <div className="absolute -bottom-[200px] -right-[200px] w-[150%] h-[150%] bg-transparent -z-10" />}
            <div
                className={`absolute top-[0px] left-1/2 -translate-x-1/2 -translate-y-full mb-4 w-max max-w-[200px] bg-[#00ff99]/10 border-2 border-[#00ff99] text-[#00ff99] px-4 py-2 rounded-xl text-center font-mono text-sm font-bold shadow-[0_0_15px_#00ff99] pointer-events-none transition-opacity duration-200 ${bubbleText && chatOpen ? 'opacity-100' : 'opacity-0'}`}
            >
                {bubbleText}
                < div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#00ff99]" > </div>
            </div>

            < div ref={containerRef} className="w-full h-full cursor-pointer" />

            <div className={`absolute bottom-[40px] left-1/2 -translate-x-1/2 translate-y-full w-[300px] transition-all duration-300 ${chatOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}`}>
                <div className="flex gap-2 bg-black/80 p-2 rounded-full border border-[#00ff99] shadow-[0_0_10px_rgba(0,255,153,0.2)]" >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-transparent text-[#00ff99] placeholder-[#00ff99]/50 px-3 py-1 outline-none font-mono text-sm"
                        disabled={isProcessing}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isProcessing}
                        className="bg-[#00ff99] text-black p-2 rounded-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <IoSend />
                    </button>
                </div>
            </div>
        </div>
    );
}