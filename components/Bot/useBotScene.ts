import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface UseBotSceneProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    mouseRef: React.MutableRefObject<THREE.Vector2>;
    isHoveredRef: React.MutableRefObject<boolean>;
    isProcessingRef: React.MutableRefObject<boolean>;
    isCooldownRef: React.MutableRefObject<boolean>;
    chatOpenRef: React.MutableRefObject<boolean>;
    isGlobalModalOpenRef: React.MutableRefObject<boolean>;
    enabled: boolean;
    onUnavailable: () => void;
}

export const useBotScene = ({
    containerRef,
    mouseRef,
    isHoveredRef,
    isProcessingRef,
    isCooldownRef,
    chatOpenRef,
    isGlobalModalOpenRef,
    enabled,
    onUnavailable,
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
    const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const targetRotationRef = useRef(new THREE.Vector2());
    const clockRef = useRef(new THREE.Clock());

    useEffect(() => {
        if (!enabled || !containerRef.current) return;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.set(0, 2.2, 9.5);
        cameraRef.current = camera;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: window.devicePixelRatio <= 1,
                alpha: true,
                powerPreference: "low-power",
            });
        } catch {
            onUnavailable();
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
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
                renderer.render(scene, camera);
            }
        };

        window.addEventListener('resize', updateSize);

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7);

        scene.add(mainLight);
        const rimLight = new THREE.DirectionalLight(0xff8c00, 3.0);
        rimLight.position.set(-5, 5, -8);
        scene.add(rimLight);

        // Eye Canvas & Texture
        const eyeCanvas = document.createElement('canvas');
        eyeCanvas.width = 512;
        eyeCanvas.height = 256;
        const ctx = eyeCanvas.getContext('2d');
        if (ctx) {
            eyeContextRef.current = ctx;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, eyeCanvas.width, eyeCanvas.height);
            ctx.strokeStyle = '#ff8c00';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(eyeCanvas.width / 2 - 40, eyeCanvas.height / 2, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(eyeCanvas.width / 2 + 40, eyeCanvas.height / 2, 20, 0, Math.PI * 2);
            ctx.stroke();
        }
        eyeCanvasRef.current = eyeCanvas;

        const eyeTexture = new THREE.CanvasTexture(eyeCanvas);
        eyeTexture.colorSpace = THREE.SRGBColorSpace;
        eyeTexture.offset.x = 0.25;
        eyeTextureRef.current = eyeTexture;

        // Materials
        const matBody = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.5 });
        const matAccent = new THREE.MeshStandardMaterial({ color: 0xff8c00, emissive: 0xff8c00, emissiveIntensity: 0.8, roughness: 0.2 });
        const matGold = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8 });
        const matScreen = new THREE.MeshStandardMaterial({
            color: 0x000000, roughness: 0.1, map: eyeTexture,
            emissive: 0xffffff, emissiveMap: eyeTexture, emissiveIntensity: 1.5
        });

        // Robot Construction
        const robot = new THREE.Group();
        robotRef.current = robot;
        scene.add(robot);
        robot.scale.set(0.5, 0.5, 0.5);

        const body = new THREE.Mesh(new THREE.SphereGeometry(1.6, 20, 16), matBody);
        body.scale.set(1, 1.3, 0.9);
        body.position.y = 1.8;

        robot.add(body);

        const createEmblemLayer = (
            geometry: THREE.BufferGeometry,
            zOffset: number,
            name: string,
            color: number,
        ) => {
            const mat = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.8,
                depthWrite: false,
                side: THREE.DoubleSide,
            });
            const mesh = new THREE.Mesh(geometry, mat);
            mesh.position.set(0, 1.75, 1.46 + zOffset);
            mesh.rotation.x = -0.1;
            mesh.name = name;
            robot.add(mesh);
            return mesh;
        };

        createEmblemLayer(new THREE.RingGeometry(0.34, 0.43, 6), 0, "chestOuter", 0xff9233);
        createEmblemLayer(new THREE.RingGeometry(0.18, 0.29, 6), 0.005, "chestMiddle", 0xd4af37);
        createEmblemLayer(new THREE.CircleGeometry(0.1, 12), 0.010, "chestCenter", 0xffcc66);

        const headPivot = new THREE.Group();
        headPivot.position.y = 3.5;
        robot.add(headPivot);
        headPivotRef.current = headPivot;

        const head = new THREE.Mesh(new THREE.SphereGeometry(1.7, 20, 16), matBody);
        head.scale.set(1.2, 1, 1.1);
        head.position.y = 0.8;

        headPivot.add(head);

        const visor = new THREE.Mesh(new THREE.SphereGeometry(1.45, 20, 12), matScreen);
        visor.scale.set(1.1, 0.8, 0.5);
        visor.position.set(0, 0.8, 1.26);
        headPivot.add(visor);

        const earGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 12);
        earGeo.rotateZ(Math.PI / 2);
        const leftEar = new THREE.Mesh(earGeo, matBody);
        leftEar.position.set(-1.9, 0.8, 0);
        headPivot.add(leftEar);
        const leftEarGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 12), matAccent);
        leftEarGlow.rotateZ(Math.PI / 2);
        leftEarGlow.position.set(-2.16, 0.8, 0);
        headPivot.add(leftEarGlow);

        const rightEar = new THREE.Mesh(earGeo, matBody);
        rightEar.position.set(1.9, 0.8, 0);
        headPivot.add(rightEar);
        const rightEarGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 12), matAccent);
        rightEarGlow.rotateZ(Math.PI / 2);
        rightEarGlow.position.set(2.16, 0.8, 0);
        headPivot.add(rightEarGlow);

        // High-Tech Energy Cloak
        const matCloak = new THREE.MeshStandardMaterial({
            color: 0xff8c00, 
            emissive: 0xff4500,
            emissiveIntensity: 0.18,
            opacity: 0.55,
            transparent: true,
            roughness: 0.45,
            metalness: 0.15,
            side: THREE.DoubleSide
        });

        const cloakGroup = new THREE.Group();
        // Center of the torso (base of the neck area)
        cloakGroup.position.set(0, 1.4, 0); 
        cloakGroup.name = "cloakGroup";
        robot.add(cloakGroup);

        // Cylinder covering exactly the back 180 degrees 
        // sweeps perfectly from the right over the back (-Z axis) to the left
        const capeGeo = new THREE.CylinderGeometry(
            1.5,   // radius top (around neck width)
            2.0,   // radius bottom (flare out)
            2.6,   // height (drops down to base)
            18,    // radial segments
            4,     // height segments
            true,  // open ended
            Math.PI / 2, // start at +X
            Math.PI      // sweep 180 degrees to -X
        );
        
        const cape = new THREE.Mesh(capeGeo, matCloak);
        // Tilt slightly backward so it flares away from the body
        cape.rotation.x = -0.15; 
        cloakGroup.add(cape);

        // A sleek, structured dark-metal collar holding the top of the cape
        // Distinguishes it from the simple glowing base ring and adds rigid structure
        const collarGeo = new THREE.CylinderGeometry(1.53, 1.53, 0.2, 18);
        const capeCollar = new THREE.Mesh(collarGeo, matBody);
        capeCollar.position.set(0, 1.3, 0); // Position exactly at the top edge of cape
        cape.add(capeCollar);
        
        // Add minimal gold accents to the collar to distinguish it
        const collarTrim1 = new THREE.Mesh(new THREE.TorusGeometry(1.53, 0.02, 8, 24), matGold);
        collarTrim1.rotation.x = Math.PI / 2;
        collarTrim1.position.y = 0.1;
        capeCollar.add(collarTrim1);
        
        const collarTrim2 = new THREE.Mesh(new THREE.TorusGeometry(1.53, 0.02, 8, 24), matGold);
        collarTrim2.rotation.x = Math.PI / 2;
        collarTrim2.position.y = -0.1;
        capeCollar.add(collarTrim2);

        // Subtle Hovering Ring (Base)
        const baseRingGroup = new THREE.Group();
        baseRingGroup.position.set(0, -0.6, 0);
        baseRingGroup.name = "baseRing";
        robot.add(baseRingGroup);

        const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.04, 8, 32), matAccent);
        baseRing.rotation.x = Math.PI / 2;
        baseRingGroup.add(baseRing);

        const isActive = () => {
            return (
                isHoveredRef.current ||
                isProcessingRef.current ||
                isCooldownRef.current ||
                chatOpenRef.current
            );
        };

        let activeUntil = performance.now() + 1800;

        const animate = () => {
            const now = performance.now();
            const active = isActive();
            if (active) activeUntil = now + 1800;

            if (isGlobalModalOpenRef.current || (!active && now > activeUntil)) {
                requestRef.current = null;
                idleTimeoutRef.current = setTimeout(() => {
                    idleTimeoutRef.current = null;
                    if (!requestRef.current) {
                        requestRef.current = requestAnimationFrame(animate);
                    }
                }, 250);
                return;
            }

            const t = clockRef.current.getElapsedTime();

            robot.position.y = Math.sin(t * 1.2) * 0.1 - 0.2;
            robot.rotation.z = Math.sin(t * 0.8) * 0.02;

            const baseRing = robot.getObjectByName("baseRing");
            if (baseRing) {
                baseRing.rotation.y = t * 0.5; // Slowly spin
                baseRing.position.y = -0.6 + Math.sin(t * 2) * 0.05; // Gentle float independent of breathing
            }

            // Animate SVG chest emblem layers independently
            const chestOuter = robot.getObjectByName("chestOuter");
            if (chestOuter) chestOuter.rotation.z = -t * 0.2; // Counter-clockwise, slow

            const chestMiddle = robot.getObjectByName("chestMiddle");
            if (chestMiddle) chestMiddle.rotation.z = t * 0.6; // Clockwise, faster

            const chestCenter = robot.getObjectByName("chestCenter");
            if (chestCenter) {
                chestCenter.rotation.z = -t * 0.8; // Continuous counter-clockwise rotation
                const scaleWobble = 1 + Math.sin(t * 3) * 0.03; // Slight pulsing
                chestCenter.scale.set(scaleWobble, scaleWobble, scaleWobble);
            }

            if (active) {
                targetRotationRef.current.x = -mouseRef.current.y * 0.4;
                targetRotationRef.current.y = mouseRef.current.x * 0.6;
            } else {
                targetRotationRef.current.x = 0;
                targetRotationRef.current.y = 0;
            }

            headPivot.rotation.x += (targetRotationRef.current.x - headPivot.rotation.x) * 0.05;
            headPivot.rotation.y += (targetRotationRef.current.y - headPivot.rotation.y) * 0.05;
            robot.rotation.y += (targetRotationRef.current.y * 0.2 - robot.rotation.y) * 0.05;

            // Animate Cloak Billowing effect
            const cloakGrp = robot.getObjectByName("cloakGroup");
            if (cloakGrp) {
                // Subtle flow like cloth in air
                const billowZ = Math.sin(t * 1.5) * 0.02;
                const billowX = Math.cos(t * 1.2) * 0.01;
                cloakGrp.scale.z = 1 + billowZ;
                cloakGrp.scale.x = 1 + billowX;
            }

            const baseScale = active ? 1.0 : 0.6;
            const targetScale = baseScale + Math.sin(t * 2) * 0.02;
            robot.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            renderer.render(scene, camera);
            requestRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', updateSize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            scene.traverse((object) => {
                if (!(object instanceof THREE.Mesh)) return;

                object.geometry?.dispose();
                const materials = Array.isArray(object.material)
                    ? object.material
                    : [object.material];

                materials.forEach((material) => {
                    const materialWithMaps = material as THREE.Material & {
                        map?: THREE.Texture;
                        emissiveMap?: THREE.Texture;
                    };
                    materialWithMaps.map?.dispose();
                    materialWithMaps.emissiveMap?.dispose();
                    material.dispose();
                });
            });
            eyeTexture.dispose();
            renderer.dispose();
            sceneRef.current = null;
            rendererRef.current = null;
            cameraRef.current = null;
            headPivotRef.current = null;
            eyeTextureRef.current = null;
            eyeContextRef.current = null;
            eyeCanvasRef.current = null;
            robotRef.current = null;
        };
    }, [containerRef, chatOpenRef, enabled, isCooldownRef, isHoveredRef, isProcessingRef, mouseRef, isGlobalModalOpenRef, onUnavailable]);

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
