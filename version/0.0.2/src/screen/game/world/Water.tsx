// -Path: "PokeRotom/client/src/screen/game/world/Water.tsx"
'use client';
import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThemeStore } from '$/stores/themeStore';

export default function Water() {
    const meshRef = useRef<THREE.Mesh>(null);
    const theme = useThemeStore((state) => state.theme);

    const waterColor = theme === 'dark' ? '#0a2a4a' : '#3a8abf';

    useFrame((state) => {
        if (!meshRef.current) return;
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        meshRef.current.position.y =
            -1.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    });

    return (
        <group>
            {/* Main lake */}
            <mesh
                ref={meshRef}
                receiveShadow
                position={[40, -1.5, -30]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[20, 32]} />
                <meshStandardMaterial
                    color={waterColor}
                    transparent
                    opacity={0.75}
                    roughness={0.1}
                    metalness={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Small pond */}
            <mesh
                receiveShadow
                position={[-50, -1.8, 40]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[10, 24]} />
                <meshStandardMaterial
                    color={waterColor}
                    transparent
                    opacity={0.7}
                    roughness={0.1}
                    metalness={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* River strip */}
            <mesh
                receiveShadow
                position={[-20, -1.6, 0]}
                rotation={[-Math.PI / 2, 0, Math.PI / 6]}
            >
                <planeGeometry args={[5, 60]} />
                <meshStandardMaterial
                    color={waterColor}
                    transparent
                    opacity={0.7}
                    roughness={0.1}
                    metalness={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}
