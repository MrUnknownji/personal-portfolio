import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface UseBotSceneProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    mouseRef: React.MutableRefObject<THREE.Vector2>;
    isHoveredRef: React.MutableRefObject<boolean>;
    isProcessingRef: React.MutableRefObject<boolean>;
    isCooldownRef: React.MutableRefObject<boolean>;
    chatOpenRef: React.MutableRefObject<boolean>;
    chatOpen: boolean;
    isProcessing: boolean;
    isCooldown: boolean;
}

export const useBotScene = ({
    containerRef,
    mouseRef,
    isHoveredRef,
    isProcessingRef,
    isCooldownRef,
    chatOpenRef,
    chatOpen,
    isProcessing,
    isCooldown,
}: UseBotSceneProps) => {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const headPivotRef = useRef<THREE.Group | null>(null);
    const eyeTextureRef = useRef<THREE.CanvasTexture | null>(null);
    const eyeContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const eyeCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const robotRef = useRef<THREE.Group | null>(null);
    const requestRef = useRef<number | null>(null);
    const targetRotationRef = useRef(new THREE.Vector2());
    const clockRef = useRef(new THREE.Clock());
    const timeRef = useRef(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.set(0, 2.2, 9.5);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        rendererRef.current = renderer;

        const container = containerRef.current;
        if (container) {
            container.appendChild(renderer.domElement);
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        const updateSize = () => {
            if (container && renderer && camera) {
                const width = container.clientWidth;
                const height = container.clientHeight;
                renderer.setSize(width, height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        };

        window.addEventListener('resize', updateSize);

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7);

        scene.add(mainLight);
        const rimLight = new THREE.DirectionalLight(0x00ff99, 3.0);
        rimLight.position.set(-5, 5, -8);
        scene.add(rimLight);

        // Eye Canvas & Texture
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

        // Materials
        const matBody = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.5 });
        const matAccent = new THREE.MeshStandardMaterial({ color: 0x00ff99, emissive: 0x00ff99, emissiveIntensity: 0.8, roughness: 0.2 });
        const matScreen = new THREE.MeshStandardMaterial({
            color: 0x000000, roughness: 0.1, map: eyeTexture,
            emissive: 0xffffff, emissiveMap: eyeTexture, emissiveIntensity: 1.5
        });

        // Robot Construction
        const robot = new THREE.Group();
        robotRef.current = robot;
        scene.add(robot);
        robot.scale.set(0.5, 0.5, 0.5);

        const body = new THREE.Mesh(new THREE.SphereGeometry(1.6, 48, 48), matBody);
        body.scale.set(1, 1.3, 0.9);
        body.position.y = 1.8;

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

        return () => {
            window.removeEventListener('resize', updateSize);
            // Cleanup on unmount is handled here.
            // requestRef.current refers to the same ref used in the other useEffect.
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }

            // Dispose of scene resources
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }

                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach((material: THREE.Material) => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                }
            });

            eyeTexture.dispose();

            renderer.dispose();
        };
    }, [containerRef]);

    useEffect(() => {
        let frameCount = 0;
        const animate = () => {
            const scene = sceneRef.current;
            const camera = cameraRef.current;
            const renderer = rendererRef.current;
            const robot = robotRef.current;
            const headPivot = headPivotRef.current;

            if (!scene || !camera || !renderer || !robot || !headPivot) return;

            // Use incremental time to prevent jumps when resuming loop
            const dt = Math.min(clockRef.current.getDelta(), 0.1);
            timeRef.current += dt;
            const t = timeRef.current;

            const isActive = isHoveredRef.current || isProcessingRef.current || isCooldownRef.current || chatOpenRef.current;

            // Stop loop if inactive and settled
            if (!isActive) {
                const isSettled = Math.abs(robot.scale.x - 0.5) < 0.01;
                if (isSettled) {
                    requestRef.current = null;
                    return;
                }
            }

            requestRef.current = requestAnimationFrame(animate);

            frameCount++;
            if (!isActive && frameCount % 2 !== 0) {
                return;
            }

            robot.position.y = Math.sin(t * 1.2) * 0.1 - 0.2;
            robot.rotation.z = Math.sin(t * 0.8) * 0.02;

            targetRotationRef.current.x = -mouseRef.current.y * 0.4;
            targetRotationRef.current.y = mouseRef.current.x * 0.6;

            headPivot.rotation.x += (targetRotationRef.current.x - headPivot.rotation.x) * 0.05;
            headPivot.rotation.y += (targetRotationRef.current.y - headPivot.rotation.y) * 0.05;
            robot.rotation.y += (targetRotationRef.current.y * 0.2 - robot.rotation.y) * 0.05;

            const targetScale = isActive ? 1.0 : 0.5;
            robot.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            renderer.render(scene, camera);
        };

        const handleWakeUp = () => {
            if (!requestRef.current) {
                animate();
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mouseenter', handleWakeUp);
            container.addEventListener('touchstart', handleWakeUp);
        }

        if (chatOpen || isProcessing || isCooldown) {
            handleWakeUp();
        }

        return () => {
            if (container) {
                container.removeEventListener('mouseenter', handleWakeUp);
                container.removeEventListener('touchstart', handleWakeUp);
            }
        };
    }, [chatOpen, isProcessing, isCooldown, chatOpenRef, isHoveredRef, isProcessingRef, isCooldownRef, mouseRef, containerRef]);

    return {
        sceneRef,
        cameraRef,
        rendererRef,
        headPivotRef,
        robotRef,
        eyeTextureRef,
        eyeContextRef,
        eyeCanvasRef,
        clockRef,
    };
};
