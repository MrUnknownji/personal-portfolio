import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePathname } from 'next/navigation';
import { EyeState } from './useBotEyes';

interface UseBotInteractionsProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    mouseRef: React.MutableRefObject<THREE.Vector2>;
    setEyeState: (state: EyeState) => void;
    isProcessing: boolean;
    isCooldown: boolean;
    setChatOpen: (open: boolean) => void;
    isHoveredRef: React.MutableRefObject<boolean>;
    robotRef: React.MutableRefObject<THREE.Group | null>;
    setBubbleText: (text: string | null) => void;
}

export const useBotInteractions = ({
    containerRef,
    mouseRef,
    setEyeState,
    isProcessing,
    isCooldown,
    setChatOpen,
    isHoveredRef,
    robotRef,
    setBubbleText,
}: UseBotInteractionsProps) => {
    const pathname = usePathname();
    const isRightClickingRef = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastMouseTime = useRef(Date.now());
    const lastScrollPos = useRef(0);
    const lastScrollTime = useRef(Date.now());
    const hoverCountRef = useRef(0);
    const lastHoverTimeRef = useRef(0);

    useEffect(() => {
        if (isProcessing || isCooldown) return;

        setEyeState('happy');

        if (robotRef.current) {
            const startY = robotRef.current.position.y;
            let jumpTime = 0;
            const jumpDuration = 0.5;

            const jumpInterval = setInterval(() => {
                jumpTime += 0.016;
                if (jumpTime >= jumpDuration) {
                    clearInterval(jumpInterval);
                    return;
                }
                const progress = jumpTime / jumpDuration;
                const jumpHeight = Math.sin(progress * Math.PI) * 0.5;
                if (robotRef.current) {
                    robotRef.current.position.y = startY + jumpHeight;
                }
            }, 16);
        }

        const timer = setTimeout(() => {
            setEyeState('open');
        }, 1500);
        return () => clearTimeout(timer);
    }, [pathname]);

    interface CustomWindow extends Window {
        lastMouseDirection?: number;
        lastShakeTime?: number;
        shakeCount?: number;
        dizzyTimeout?: NodeJS.Timeout;
        scrollTimeout?: NodeJS.Timeout;
    }

    useEffect(() => {
        const handleWindowMouseMove = (e: MouseEvent | TouchEvent) => {
            if (!containerRef.current) return;
            const now = Date.now();
            const dt = now - lastMouseTime.current;

            if (dt > 0) {
                let clientX, clientY;
                if ('touches' in e) {
                    if (e.touches.length > 0) {
                        clientX = e.touches[0].clientX;
                        clientY = e.touches[0].clientY;
                    } else return;
                } else {
                    clientX = (e as MouseEvent).clientX;
                    clientY = (e as MouseEvent).clientY;
                }

                const dx = clientX - lastMousePos.current.x;

                if (Math.abs(dx) > 5) {
                    const currentDirection = Math.sign(dx);
                    const win = window as unknown as CustomWindow;
                    if (currentDirection !== win.lastMouseDirection) {
                        const shakeTime = now;
                        const lastShakeTime = win.lastShakeTime || 0;

                        if (shakeTime - lastShakeTime < 300) {
                            win.shakeCount = (win.shakeCount || 0) + 1;
                        } else {
                            win.shakeCount = 1;
                        }

                        win.lastShakeTime = shakeTime;
                        win.lastMouseDirection = currentDirection;

                        if ((win.shakeCount || 0) > 4 && !isProcessing && !isCooldown && !isRightClickingRef.current) {
                            setEyeState('dizzy');

                            const messages = [
                                "Hey! What are you doing? 😵‍💫",
                                "I'm feeling dizzy... 🌀",
                                "My world is shaking! 🌍",
                                "Stop it! 🛑",
                                "Whoa whoa whoa! 🎢"
                            ];
                            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                            setBubbleText(randomMsg);
                            setChatOpen(true);

                            win.shakeCount = 0;

                            clearTimeout(win.dizzyTimeout);
                            win.dizzyTimeout = setTimeout(() => {
                                setEyeState('open');
                                setBubbleText(null);
                                if (!isHoveredRef.current) setChatOpen(false);
                            }, 2000);
                        }
                    }
                }

                lastMousePos.current = { x: clientX, y: clientY };
                lastMouseTime.current = now;
            }

            const rect = containerRef.current.getBoundingClientRect();
            const botCenterX = rect.left + rect.width / 2;
            const botCenterY = rect.top + rect.height / 2;

            let clientX, clientY;
            if ('touches' in e) {
                if (e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else return;
            } else {
                clientX = (e as MouseEvent).clientX;
                clientY = (e as MouseEvent).clientY;
            }

            const dx = clientX - botCenterX;
            const dy = clientY - botCenterY;

            const x = (dx / window.innerWidth) * 4;
            const y = -(dy / window.innerHeight) * 4;

            mouseRef.current.set(
                Math.max(-2, Math.min(2, x)),
                Math.max(-2, Math.min(2, y))
            );
        };

        const handleScroll = () => {
            const now = Date.now();
            const dt = now - lastScrollTime.current;
            const currentScroll = window.scrollY;
            const delta = Math.abs(currentScroll - lastScrollPos.current);
            const win = window as unknown as CustomWindow;

            if (dt > 0) {
                const speed = delta / dt;
                if (speed > 2.0 && !isProcessing && !isCooldown) {
                    setEyeState('surprised');
                    clearTimeout(win.scrollTimeout);
                    win.scrollTimeout = setTimeout(() => {
                        setEyeState('open');
                    }, 500);
                }
            }
            lastScrollPos.current = currentScroll;
            lastScrollTime.current = now;
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
        window.addEventListener('touchmove', handleWindowMouseMove);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('contextmenu', handleWindowRightClick);
        window.addEventListener('mousedown', handleWindowMouseDown);
        window.addEventListener('mouseup', handleWindowMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('touchmove', handleWindowMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('contextmenu', handleWindowRightClick);
            window.removeEventListener('mousedown', handleWindowMouseDown);
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [isProcessing, isCooldown, containerRef, isHoveredRef, mouseRef, setBubbleText, setChatOpen, setEyeState]);

    const handleMouseEnter = () => {
        setChatOpen(true);
        isHoveredRef.current = true;

        const now = Date.now();
        if (now - lastHoverTimeRef.current < 500) {
            hoverCountRef.current++;
        } else {
            hoverCountRef.current = 1;
        }
        lastHoverTimeRef.current = now;

        if (hoverCountRef.current > 3) {
            setEyeState('confused');
            setTimeout(() => {
                setEyeState('open');
                hoverCountRef.current = 0;
            }, 1500);
        }
    };

    const handleMouseLeave = () => {
        isHoveredRef.current = false;
    };

    return {
        handleMouseEnter,
        handleMouseLeave,
        isRightClickingRef
    };
};
