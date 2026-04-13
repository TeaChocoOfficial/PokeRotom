// -Path: "PokeRotom/client/src/screen/game/player/OtherPlayer.tsx"
'use client';
import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import BoardText from '../entity/BoardText';
import { useFrame } from '@react-three/fiber';
import PlayerModel from '../entity/PlayerModel';
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

        const currentTranslation = rbRef.current.translation();
        const dist = targetPosition.current.distanceTo(
            new THREE.Vector3(
                currentTranslation.x,
                currentTranslation.y,
                currentTranslation.z,
            ),
        );

        // เทเลพอร์ตถ้าผู้เล่นอยู่ไกลเกินไป
        if (dist > 5) {
            rbRef.current.setTranslation(targetPosition.current, true);
        } else {
            // อัปเดตตำแหน่ง Physics (Dynamic) ด้วย Linear Velocity เพื่อให้โดนชนและผลักได้
            rbRef.current.setLinvel(
                {
                    x:
                        (targetPosition.current.x - currentTranslation.x) *
                        LERP_FACTOR,
                    y:
                        (targetPosition.current.y - currentTranslation.y) *
                        LERP_FACTOR,
                    z:
                        (targetPosition.current.z - currentTranslation.z) *
                        LERP_FACTOR,
                },
                true,
            );
        }

        // หมุนโมเดล
        const currentQuat = rbRef.current.rotation();
        const currentEuler = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion(
                currentQuat.x,
                currentQuat.y,
                currentQuat.z,
                currentQuat.w,
            ),
            'YXZ',
        );
        const currentY = currentEuler.y;
        const targetY = targetRotationY.current;
        const angleDiff = Math.atan2(
            Math.sin(targetY - currentY),
            Math.cos(targetY - currentY),
        );
        const newRotationY = currentY + angleDiff * LERP_FACTOR * delta;
        rbRef.current.setRotation(
            new THREE.Quaternion().setFromEuler(
                new THREE.Euler(0, newRotationY, 0, 'YXZ'),
            ),
            true,
        );
    });

    return (
        <RigidBody
            ref={rbRef}
            mass={1}
            colliders={false}
            linearDamping={4}
            enabledRotations={[false, false, false]}
        >
            <CapsuleCollider args={[0.95, 0.4]} position={[0, 1.25, 0]} />
            {/* Username - ใช้ Billboard เพื่อให้หันตามกล้องตลอดเวลา */}
            <BoardText
                position={[0, 2.8, 0]}
                text={player.username || 'Player'}
            />

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
