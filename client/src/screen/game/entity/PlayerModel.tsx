// -Path: "PokeRotom/client/src/screen/game/player/PlayerModel.tsx"
'use client';
import * as THREE from 'three';
import { forwardRef } from 'react';
import Solidify from '$/screen/model/Solidify';

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
                    <meshToonMaterial color={bodyColor} />
                    <Solidify thickness={0.03} />
                </mesh>
                {/* Head */}
                <mesh castShadow position={[0, 1.9, 0]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshToonMaterial color="#ffd4a3" />
                    <Solidify thickness={0.03} />
                </mesh>
                {/* Eyes */}
                <mesh position={[0.1, 1.95, 0.25]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshToonMaterial color="#222" />
                </mesh>
                <mesh position={[-0.1, 1.95, 0.25]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshToonMaterial color="#222" />
                </mesh>
                {/* Hat */}
                <mesh castShadow position={[0, 2.15, 0]}>
                    <cylinderGeometry args={[0.35, 0.35, 0.15, 16]} />
                    <meshToonMaterial color={hatColor} />
                    <Solidify thickness={0.03} />
                </mesh>
                <mesh castShadow position={[0, 2.25, 0]}>
                    <sphereGeometry
                        args={[0.33, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]}
                    />
                    <meshToonMaterial color={hatColor} />
                    <Solidify thickness={0.03} />
                </mesh>
                {/* Arms */}
                <mesh castShadow position={[0.5, 0.95, 0]}>
                    <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
                    <meshToonMaterial color={bodyColor} />
                    <Solidify thickness={0.03} />
                </mesh>
                <mesh castShadow position={[-0.5, 0.95, 0]}>
                    <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
                    <meshToonMaterial color={bodyColor} />
                    <Solidify thickness={0.03} />
                </mesh>
                {/* Legs */}
                <mesh castShadow position={[0.15, 0.25, 0]}>
                    <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
                    <meshToonMaterial color={legColor} />
                    <Solidify thickness={0.03} />
                </mesh>
                <mesh castShadow position={[-0.15, 0.25, 0]}>
                    <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
                    <meshToonMaterial color={legColor} />
                    <Solidify thickness={0.03} />
                </mesh>
            </group>
        );
    },
);

export default PlayerModel;
