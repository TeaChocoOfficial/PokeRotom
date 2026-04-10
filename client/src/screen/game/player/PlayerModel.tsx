// -Path: "PokeRotom/client/src/screen/game/player/PlayerModel.tsx"
'use client';
import * as THREE from 'three';
import { forwardRef } from 'react';

interface PlayerModelProps {
    legColor?: string;
    hatColor?: string;
    bodyColor?: string;
}

/** @description โมเดลตัวละครผู้เล่น (Placeholder) */
const PlayerModel = forwardRef<THREE.Group, PlayerModelProps>(
    function PlayerModel(
        { bodyColor = '#e85d3a', hatColor = '#c43030', legColor = '#2255aa' },
        ref,
    ) {
        return (
            <group ref={ref}>
                {/* Body */}
                <mesh castShadow position={[0, 1.0, 0]}>
                    <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
                    <meshStandardMaterial color={bodyColor} roughness={0.6} />
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
                {/* Hat */}
                <mesh castShadow position={[0, 2.15, 0]}>
                    <cylinderGeometry args={[0.35, 0.35, 0.15, 16]} />
                    <meshStandardMaterial color={hatColor} roughness={0.4} />
                </mesh>
                <mesh castShadow position={[0, 2.25, 0]}>
                    <sphereGeometry
                        args={[0.33, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]}
                    />
                    <meshStandardMaterial color={hatColor} roughness={0.4} />
                </mesh>
                {/* Arms */}
                <mesh castShadow position={[0.5, 0.95, 0]}>
                    <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
                    <meshStandardMaterial color={bodyColor} roughness={0.6} />
                </mesh>
                <mesh castShadow position={[-0.5, 0.95, 0]}>
                    <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
                    <meshStandardMaterial color={bodyColor} roughness={0.6} />
                </mesh>
                {/* Legs */}
                <mesh castShadow position={[0.15, 0.25, 0]}>
                    <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
                    <meshStandardMaterial color={legColor} roughness={0.7} />
                </mesh>
                <mesh castShadow position={[-0.15, 0.25, 0]}>
                    <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
                    <meshStandardMaterial color={legColor} roughness={0.7} />
                </mesh>
            </group>
        );
    },
);


export default PlayerModel;
