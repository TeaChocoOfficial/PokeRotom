// -Path: "PokeRotom/client/src/screen/game/world/water/Water.tsx"
import * as THREE from 'three';
import { useControls } from 'leva';
import useChunk from '../hooks/chunk';
import useNoise from '../hooks/noise';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '$/stores/gameStore';
import { MeshReflectorMaterial } from '@react-three/drei';
import { FullQuality, Quality, useSettingStore } from '$/stores/settingStore';

/** @description แปลง Quality เป็นค่า resolution สำหรับ reflector */
function getReflectorConfig(
    mirrorQuality: FullQuality,
): { resolution: number; blur: [number, number] } | null {
    switch (mirrorQuality) {
        case FullQuality.VERY_LOW:
            return { resolution: 128, blur: [50, 25] };
        case FullQuality.LOW:
            return { resolution: 256, blur: [100, 50] };
        case FullQuality.MEDIUM:
            return { resolution: 512, blur: [200, 100] };
        case FullQuality.HIGH:
            return { resolution: 1024, blur: [300, 150] };
        case FullQuality.VERY_HIGH:
            return { resolution: 2048, blur: [500, 250] };
        default:
            return null;
    }
}

export default function Water() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { chunk } = useGameStore();
    const { getBiomeConfig } = useNoise();
    const { mirrorQuality } = useSettingStore();
    const { CHUNK_SIZE, renderDistance } = useChunk();

    const {
        waterLevel,
        waveSpeed,
        waveHeight,
        steepness,
        wavelength,
        wireframe,
    } = useControls('water', {
        waterLevel: { value: -2, min: -20, max: 10, step: 0.5 },
        waveSpeed: { value: 0.8, min: 0, max: 3, step: 0.1 },
        waveHeight: { value: 0.1, min: 0, max: 1, step: 0.01 },
        steepness: { value: 0.2, min: 0, max: 1, step: 0.01 },
        wavelength: { value: 40, min: 1, max: 100, step: 1 },
        wireframe: { value: false },
    });

    /** ขนาดระนาบน้ำ — ครอบคลุมพื้นที่กว้างใหญ่เป็นวงกลม */
    const waterRadius = useMemo(
        () => (renderDistance * 2 + 1) * CHUNK_SIZE,
        [renderDistance, CHUNK_SIZE],
    );

    /** ตำแหน่งกลาง snap ตาม chunk ของผู้เล่น */
    const centerX = chunk.x * CHUNK_SIZE;
    const centerZ = chunk.z * CHUNK_SIZE;

    const waterColor = useMemo(() => {
        const biome = getBiomeConfig(centerX, centerZ);
        return new THREE.Color(biome.water.color as string);
    }, [getBiomeConfig, centerX, centerZ]);

    const waterOpacity = useMemo(() => {
        const biome = getBiomeConfig(centerX, centerZ);
        return biome.water.opacity;
    }, [getBiomeConfig, centerX, centerZ]);

    const reflectorConfig = useMemo(
        () => getReflectorConfig(mirrorQuality),
        [mirrorQuality],
    );

    /** Wave animation ตามจุดที่ผู้เล่นอยู่ - ให้ประหยัดทรัพยากรที่สุด */
    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const geo = meshRef.current.geometry;
        const positions = geo.attributes.position.array as Float32Array;
        const time = clock.getElapsedTime() * waveSpeed;

        const k1 = (2 * Math.PI) / wavelength;
        const k2 = (2 * Math.PI) / (wavelength * 0.5);
        const c1 = Math.sqrt(9.8 / k1);
        const c2 = Math.sqrt(9.8 / k2);

        for (let index = 0; index < positions.length; index += 3) {
            const worldX = positions[index] + centerX;
            const worldY = positions[index + 1] + centerZ;

            const f1 = k1 * (worldX * 0.707 + worldY * 0.707 - c1 * time);
            const f2 = k2 * (worldX * 0.857 + worldY * 0.514 - c2 * time * 0.8);

            positions[index + 2] =
                (Math.sin(f1) + Math.sin(f2) * 0.5) *
                (waveHeight * 5 * steepness);
        }
        geo.attributes.position.needsUpdate = true;
    });

    /** สร้างแผ่น Alpha Map วงกลม เพื่อตัดขอบ Plane ให้เป็นวงกลม */
    const alphaMap = useMemo(() => {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const grad = ctx.createRadialGradient(
                size / 2,
                size / 2,
                0,
                size / 2,
                size / 2,
                size / 2,
            );
            grad.addColorStop(0.85, 'white');
            grad.addColorStop(1, 'black');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, size, size);
        }
        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }, []);

    const materialProps = {
        transparent: true,
        opacity: waterOpacity,
        color: waterColor,
        alphaMap: alphaMap,
        alphaTest: 0.01,
    };

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[centerX, waterLevel, centerZ]}
        >
            <planeGeometry args={[waterRadius * 2, waterRadius * 2, 64, 64]} />
            {reflectorConfig ? (
                <MeshReflectorMaterial
                    mirror={0.75}
                    mixBlur={0.8}
                    depthScale={1.2}
                    mixStrength={0.6}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    blur={reflectorConfig.blur}
                    resolution={reflectorConfig.resolution}
                    metalness={0.5}
                    roughness={0.3}
                    wireframe={wireframe}
                    {...materialProps}
                />
            ) : (
                <meshPhongMaterial
                    {...materialProps}
                    shininess={60}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                    specular={new THREE.Color('#ffffff')}
                    wireframe={wireframe}
                />
            )}
        </mesh>
    );
}
