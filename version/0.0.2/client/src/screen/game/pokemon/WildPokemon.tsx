// -Path: "PokeRotom/client/src/screen/game/pokemon/WildPokemon.tsx"
'use client';
import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';

interface WildPokemonProps {
    position: [number, number, number];
    name: string;
    pokemonId: number;
}

export default function WildPokemon({
    name,
    position,
    pokemonId,
}: WildPokemonProps) {
    const groupRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.position.y =
            position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.5;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;

        if (glowRef.current) {
            const scale = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
            glowRef.current.scale.set(scale, scale, scale);
        }
    });

    /** @description สีตาม pokemonId แบบ hash */
    const hue = (pokemonId * 137) % 360;
    const bodyColor = `hsl(${hue}, 70%, 55%)`;
    const glowColor = `hsl(${hue}, 80%, 70%)`;

    return (
        <group ref={groupRef} position={position}>
            <Billboard>
                <Text
                    fontSize={0.35}
                    color="#ffffff"
                    position={[0, 1.8, 0]}
                    anchorX="center"
                    anchorY="bottom"
                    outlineWidth={0.03}
                    outlineColor="#000000"
                    font="/fonts/Inter-Bold.woff"
                >
                    {name}
                </Text>
            </Billboard>

            {/* Glow effect */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.9, 16, 16]} />
                <meshStandardMaterial
                    color={glowColor}
                    transparent
                    opacity={0.15}
                    emissive={glowColor}
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Pokemon body placeholder */}
            <mesh castShadow>
                <sphereGeometry args={[0.6, 16, 16]} />
                <meshStandardMaterial
                    color={bodyColor}
                    roughness={0.4}
                    metalness={0.1}
                    emissive={bodyColor}
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Eyes */}
            <mesh position={[0.2, 0.15, 0.5]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.2, 0.15, 0.5]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.2, 0.15, 0.55]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-0.2, 0.15, 0.55]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Ears/features */}
            <mesh castShadow position={[0.3, 0.55, 0]}>
                <coneGeometry args={[0.15, 0.4, 6]} />
                <meshStandardMaterial color={bodyColor} roughness={0.4} />
            </mesh>
            <mesh castShadow position={[-0.3, 0.55, 0]}>
                <coneGeometry args={[0.15, 0.4, 6]} />
                <meshStandardMaterial color={bodyColor} roughness={0.4} />
            </mesh>
        </group>
    );
}
