// -Path: "PokeRotom/client/src/screen/game/player/Player.tsx"
import * as THREE from 'three';
import { useControls } from 'leva';
import PlayerModel from './PlayerModel';
import { useRef, useEffect } from 'react';
import useChunk from '../world/hooks/chunk';
import { useGameStore } from '$/stores/gameStore';
import { useSocketStore } from '$/stores/socketStore';
import { useCameraStore } from '$/stores/cameraStore';
import { usePlayerInput } from '$/hooks/usePlayerInput';
import { useFrame, useThree } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';

export default function Player({ debug }: { debug?: boolean }) {
    const { camera, scene } = useThree();
    const lastEmitTime = useRef(0);
    const keysRef = usePlayerInput();
    const { getPlayerChunk } = useChunk();
    const meshRef = useRef<THREE.Group>(null);
    const { emitPlayerMove } = useSocketStore();
    const bodyRef = useRef<RapierRigidBody>(null);
    const smoothLookAt = useRef(new THREE.Vector3(0, 1.5, 0));
    const smoothCamPos = useRef(new THREE.Vector3(0, 12, 14));
    const { yaw, offset, lookOffset, lerpSpeed } = useCameraStore();
    const { setPlayerPosition, setMovementState, setPlayerChunk } =
        useGameStore();
    const { rapier, world } = useRapier();
    const rayHelperRef = useRef<THREE.ArrowHelper | null>(null);

    useEffect(() => {
        if (debug) {
            rayHelperRef.current = new THREE.ArrowHelper(
                new THREE.Vector3(0, -1, 0),
                new THREE.Vector3(0, 0, 0),
                0.5,
                0xff0000,
            );
            scene.add(rayHelperRef.current);
            return () => {
                if (rayHelperRef.current) scene.remove(rayHelperRef.current);
            };
        }
    }, [debug, scene]);

    const { walkSpeed, jumpForce, shiftSpeed } = useControls('player', {
        walkSpeed: { value: 5, min: 0, max: 100, step: 1 },
        jumpForce: { value: 20, min: 0, max: 100, step: 1 },
        shiftSpeed: { value: 10, min: 0, max: 100, step: 1 },
    });

    useFrame((_, delta) => {
        if (!bodyRef.current || !meshRef.current) return;

        const keys = keysRef.current;
        const speed = keys.shift ? shiftSpeed : walkSpeed;
        const isMoving =
            keys.forward || keys.backward || keys.left || keys.right;

        /** @description คำนวณทิศทางการเดืนอิงตามมุมกล้อง (ใช้ yaw จาก cameraStore) */
        const forward = new THREE.Vector3(
            -Math.sin(yaw),
            0,
            -Math.cos(yaw),
        ).normalize();
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

            const currentQuat = bodyRef.current.rotation();
            const currentEuler = new THREE.Euler().setFromQuaternion(
                new THREE.Quaternion(
                    currentQuat.x,
                    currentQuat.y,
                    currentQuat.z,
                    currentQuat.w,
                ),
                'YXZ',
            );
            const currentRot = currentEuler.y;

            const diff = Math.atan2(
                Math.sin(targetAngle - currentRot),
                Math.cos(targetAngle - currentRot),
            );

            const newRotationY = currentRot + diff * speed * 2 * delta;
            bodyRef.current.setRotation(
                new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(0, newRotationY, 0, 'YXZ'),
                ),
                true,
            );
        }

        const translation = bodyRef.current.translation();

        /** @description ตรวจสอบว่ายืนอยู่บนพื้นหรือไม่ (Raycast ลงพื้นระยะ 0.2 หน่วย) */
        const rayOrigin = {
            x: translation.x,
            y: translation.y + 0.1,
            z: translation.z,
        };
        const rayDir = { x: 0, y: -1, z: 0 };
        const ray = new rapier.Ray(rayOrigin, rayDir);
        const hit = world.castRay(
            ray,
            0.5,
            true,
            undefined,
            undefined,
            undefined,
            bodyRef.current,
        );
        const isGrounded = hit !== null;

        if (rayHelperRef.current) {
            rayHelperRef.current.position.set(
                rayOrigin.x,
                rayOrigin.y,
                rayOrigin.z,
            );
            rayHelperRef.current.setColor(isGrounded ? 0x00ff00 : 0xff0000);
        }

        const currentVel = bodyRef.current.linvel();
        let newVelY = currentVel.y;
        if (keys.jump && isGrounded) newVelY = jumpForce; // Jump velocity

        /** @description Update Physics */
        bodyRef.current.setLinvel(
            {
                x: isMoving ? direction.x * speed : 0,
                y: newVelY,
                z: isMoving ? direction.z * speed : 0,
            },
            true,
        );

        const playerPosition = new THREE.Vector3(
            translation.x,
            translation.y,
            translation.z,
        );
        setPlayerPosition(playerPosition);

        const movementState = !isMoving
            ? 'idle'
            : keys.shift
              ? 'running'
              : 'walking';
        setMovementState(movementState);

        const playerChunk = getPlayerChunk(playerPosition);
        setPlayerChunk(playerChunk);

        /** @description กล้องติดตามตัวละคร (Smooth Follow) - ปิดถ้าอยู่ในโหมด debug เพื่อให้ OrbitControls ทำงานได้ */
        if (!debug) {
            const rotatedOffset = offset
                .clone()
                .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
            const targetCamPos = new THREE.Vector3(
                translation.x + rotatedOffset.x,
                translation.y + rotatedOffset.y,
                translation.z + rotatedOffset.z,
            );
            const targetLookAt = new THREE.Vector3(
                translation.x + lookOffset.x,
                translation.y + lookOffset.y,
                translation.z + lookOffset.z,
            );

            smoothCamPos.current.lerp(targetCamPos, lerpSpeed * delta);
            smoothLookAt.current.lerp(targetLookAt, lerpSpeed * delta);

            camera.position.copy(smoothCamPos.current);
            camera.lookAt(smoothLookAt.current);
        }

        /** @description ส่งตำแหน่งไปยัง Socket (throttle 15 ครั้ง/วินาที) */
        const now = Date.now();
        if (now - lastEmitTime.current > 66) {
            lastEmitTime.current = now;
            const currentQuat = bodyRef.current.rotation();
            const currentEuler = new THREE.Euler().setFromQuaternion(
                new THREE.Quaternion(
                    currentQuat.x,
                    currentQuat.y,
                    currentQuat.z,
                    currentQuat.w,
                ),
                'YXZ',
            );

            emitPlayerMove({
                position: {
                    x: translation.x,
                    y: translation.y,
                    z: translation.z,
                },
                rotation: { x: 0, y: currentEuler.y, z: 0 },
                movementState,
            });
        }
    });

    return (
        <RigidBody
            ref={bodyRef}
            mass={1}
            colliders={false}
            linearDamping={4}
            position={[0, 5, 0]}
            enabledRotations={[false, false, false]}
        >
            <CapsuleCollider args={[0.95, 0.4]} position={[0, 1.25, 0]} />
            <PlayerModel ref={meshRef} />
        </RigidBody>
    );
}
