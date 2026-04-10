// -Path: "PokeRotom/client/src/screen/game/world/Terrain.tsx"
'use client';
import * as THREE from 'three';
import { useMemo } from 'react';
import { useThemeStore } from '$/stores/themeStore';
import { RigidBody, CuboidCollider } from '@react-three/rapier';

const TERRAIN_SIZE = 200;
const TERRAIN_SEGMENTS = 64;

export default function Terrain() {
    const { theme } = useThemeStore();

    const grassColor = theme === 'dark' ? '#1a3a1a' : '#4a8f3c';
    const grassColor2 = theme === 'dark' ? '#0d2b0d' : '#5aad4a';

    const grassTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        if (!context) return null;

        context.fillStyle = grassColor;
        context.fillRect(0, 0, 256, 256);

        for (let index = 0; index < 3000; index++) {
            const posX = Math.random() * 256;
            const posY = Math.random() * 256;
            context.fillStyle = Math.random() > 0.5 ? grassColor2 : '#3a7a2a';
            context.fillRect(posX, posY, 2, 4);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(20, 20);
        return texture;
    }, [grassColor, grassColor2]);

    return (
        <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
            <CuboidCollider
                args={[TERRAIN_SIZE / 2, 0.1, TERRAIN_SIZE / 2]}
                position={[0, -0.1, 0]}
            />
            <mesh
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
            >
                <planeGeometry
                    args={[
                        TERRAIN_SIZE,
                        TERRAIN_SIZE,
                        TERRAIN_SEGMENTS,
                        TERRAIN_SEGMENTS,
                    ]}
                />
                <meshStandardMaterial
                    map={grassTexture}
                    color={grassColor}
                    roughness={0.9}
                    metalness={0.0}
                />
            </mesh>
        </RigidBody>
    );
}
