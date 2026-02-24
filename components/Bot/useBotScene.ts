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
}

export const useBotScene = ({
    containerRef,
    mouseRef,
    isHoveredRef,
    isProcessingRef,
    isCooldownRef,
    chatOpenRef,
    isGlobalModalOpenRef,
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
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
        const rimLight = new THREE.DirectionalLight(0xff8c00, 3.0);
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

        const body = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 32), matBody);
        body.scale.set(1, 1.3, 0.9);
        body.position.y = 1.8;

        robot.add(body);

        const loadEmblemLayer = (path: string, zOffset: number, name: string) => {
            const tex = new THREE.TextureLoader().load(path);
            tex.colorSpace = THREE.SRGBColorSpace;
            const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), mat);
            // Slight step forward in Z to prevent z-fighting
            mesh.position.set(0, 1.75, 1.46 + zOffset);
            mesh.rotation.x = -0.1; // Follow the curvature slightly
            mesh.name = name;
            robot.add(mesh);
            return mesh;
        };

        loadEmblemLayer('/bot-mark-outer.svg', 0, "chestOuter");
        loadEmblemLayer('/bot-mark-middle.svg', 0.005, "chestMiddle");
        loadEmblemLayer('/bot-mark-center.svg', 0.010, "chestCenter");

        const headPivot = new THREE.Group();
        headPivot.position.y = 3.5;
        robot.add(headPivot);
        headPivotRef.current = headPivot;

        const head = new THREE.Mesh(new THREE.SphereGeometry(1.7, 32, 32), matBody);
        head.scale.set(1.2, 1, 1.1);
        head.position.y = 0.8;

        headPivot.add(head);

        const visor = new THREE.Mesh(new THREE.SphereGeometry(1.45, 32, 24), matScreen);
        visor.scale.set(1.1, 0.8, 0.5);
        visor.position.set(0, 0.8, 1.26);
        headPivot.add(visor);

        const earGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
        earGeo.rotateZ(Math.PI / 2);
        const leftEar = new THREE.Mesh(earGeo, matBody);
        leftEar.position.set(-1.9, 0.8, 0);
        headPivot.add(leftEar);
        const leftEarGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16), matAccent);
        leftEarGlow.rotateZ(Math.PI / 2);
        leftEarGlow.position.set(-2.16, 0.8, 0);
        headPivot.add(leftEarGlow);

        const rightEar = new THREE.Mesh(earGeo, matBody);
        rightEar.position.set(1.9, 0.8, 0);
        headPivot.add(rightEar);
        const rightEarGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16), matAccent);
        rightEarGlow.rotateZ(Math.PI / 2);
        rightEarGlow.position.set(2.16, 0.8, 0);
        headPivot.add(rightEarGlow);

        // High-Tech Energy Cloak
        const matCloak = new THREE.MeshPhysicalMaterial({ 
            color: 0xff8c00, 
            emissive: 0xff4500,
            emissiveIntensity: 0.3,
            transmission: 0.8, // Glass-like transparency
            opacity: 1,
            transparent: true,
            roughness: 0.1, 
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
            32,    // radial segments
            8,     // height segments
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
        const collarGeo = new THREE.CylinderGeometry(1.53, 1.53, 0.2, 32);
        const capeCollar = new THREE.Mesh(collarGeo, matBody);
        capeCollar.position.set(0, 1.3, 0); // Position exactly at the top edge of cape
        cape.add(capeCollar);
        
        // Add minimal gold accents to the collar to distinguish it
        const collarTrim1 = new THREE.Mesh(new THREE.TorusGeometry(1.53, 0.02, 16, 32), matGold);
        collarTrim1.rotation.x = Math.PI / 2;
        collarTrim1.position.y = 0.1;
        capeCollar.add(collarTrim1);
        
        const collarTrim2 = new THREE.Mesh(new THREE.TorusGeometry(1.53, 0.02, 16, 32), matGold);
        collarTrim2.rotation.x = Math.PI / 2;
        collarTrim2.position.y = -0.1;
        capeCollar.add(collarTrim2);

        // Subtle Hovering Ring (Base)
        const baseRingGroup = new THREE.Group();
        baseRingGroup.position.set(0, -0.6, 0);
        baseRingGroup.name = "baseRing";
        robot.add(baseRingGroup);

        const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.04, 16, 64), matAccent);
        baseRing.rotation.x = Math.PI / 2;
        baseRingGroup.add(baseRing);

        let frameCount = 0;

        const animate = () => {
            requestRef.current = requestAnimationFrame(animate);

            if (isGlobalModalOpenRef.current) {
                return; // Early return disables ALL rendering/calculations
            }

            const t = clockRef.current.getElapsedTime();

            const isActive = isHoveredRef.current || isProcessingRef.current || isCooldownRef.current || chatOpenRef.current;

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

            if (isActive) {
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

            const baseScale = isActive ? 1.0 : 0.6;
            const targetScale = baseScale + Math.sin(t * 2) * 0.02;
            robot.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('resize', updateSize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [containerRef, chatOpenRef, isCooldownRef, isHoveredRef, isProcessingRef, mouseRef, isGlobalModalOpenRef]);

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
