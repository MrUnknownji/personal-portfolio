import { useEffect, useRef } from 'react';
import {
    AmbientLight,
    CanvasTexture,
    CircleGeometry,
    Clock,
    CylinderGeometry,
    DirectionalLight,
    DoubleSide,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    RingGeometry,
    Scene,
    SphereGeometry,
    SRGBColorSpace,
    TorusGeometry,
    Vector3,
    WebGLRenderer,
} from 'three';
import type { BufferGeometry, Material, Texture } from 'three';

interface UseBotSceneProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    activeRef: React.MutableRefObject<boolean>;
    activityToken: string;
    isGlobalModalOpenRef: React.MutableRefObject<boolean>;
    onReady: () => void;
    onUnavailable: () => void;
}

export const useBotScene = ({
    containerRef,
    activeRef,
    activityToken,
    isGlobalModalOpenRef,
    onReady,
    onUnavailable,
}: UseBotSceneProps) => {
    const sceneRef = useRef<Scene | null>(null);
    const rendererRef = useRef<WebGLRenderer | null>(null);
    const cameraRef = useRef<PerspectiveCamera | null>(null);
    const headPivotRef = useRef<Group | null>(null);
    const eyeTextureRef = useRef<CanvasTexture | null>(null);
    const eyeContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const eyeCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const robotRef = useRef<Group | null>(null);
    const requestRef = useRef<number | null>(null);
    const frameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wakeSceneRef = useRef<(() => void) | null>(null);
    const clockRef = useRef(new Clock());

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new Scene();
        sceneRef.current = scene;

        const camera = new PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.set(0, 2.2, 9.5);
        cameraRef.current = camera;

        let renderer: WebGLRenderer;
        try {
            renderer = new WebGLRenderer({
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
            renderer.domElement.style.pointerEvents = "none";
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
        scene.add(new AmbientLight(0xffffff, 0.3));
        const mainLight = new DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7);

        scene.add(mainLight);
        const rimLight = new DirectionalLight(0xff8c00, 3.0);
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

        const eyeTexture = new CanvasTexture(eyeCanvas);
        eyeTexture.colorSpace = SRGBColorSpace;
        eyeTexture.offset.x = 0.25;
        eyeTextureRef.current = eyeTexture;

        // Materials
        const matBody = new MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.5 });
        const matAccent = new MeshStandardMaterial({ color: 0xff8c00, emissive: 0xff8c00, emissiveIntensity: 0.8, roughness: 0.2 });
        const matGold = new MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8 });
        const matScreen = new MeshStandardMaterial({
            color: 0x000000, roughness: 0.1, map: eyeTexture,
            emissive: 0xffffff, emissiveMap: eyeTexture, emissiveIntensity: 1.5
        });

        // Robot Construction
        const robot = new Group();
        robotRef.current = robot;
        scene.add(robot);
        robot.scale.set(0.5, 0.5, 0.5);

        const body = new Mesh(new SphereGeometry(1.6, 20, 16), matBody);
        body.scale.set(1, 1.3, 0.9);
        body.position.y = 1.8;

        robot.add(body);

        const createEmblemLayer = (
            geometry: BufferGeometry,
            zOffset: number,
            name: string,
            color: number,
        ) => {
            const mat = new MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.8,
                depthWrite: false,
                side: DoubleSide,
            });
            const mesh = new Mesh(geometry, mat);
            mesh.position.set(0, 1.75, 1.46 + zOffset);
            mesh.rotation.x = -0.1;
            mesh.name = name;
            robot.add(mesh);
            return mesh;
        };

        createEmblemLayer(new RingGeometry(0.34, 0.43, 6), 0, "chestOuter", 0xff9233);
        createEmblemLayer(new RingGeometry(0.18, 0.29, 6), 0.005, "chestMiddle", 0xd4af37);
        createEmblemLayer(new CircleGeometry(0.1, 12), 0.010, "chestCenter", 0xffcc66);

        const headPivot = new Group();
        headPivot.position.y = 3.5;
        robot.add(headPivot);
        headPivotRef.current = headPivot;

        const head = new Mesh(new SphereGeometry(1.7, 20, 16), matBody);
        head.scale.set(1.2, 1, 1.1);
        head.position.y = 0.8;

        headPivot.add(head);

        const visor = new Mesh(new SphereGeometry(1.45, 20, 12), matScreen);
        visor.scale.set(1.1, 0.8, 0.5);
        visor.position.set(0, 0.8, 1.26);
        headPivot.add(visor);

        const earGeo = new CylinderGeometry(0.5, 0.5, 0.5, 12);
        earGeo.rotateZ(Math.PI / 2);
        const leftEar = new Mesh(earGeo, matBody);
        leftEar.position.set(-1.9, 0.8, 0);
        headPivot.add(leftEar);
        const leftEarGlow = new Mesh(new CylinderGeometry(0.35, 0.35, 0.1, 12), matAccent);
        leftEarGlow.rotateZ(Math.PI / 2);
        leftEarGlow.position.set(-2.16, 0.8, 0);
        headPivot.add(leftEarGlow);

        const rightEar = new Mesh(earGeo, matBody);
        rightEar.position.set(1.9, 0.8, 0);
        headPivot.add(rightEar);
        const rightEarGlow = new Mesh(new CylinderGeometry(0.35, 0.35, 0.1, 12), matAccent);
        rightEarGlow.rotateZ(Math.PI / 2);
        rightEarGlow.position.set(2.16, 0.8, 0);
        headPivot.add(rightEarGlow);

        // High-Tech Energy Cloak
        const matCloak = new MeshStandardMaterial({
            color: 0xff8c00, 
            emissive: 0xff4500,
            emissiveIntensity: 0.18,
            opacity: 0.55,
            transparent: true,
            roughness: 0.45,
            metalness: 0.15,
            side: DoubleSide
        });

        const cloakGroup = new Group();
        // Center of the torso (base of the neck area)
        cloakGroup.position.set(0, 1.4, 0); 
        cloakGroup.name = "cloakGroup";
        robot.add(cloakGroup);

        // Cylinder covering exactly the back 180 degrees 
        // sweeps perfectly from the right over the back (-Z axis) to the left
        const capeGeo = new CylinderGeometry(
            1.5,   // radius top (around neck width)
            2.0,   // radius bottom (flare out)
            2.6,   // height (drops down to base)
            18,    // radial segments
            4,     // height segments
            true,  // open ended
            Math.PI / 2, // start at +X
            Math.PI      // sweep 180 degrees to -X
        );
        
        const cape = new Mesh(capeGeo, matCloak);
        // Tilt slightly backward so it flares away from the body
        cape.rotation.x = -0.15; 
        cloakGroup.add(cape);

        // A sleek, structured dark-metal collar holding the top of the cape
        // Distinguishes it from the simple glowing base ring and adds rigid structure
        const collarGeo = new CylinderGeometry(1.53, 1.53, 0.2, 18);
        const capeCollar = new Mesh(collarGeo, matBody);
        capeCollar.position.set(0, 1.3, 0); // Position exactly at the top edge of cape
        cape.add(capeCollar);
        
        // Add minimal gold accents to the collar to distinguish it
        const collarTrim1 = new Mesh(new TorusGeometry(1.53, 0.02, 8, 24), matGold);
        collarTrim1.rotation.x = Math.PI / 2;
        collarTrim1.position.y = 0.1;
        capeCollar.add(collarTrim1);
        
        const collarTrim2 = new Mesh(new TorusGeometry(1.53, 0.02, 8, 24), matGold);
        collarTrim2.rotation.x = Math.PI / 2;
        collarTrim2.position.y = -0.1;
        capeCollar.add(collarTrim2);

        // Subtle Hovering Ring (Base)
        const baseRingGroup = new Group();
        baseRingGroup.position.set(0, -0.6, 0);
        baseRingGroup.name = "baseRing";
        robot.add(baseRingGroup);

        const baseRing = new Mesh(new TorusGeometry(1.6, 0.04, 8, 32), matAccent);
        baseRing.rotation.x = Math.PI / 2;
        baseRingGroup.add(baseRing);

        const frameInterval = 1000 / 24;
        let activeUntil = performance.now() + 1200;
        let disposed = false;

        const scheduleFrame = (delay = frameInterval) => {
            if (disposed || requestRef.current || frameTimeoutRef.current) return;
            frameTimeoutRef.current = setTimeout(() => {
                frameTimeoutRef.current = null;
                requestRef.current = requestAnimationFrame(animate);
            }, delay);
        };

        const animate = (now = performance.now()) => {
            requestRef.current = null;
            const active = activeRef.current;
            if (active) activeUntil = now + 1200;

            if (isGlobalModalOpenRef.current || (!active && now > activeUntil)) {
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
            robot.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);

            renderer.render(scene, camera);
            scheduleFrame();
        };

        wakeSceneRef.current = () => {
            activeUntil =
                performance.now() + (activeRef.current ? 1200 : 120);
            scheduleFrame(0);
        };

        renderer.render(scene, camera);
        onReady();
        scheduleFrame(0);

        return () => {
            disposed = true;
            wakeSceneRef.current = null;
            window.removeEventListener('resize', updateSize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (frameTimeoutRef.current) clearTimeout(frameTimeoutRef.current);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            scene.traverse((object) => {
                if (!(object instanceof Mesh)) return;

                object.geometry?.dispose();
                const materials = Array.isArray(object.material)
                    ? object.material
                    : [object.material];

                materials.forEach((material) => {
                    const materialWithMaps = material as Material & {
                        map?: Texture;
                        emissiveMap?: Texture;
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
    }, [activeRef, containerRef, isGlobalModalOpenRef, onReady, onUnavailable]);

    useEffect(() => {
        wakeSceneRef.current?.();
    }, [activityToken]);

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
