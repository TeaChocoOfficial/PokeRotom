// -Path: "PokeRotom/client/src/screen/game/player/Player.tsx"
import * as THREE from 'three';
import { button, useControls } from 'leva';
import useChunk from '../world/hooks/chunk';
import useNoise from '../world/hooks/noise';
import PlayerModel from '../entity/PlayerModel';
import { useGameStore } from '$/stores/gameStore';
import { useSocketStore } from '$/stores/socketStore';
import { useCameraStore } from '$/stores/cameraStore';
import { usePlayerInput } from '$/hooks/usePlayerInput';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useTransition } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';

export default function Player({
    seed,
    debug,
}: {
    seed: string;
    debug?: boolean;
}) {
    const {
        isPointerLocked,
        chunk,
        setPlayerChunk,
        setMovementState,
        setPlayerPosition,
        setIsPointerLocked,
    } = useGameStore();
    const lastEmitTime = useRef(0);
    const keysRef = usePlayerInput();
    const { camera, scene } = useThree();
    const { getPlayerChunk } = useChunk();
    const meshRef = useRef<THREE.Group>(null);
    const { emitPlayerMove } = useSocketStore();
    const [_, startTransition] = useTransition();
    const bodyRef = useRef<RapierRigidBody>(null);
    const smoothLookAt = useRef(new THREE.Vector3(0, 1.5, 0));
    const smoothCamPos = useRef(new THREE.Vector3(0, 12, 14));
    const isFlying = useRef(false);
    const jumpHoldTime = useRef(0);
    const { yaw, pitch, offset, addRotation, lookOffset, lerpSpeed } =
        useCameraStore();
    const { getTerrainHeight } = useNoise(seed);
    const { rapier, world } = useRapier();
    const rayHelperRef = useRef<THREE.ArrowHelper | null>(null);

    const {
        canFly,
        walkSpeed,
        jumpForce,
        flySpeed,
        shiftSpeed,
        flyBoostSpeed,
    } = useControls('player', {
        canFly: true,
        walkSpeed: { value: 5, min: 0, max: 100, step: 1 },
        flySpeed: { value: 20, min: 0, max: 100, step: 1 },
        flyBoostSpeed: { value: 60, min: 0, max: 200, step: 1 },
        jumpForce: { value: 20, min: 0, max: 100, step: 1 },
        shiftSpeed: { value: 10, min: 0, max: 100, step: 1 },
        reset: button(() => {
            if (bodyRef.current) {
                bodyRef.current.setTranslation({ x: 0, y: 5, z: 0 }, true);
                bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            }
        }),
    });

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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'F1') {
                event.preventDefault();
                setIsPointerLocked(!isPointerLocked);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPointerLocked, setIsPointerLocked]);

    useEffect(() => {
        const mouseRotation = (event: MouseEvent) => {
            const isDragging = (event.buttons & 1) !== 0;
            if (isPointerLocked || isDragging) {
                addRotation(-event.movementX * 0.002, -event.movementY * 0.002);
            }
        };

        window.addEventListener('mousemove', mouseRotation);
        if (isPointerLocked) document.body.requestPointerLock?.();
        else if (document.pointerLockElement === document.body) {
            document.exitPointerLock?.();
        }

        return () => window.removeEventListener('mousemove', mouseRotation);
    }, [isPointerLocked, addRotation]);

    useFrame((_, delta) => {
        if (!bodyRef.current || !meshRef.current) return;

        const keys = keysRef.current;
        const speed =
            isFlying.current && canFly
                ? keys.shift
                    ? flyBoostSpeed
                    : flySpeed
                : keys.shift
                  ? shiftSpeed
                  : walkSpeed;
        const isMoving =
            keys.forward || keys.backward || keys.left || keys.right;

        /** @description คำนวณทิศทางการเดินอิงตามมุมกล้อง */
        const isCurrentlyFlying = canFly && isFlying.current;
        const forward = new THREE.Vector3();
        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);

        if (isCurrentlyFlying && keys.shift) {
            // บินตามหน้ากล้องเป๊ะๆ (3D Flight)
            forward.copy(camDir);
        } else {
            // เดินตามพื้น หรือบินแนวราบปกติ (2D Horizontal Flight)
            forward.set(camDir.x, 0, camDir.z);
        }

        forward.normalize();
        const right = new THREE.Vector3()
            .crossVectors(forward, new THREE.Vector3(0, 1, 0))
            .normalize();

        if (!isCurrentlyFlying) {
            // ถ้าเดิน พื้นต้องราบสนิท
            right.y = 0;
            right.normalize();
        }

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

        /** @description Superman Pose - ถ้านอนลงตอนบินเร็ว (Shift) */
        const targetMeshRotX = isCurrentlyFlying && keys.shift ? -pitch : 0;
        const poseMeshRotX = isCurrentlyFlying && keys.shift ? Math.PI / 2 : 0;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
            meshRef.current.rotation.x,
            targetMeshRotX + poseMeshRotX,
            delta * 10,
        );

        const translation = bodyRef.current.translation();

        /** @description ตรวจสอบว่ายืนอยู่บนพื้นหรือไม่ (Raycast ลงพื้นระยะ 0.2 หน่วย) */
        const rayOrigin = {
            x: translation.x,
            y: translation.y + 0.1,
            z: translation.z,
        };
        const rayDir = { x: 0, y: -1, z: 0 };
        const ray = new rapier.Ray(rayOrigin, rayDir);
        const groundHit = world.castRay(
            ray,
            0.5,
            true,
            undefined,
            undefined,
            undefined,
            bodyRef.current,
        );
        const isGrounded = groundHit !== null;

        if (rayHelperRef.current) {
            rayHelperRef.current.position.set(
                rayOrigin.x,
                rayOrigin.y,
                rayOrigin.z,
            );
            rayHelperRef.current.setColor(isGrounded ? 0x00ff00 : 0xff0000);
        }

        /** @description จัดการสถาณะการบิน */
        if (isGrounded) {
            isFlying.current = false;
            jumpHoldTime.current = 0;
        } else if (keys.jump) {
            jumpHoldTime.current += delta;
            if (jumpHoldTime.current > 0.3) isFlying.current = true;
        } else {
            jumpHoldTime.current = 0;
        }

        const currentVel = bodyRef.current.linvel();
        let newVelY = currentVel.y;

        if (canFly && isFlying.current) {
            newVelY = 0;
            if (keys.jump) newVelY = flySpeed;
            if (keys.down) newVelY = -flySpeed;
        } else if (keys.jump && isGrounded) {
            newVelY = jumpForce;
        }

        /** @description Update Physics */
        if (isCurrentlyFlying) {
            bodyRef.current.setLinvel(
                {
                    x: isMoving ? direction.x * speed : 0,
                    y:
                        (isMoving ? direction.y * speed : 0) +
                        (keys.jump ? flySpeed : 0) -
                        (keys.down ? flySpeed : 0),
                    z: isMoving ? direction.z * speed : 0,
                },
                true,
            );
        } else {
            bodyRef.current.setLinvel(
                {
                    x: isMoving ? direction.x * speed : 0,
                    y: newVelY,
                    z: isMoving ? direction.z * speed : 0,
                },
                true,
            );
        }

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
        if (playerChunk.x !== chunk.x || playerChunk.z !== chunk.z) {
            startTransition(() => {
                setPlayerChunk(playerChunk);
            });
        }

        /** @description Ground Guard - ป้องกันการตกทะลุพื้นโดยเช็คความสูง Terrain จริง ณ จุดนั้น */
        const floorY = getTerrainHeight(translation.x, translation.z);
        if (translation.y < floorY - 0.5) {
            bodyRef.current.setTranslation(
                { x: translation.x, y: floorY + 1.5, z: translation.z },
                true,
            );
            bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        }

        /** @description กล้องติดตามตัวละคร (Smooth Follow) - ปิดถ้าอยู่ในโหมด debug เพื่อให้ OrbitControls ทำงานได้ */
        if (!debug) {
            const rotatedOffset = offset
                .clone()
                .applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch) // Vertical
                .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw); // Horizontal

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

    const { setZoom } = useCameraStore();
    useEffect(() => {
        const handleWheel = (event: WheelEvent) => setZoom(event.deltaY);

        window.addEventListener('wheel', handleWheel, { passive: true });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [setZoom]);

    // ใช้สำหรับส่งค่าเข้า RigidBody props
    const isCurrentlyFlying = canFly && isFlying.current;

    return (
        <RigidBody
            ref={bodyRef}
            mass={1}
            ccd={true}
            colliders={false}
            linearDamping={isCurrentlyFlying ? 1 : 4}
            gravityScale={isCurrentlyFlying ? 0 : 1.2}
            position={[0, 5, 0]}
            enabledRotations={[false, false, false]}
        >
            <CapsuleCollider args={[0.95, 0.4]} position={[0, 1.25, 0]} />
            <PlayerModel ref={meshRef} />
        </RigidBody>
    );
}
