// -Path: "PokeRotom/client/src/screen/game/world/Trees.tsx"
'use client';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThemeStore } from '$/stores/themeStore';

const TREE_COUNT = 80;
const TERRAIN_SIZE = 200;

interface TreeData {
    position: [number, number, number];
    scale: number;
    rotation: number;
}

export default function Trees() {
    const groupRef = useRef<THREE.Group>(null);
    const theme = useThemeStore((state) => state.theme);

    const leafColor = theme === 'dark' ? '#0d4a0d' : '#2d8a2d';
    const trunkColor = theme === 'dark' ? '#3a2a1a' : '#6b4423';

    const trees = useMemo<TreeData[]>(() => {
        const result: TreeData[] = [];
        for (let index = 0; index < TREE_COUNT; index++) {
            const posX = (Math.random() - 0.5) * TERRAIN_SIZE * 0.85;
            const posZ = (Math.random() - 0.5) * TERRAIN_SIZE * 0.85;
            const distFromCenter = Math.sqrt(posX * posX + posZ * posZ);

            if (distFromCenter < 15) continue;

            const heightY =
                Math.sin(posX * 0.05) * 1.5 +
                Math.cos(posZ * 0.08) * 1.0 +
                Math.sin(posX * 0.02 + posZ * 0.03) * 2.0;

            result.push({
                position: [posX, heightY - 0.5, posZ],
                scale: 0.8 + Math.random() * 1.2,
                rotation: Math.random() * Math.PI * 2,
            });
        }
        return result;
    }, []);

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        groupRef.current.children.forEach((tree, index) => {
            const leaves = tree.children[1];
            if (leaves)
                leaves.rotation.y +=
                    Math.sin(Date.now() * 0.001 + index) * delta * 0.1;
        });
    });

    return (
        <group ref={groupRef}>
            {trees.map((tree, index) => (
                <group
                    key={index}
                    position={tree.position}
                    scale={tree.scale}
                    rotation={[0, tree.rotation, 0]}
                >
                    {/* Trunk */}
                    <mesh castShadow position={[0, 1.5, 0]}>
                        <cylinderGeometry args={[0.2, 0.35, 3, 8]} />
                        <meshStandardMaterial
                            color={trunkColor}
                            roughness={0.9}
                        />
                    </mesh>
                    {/* Leaves */}
                    <mesh castShadow position={[0, 4, 0]}>
                        <coneGeometry args={[2, 4, 8]} />
                        <meshStandardMaterial
                            color={leafColor}
                            roughness={0.8}
                        />
                    </mesh>
                    <mesh castShadow position={[0, 5.5, 0]}>
                        <coneGeometry args={[1.5, 3, 8]} />
                        <meshStandardMaterial
                            color={leafColor}
                            roughness={0.8}
                        />
                    </mesh>
                </group>
            ))}
        </group>
    );
}
