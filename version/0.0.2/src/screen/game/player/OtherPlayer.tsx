// -Path: "PokeRotom/client/src/screen/game/player/OtherPlayer.tsx"
'use client';
import * as THREE from 'three';
import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { RemotePlayer } from '$/stores/socketStore';

interface OtherPlayerProps {
    player: RemotePlayer;
}

export default function OtherPlayer({ player }: OtherPlayerProps) {
    const groupRef = useRef<THREE.Group>(null);

    const targetPosition = useRef(
        new THREE.Vector3(
            player.position.x,
            player.position.y,
            player.position.z,
        ),
    );
    const targetRotationY = useRef(player.rotation.y);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        targetPosition.current.set(
            player.position.x,
            player.position.y,
            player.position.z,
        );
        targetRotationY.current = player.rotation.y;

        groupRef.current.position.lerp(targetPosition.current, 8 * delta);

        const currentY = groupRef.current.rotation.y;
        const targetY = targetRotationY.current;
        const angleDiff = Math.atan2(
            Math.sin(targetY - currentY),
            Math.cos(targetY - currentY),
        );
        groupRef.current.rotation.y += angleDiff * 8 * delta;
    });

    return (
        <group
            ref={groupRef}
            position={[player.position.x, player.position.y, player.position.z]}
        >
            {/* Username */}
            <Text
                fontSize={0.3}
                color="#ffffff"
                position={[0, 2.8, 0]}
                anchorX="center"
                anchorY="bottom"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                {player.username || 'Player'}
            </Text>

            {/* Body */}
            <mesh castShadow position={[0, 1.0, 0]}>
                <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
                <meshStandardMaterial color="#3a8ae8" roughness={0.6} />
            </mesh>
            {/* Head */}
            <mesh castShadow position={[0, 1.9, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#ffd4a3" roughness={0.5} />
            </mesh>
            {/* Eyes */}
            <mesh position={[0.1, 1.95, 0.25]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[-0.1, 1.95, 0.25]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            {/* Hat (blue) */}
            <mesh castShadow position={[0, 2.15, 0]}>
                <cylinderGeometry args={[0.35, 0.35, 0.15, 16]} />
                <meshStandardMaterial color="#3060c0" roughness={0.4} />
            </mesh>
            <mesh castShadow position={[0, 2.25, 0]}>
                <sphereGeometry
                    args={[0.33, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]}
                />
                <meshStandardMaterial color="#3060c0" roughness={0.4} />
            </mesh>
            {/* Arms */}
            <mesh castShadow position={[0.5, 0.95, 0]}>
                <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
                <meshStandardMaterial color="#3a8ae8" roughness={0.6} />
            </mesh>
            <mesh castShadow position={[-0.5, 0.95, 0]}>
                <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
                <meshStandardMaterial color="#3a8ae8" roughness={0.6} />
            </mesh>
            {/* Legs */}
            <mesh castShadow position={[0.15, 0.25, 0]}>
                <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
                <meshStandardMaterial color="#2a2a5a" roughness={0.7} />
            </mesh>
            <mesh castShadow position={[-0.15, 0.25, 0]}>
                <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
                <meshStandardMaterial color="#2a2a5a" roughness={0.7} />
            </mesh>
        </group>
    );
}
