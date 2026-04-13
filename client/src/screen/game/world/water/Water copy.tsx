// -Path: "PokeRotom/client/src/screen/game/world/water/Water.tsx"
import * as THREE from 'three';
import useChunk from '../hooks/chunk';
import useNoise from '../hooks/noise';
import { useControls } from 'leva';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '$/stores/gameStore';
import { MeshReflectorMaterial } from '@react-three/drei';
import { MirrorQuality, useSettingStore } from '$/stores/settingStore';

/** @description แปลง MirrorQuality เป็นค่า resolution สำหรับ reflector */
function getReflectorConfig(
    mirrorQuality: MirrorQuality,
): { resolution: number; blur: [number, number] } | null {
    switch (mirrorQuality) {
        case MirrorQuality.LOW:
            return { resolution: 256, blur: [100, 50] };
        case MirrorQuality.MEDIUM:
            return { resolution: 512, blur: [200, 100] };
        case MirrorQuality.HIGH:
            return { resolution: 1024, blur: [300, 150] };
        default:
            return null;
    }
}

/**
 * @description ระนาบน้ำแบบ Infinite ที่ติดตามผู้เล่น
 * มี wave animation เล็กน้อยเพื่อความสมจริง
 * รองรับ mirror reflection ตาม mirrorQuality ใน settingStore
 * ระดับน้ำคงที่ (waterLevel) — พื้นที่ต่ำกว่า waterLevel จะจมอยู่ใต้น้ำ
 */
export default function Water({ seed }: { seed: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const { chunk } = useGameStore();
    const { getBiomeConfig } = useNoise(seed);
    const { mirrorQuality } = useSettingStore();
    const { CHUNK_SIZE, RENDER_DISTANCE } = useChunk();

    const { waterLevel, waveSpeed, waveHeight } = useControls('water', {
        waterLevel: { value: -2, min: -20, max: 10, step: 0.5 },
        waveSpeed: { value: 0.8, min: 0, max: 3, step: 0.1 },
        waveHeight: { value: 0.15, min: 0, max: 1, step: 0.01 },
    });

    /** ขนาดระนาบน้ำ — ครอบคลุมทุก chunk ที่ render */
    const waterSize = useMemo(
        () => (RENDER_DISTANCE * 2 + 1) * CHUNK_SIZE,
        [RENDER_DISTANCE, CHUNK_SIZE],
    );

    /** ตำแหน่งกลาง snap ตาม chunk ของผู้เล่น */
    const centerX = chunk.x * CHUNK_SIZE + CHUNK_SIZE / 2;
    const centerZ = chunk.z * CHUNK_SIZE + CHUNK_SIZE / 2;

    /** ดึงสีน้ำจาก biome ตรงกลางผู้เล่น */
    const waterColor = useMemo(() => {
        const biome = getBiomeConfig(centerX, centerZ);
        return new THREE.Color(biome.water.color as string);
    }, [getBiomeConfig, centerX, centerZ]);

    const waterOpacity = useMemo(() => {
        const biome = getBiomeConfig(centerX, centerZ);
        return biome.water.opacity;
    }, [getBiomeConfig, centerX, centerZ]);

    /** Config reflector ตาม mirrorQuality */
    const reflectorConfig = useMemo(
        () => getReflectorConfig(mirrorQuality),
        [mirrorQuality],
    );

    /** Wave animation — ขยับ vertex ตาม sin wave ทุกเฟรม */
    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const geo = meshRef.current.geometry;
        const positions = geo.attributes.position.array as Float32Array;
        const time = clock.getElapsedTime() * waveSpeed;

        for (let index = 0; index < positions.length; index += 3) {
            const x = positions[index] + centerX;
            const y = positions[index + 1] + centerZ;

            /** @description Gerstner Waves - สร้างคลื่นที่มีความแหลมคมและทรงพลัง */
            const steepness = 0.4;
            const wavelength = 20;
            const k = (2 * Math.PI) / wavelength;
            const c = Math.sqrt(9.8 / k);
            const d1 = new THREE.Vector2(1, 1).normalize();
            const d2 = new THREE.Vector2(1, 0.5).normalize();

            const f1 = k * (d1.dot(new THREE.Vector2(x, y)) - c * time);
            const f2 = k * (d2.dot(new THREE.Vector2(x, y)) - c * time * 0.8);

            // คำนวณความสูง (Z) และการเยื้อง (X, Y) เพื่อให้คลื่นดูแหลม (Sharp peaks)
            const waveY = (steepness / k) * (Math.sin(f1) + Math.sin(f2));
            
            positions[index + 2] = waveY * (waveHeight * 10); 
        }
        geo.attributes.position.needsUpdate = true;
        geo.computeVertexNormals(); 
    });

    if (reflectorConfig)
        return (
            <mesh
                ref={meshRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[centerX, waterLevel, centerZ]}
            >
                <circleGeometry args={[waterSize / 1.5, 128]} />
                <MeshReflectorMaterial
                    mirror={0.75}
                    mixBlur={0.8}
                    color={waterColor}
                    transparent
                    opacity={waterOpacity}
                    depthScale={1.2}
                    mixStrength={0.6}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    blur={reflectorConfig.blur}
                    resolution={reflectorConfig.resolution}
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>
        );

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[centerX, waterLevel, centerZ]}
            renderOrder={1}
        >
            <circleGeometry args={[waterSize / 1.5, 128]} />
            <meshPhongMaterial
                transparent
                shininess={120}
                color={waterColor}
                depthWrite={false}
                opacity={waterOpacity}
                side={THREE.DoubleSide}
                specular={new THREE.Color('#ffffff')}
            />
        </mesh>
    );
}
