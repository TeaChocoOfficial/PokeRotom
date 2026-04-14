// -Path: "PokeRotom/client/src/screen/game/world/Lighting.tsx"
import * as THREE from 'three';
import useChunk from './hooks/chunk';
import { button, useControls } from 'leva';
import { useGameStore } from '$/stores/gameStore';
import { useEffect, useMemo, useRef } from 'react';
import { ContactShadows, Environment, Sky } from '@react-three/drei';
import { useFrame, type Vector3 } from '@react-three/fiber';

export default function Lighting() {
    const { CHUNK_SIZE } = useChunk();
    const groupRef = useRef<THREE.Group>(null);
    const { time, player, setTime, addTime } = useGameStore();

    useControls('world', {
        daytime: {
            min: 0,
            max: 2400,
            step: 50,
            value: 1500,
        },
        setDayTime: button((get) => setTime(get('world.daytime'))),
    });

    const sunDistance = 800;
    const hour = (time / 100) % 24;
    const isNight = hour < 6 || hour > 18;
    const sunIntensity = isNight ? 0.4 : 1.5;
    const ambientIntensity = isNight ? 0.2 : 0.6;
    const fogColor = isNight ? '#020205' : '#4fa8ff';

    /** @description คำนวณตำแหน่งดวงอาทิตย์และดวงจันทร์ (X: ซ้าย-ขวา, Y: บน-ล่าง) */
    const [sunPosition, moonPosition]: [Vector3, Vector3] = useMemo(
        () => [
            [
                Math.cos((hour / 24) * Math.PI * 2 - Math.PI / 2) * sunDistance,
                Math.sin((hour / 24) * Math.PI * 2 - Math.PI / 2) * sunDistance,
                0,
            ],
            [
                Math.cos((hour / 24) * Math.PI * 2 + Math.PI / 2) * sunDistance,
                Math.sin((hour / 24) * Math.PI * 2 + Math.PI / 2) * sunDistance,
                0,
            ],
        ],
        [hour],
    );

    useEffect(() => {
        const now = new Date();
        const initialTime =
            now.getHours() * 100 +
            (now.getMinutes() / 60) * 100 +
            (now.getSeconds() / 3600) * 100;

        setTime(initialTime);
    }, [setTime]);

    useFrame((_, delta) => {
        /** @description อัปเดตเวลาให้เดินไปเรื่อยๆ (2400 หน่วย / 86400 วินาทีใน 1 วัน) */
        addTime(delta * (2400 / 86400));

        if (groupRef.current) {
            groupRef.current.position.set(
                player.position.x,
                0,
                player.position.z,
            );
        }
    });

    return (
        <group ref={groupRef}>
            <Environment preset="sunset" />
            <color attach="background" args={[fogColor]} />
            <Sky sunPosition={sunPosition} turbidity={CHUNK_SIZE * 0.1} />

            {/* Moon */}
            <mesh position={moonPosition} name="moon">
                <sphereGeometry args={[25, 32, 32]} />
                <meshStandardMaterial
                    fog={false}
                    color="#f0f0ff"
                    emissive="#f0f0ff"
                    emissiveIntensity={2}
                />
                <pointLight intensity={100} distance={2000} />
            </mesh>

            {/* Lighting */}
            <ambientLight intensity={ambientIntensity} />
            <directionalLight
                castShadow
                intensity={sunIntensity}
                position={sunPosition[1] > 0 ? sunPosition : moonPosition}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={2000}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
            />

            {isNight && (
                <hemisphereLight
                    color="#112244"
                    groundColor="#000000"
                    intensity={0.5}
                />
            )}
            {/* เงาพื้นแบบนุ่มนวลเพื่อความ Premium */}
            <ContactShadows
                scale={15}
                opacity={0.4}
                blur={2.5}
                far={10}
                resolution={512}
                position={[0, 0, 0]}
            />
        </group>
    );
}
