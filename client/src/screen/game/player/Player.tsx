// -Path: "PokeRotom/client/src/screen/game/player/Player.tsx"
'use client';
import * as THREE from 'three';
import { useRef } from 'react';
import PlayerModel from './PlayerModel';
import { useGameStore } from '$/stores/gameStore';
import { useSocketStore } from '$/stores/socketStore';
import { useCameraStore } from '$/stores/cameraStore';
import { usePlayerInput } from '$/hooks/usePlayerInput';
import { useFrame, useThree } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';

const PLAYER_ROT_SPEED = 12;

export default function Player() {
    const { camera } = useThree();
    const lastEmitTime = useRef(0);
    const keysRef = usePlayerInput();
    const meshRef = useRef<THREE.Group>(null);
    const { emitPlayerMove } = useSocketStore();
    const bodyRef = useRef<RapierRigidBody>(null);
    const smoothCamPos = useRef(new THREE.Vector3(0, 12, 14));
    const smoothLookAt = useRef(new THREE.Vector3(0, 1.5, 0));
    const { yaw, offset, lookOffset, lerpSpeed } = useCameraStore();
    const { setPlayerPosition, setMovementState } = useGameStore();

    useFrame((_, delta) => {
        if (!bodyRef.current || !meshRef.current) return;

        const keys = keysRef.current;
        const speed = keys.shift ? 10 : 5;
        const isMoving = keys.forward || keys.backward || keys.left || keys.right;

        /** @description คำนวณทิศทางการเดืนอิงตามมุมกล้อง (ใช้ yaw จาก cameraStore) */
        const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
        const right = new THREE.Vector3(-forward.z, 0, forward.x).normalize();

        const direction = new THREE.Vector3();
        if (keys.forward) direction.add(forward);
        if (keys.backward) direction.sub(forward);
        if (keys.right) direction.add(right);
        if (keys.left) direction.sub(right);

        /** @description หมุนตัวละครไปตามทิศทางที่เดิน (smooth) */
        if (direction.length() > 0) {
            direction.normalize();
            const targetAngle = Math.atan2(direction.x, direction.z);
            const currentRot = meshRef.current.rotation.y;
            const diff = Math.atan2(Math.sin(targetAngle - currentRot), Math.cos(targetAngle - currentRot));
            meshRef.current.rotation.y += diff * PLAYER_ROT_SPEED * delta;
        }

        const translation = bodyRef.current.translation();

        /** @description Update Physics */
        bodyRef.current.setLinvel(
            {
                x: isMoving ? direction.x * speed : 0,
                y: bodyRef.current.linvel().y,
                z: isMoving ? direction.z * speed : 0,
            },
            true,
        );

        setPlayerPosition(new THREE.Vector3(translation.x, translation.y, translation.z));

        const movementState = !isMoving ? 'idle' : keys.shift ? 'running' : 'walking';
        setMovementState(movementState);

        /** @description กล้องติดตามตัวละคร (Smooth Follow) */
        const rotatedOffset = offset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        const targetCamPos = new THREE.Vector3(
            translation.x + rotatedOffset.x,
            translation.y + rotatedOffset.y,
            translation.z + rotatedOffset.z
        );
        const targetLookAt = new THREE.Vector3(
            translation.x + lookOffset.x,
            translation.y + lookOffset.y,
            translation.z + lookOffset.z
        );

        smoothCamPos.current.lerp(targetCamPos, lerpSpeed * delta);
        smoothLookAt.current.lerp(targetLookAt, lerpSpeed * delta);

        camera.position.copy(smoothCamPos.current);
        camera.lookAt(smoothLookAt.current);

        /** @description ส่งตำแหน่งไปยัง Socket (throttle 15 ครั้ง/วินาที) */
        const now = Date.now();
        if (now - lastEmitTime.current > 66) {
            lastEmitTime.current = now;
            emitPlayerMove({
                position: { x: translation.x, y: translation.y, z: translation.z },
                rotation: { x: 0, y: meshRef.current.rotation.y, z: 0 },
                movementState,
            });
        }
    });

    return (
        <RigidBody
            ref={bodyRef}
            mass={1}
            position={[0, 5, 0]}
            linearDamping={4}
            enabledRotations={[false, false, false]}
        >
            <CapsuleCollider args={[0.5, 0.4]} position={[0, 0.9, 0]} />
            <PlayerModel ref={meshRef} />
        </RigidBody>
    );
}
