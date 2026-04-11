// -Path: "PokeRotom/client/src/screen/game/player/OtherPlayer.tsx"
'use client';
import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { Billboard, Text } from '@react-three/drei';
import PlayerModel from './PlayerModel';
import { useFrame } from '@react-three/fiber';
import type { RemotePlayer } from '$/stores/socketStore';
import type { RapierRigidBody } from '@react-three/rapier';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';

interface OtherPlayerProps {
    player: RemotePlayer;
}

export default function OtherPlayer({ player }: OtherPlayerProps) {
    const modelRef = useRef<THREE.Group>(null);
    const rbRef = useRef<RapierRigidBody>(null);

    const targetPosition = useRef(
        new THREE.Vector3(
            player.position.x,
            player.position.y,
            player.position.z,
        ),
    );
    const targetRotationY = useRef(player.rotation.y);
    const currentPos = useRef(
        new THREE.Vector3(
            player.position.x,
            player.position.y,
            player.position.z,
        ),
    );

    // ตั้งค่าเริ่มต้นครั้งแรกเมื่อโหลดคอมโพเนนต์
    useEffect(() => {
        if (rbRef.current) {
            rbRef.current.setTranslation(targetPosition.current, true);
        }
    }, []);

    useFrame((_, delta) => {
        if (!rbRef.current || !modelRef.current) return;

        targetPosition.current.set(
            player.position.x,
            player.position.y,
            player.position.z,
        );
        targetRotationY.current = player.rotation.y;

        const LERP_FACTOR = 12;

        // คำนวณตำแหน่งใหม่ด้วย Lerp
        if (currentPos.current.distanceTo(targetPosition.current) > 5) {
            currentPos.current.copy(targetPosition.current);
        } else {
            currentPos.current.lerp(
                targetPosition.current,
                LERP_FACTOR * delta,
            );
        }

        // อัปเดตตำแหน่ง Physics (Kinematic)
        rbRef.current.setNextKinematicTranslation(currentPos.current);

        // หมุนโมเดล
        const currentY = modelRef.current.rotation.y;
        const targetY = targetRotationY.current;
        const angleDiff = Math.atan2(
            Math.sin(targetY - currentY),
            Math.cos(targetY - currentY),
        );
        modelRef.current.rotation.y += angleDiff * LERP_FACTOR * delta;
    });

    return (
        <RigidBody ref={rbRef} type="kinematicPosition" colliders={false}>
            <CapsuleCollider args={[0.5, 0.4]} position={[0, 0.9, 0]} />

            {/* Username - ใช้ Billboard เพื่อให้หันตามกล้องตลอดเวลา */}
            <Billboard position={[0, 2.8, 0]}>
                <Text
                    fontSize={0.3}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="bottom"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                >
                    {player.username || 'Player'}
                </Text>
            </Billboard>

            {/* ใช้ PlayerModel ร่วมกันและส่งสีโทนน้ำเงินสำหรับผู้เล่นคนอื่น */}
            <PlayerModel
                ref={modelRef}
                bodyColor="#3a8ae8"
                hatColor="#3060c0"
                legColor="#2a2a5a"
            />
        </RigidBody>
    );
}
