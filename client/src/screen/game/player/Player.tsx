// -Path: "PokeRotom/client/src/screen/game/player/Player.tsx"
import * as THREE from 'three';
import useChunk from '../world/hooks/chunk';
import { button, useControls } from 'leva';
import PlayerModel from '../entity/PlayerModel';
import { useGameStore } from '$/stores/gameStore';
import { useSocketStore } from '$/stores/socketStore';
import { useCameraStore } from '$/stores/cameraStore';
import { usePlayerInput } from '$/hooks/usePlayerInput';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useTransition, useLayoutEffect } from 'react';
import type { RapierRigidBody } from '@react-three/rapier';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';

export default function Player({ debug }: { debug?: boolean }) {
    const {
        chunk,
        isPointerLocked,
        setPlayerChunk,
        setMovementState,
        setPlayerPosition,
        setIsPointerLocked,
    } = useGameStore();
    const isFlying = useRef(false);
    const jumpHoldTime = useRef(0);
    const lastEmitTime = useRef(0);
    const keysRef = usePlayerInput();
    const { camera, scene } = useThree();
    const { rapier, world } = useRapier();
    const meshRef = useRef<THREE.Group>(null);
    const bodyRef = useRef<RapierRigidBody>(null);
    const { emitPlayerMove } = useSocketStore();
    const { CHUNK_SIZE, renderDistance, getPlayerChunk } = useChunk();
    const [_isPending, startTransition] = useTransition();
    const smoothLookAt = useRef(new THREE.Vector3(0, 1.5, 0));
    const smoothCamPos = useRef(new THREE.Vector3(0, 12, 14));
    const rayHelperRef = useRef<THREE.ArrowHelper | null>(null);
    const { yaw, pitch, offset, lerpSpeed, lookOffset, addRotation } =
        useCameraStore();

    /** @description จำกัดระยะการมองเห็นให้เหลือแค่ 100 เมตร และใส่หมอกเพื่อให้ขอบการมองเห็นนุ่มนวล */
    useLayoutEffect(() => {
        camera.far = renderDistance * CHUNK_SIZE;
        camera.updateProjectionMatrix();

        // ตั้งค่าหมอกและสีพื้นหลังให้เป็นสีเดียวกัน เพื่อให้วัตถุหายไปในหมอกอย่างสมบูรณ์
        const fogColor = new THREE.Color('#a0d0ff');
        scene.fog = new THREE.Fog(
            fogColor,
            renderDistance * CHUNK_SIZE - CHUNK_SIZE,
            renderDistance * CHUNK_SIZE,
        );
        scene.background = fogColor;
    }, [camera, scene, renderDistance]);

    const {
        canFly,
        flySpeed,
        walkSpeed,
        jumpForce,
        shiftSpeed,
        flyBoostSpeed,
    } = useControls('player', {
        canFly: true,
        flySpeed: { value: 20, min: 0, max: 100, step: 1 },
        walkSpeed: { value: 5, min: 0, max: 100, step: 1 },
        jumpForce: { value: 20, min: 0, max: 100, step: 1 },
        shiftSpeed: { value: 10, min: 0, max: 100, step: 1 },
        flyBoostSpeed: { value: 60, min: 0, max: 200, step: 1 },
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
        else if (document.pointerLockElement === document.body)
            document.exitPointerLock?.();

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

            const rotationAlpha = Math.min(1, speed * 2 * delta);
            const newRotationY = currentRot + diff * rotationAlpha;
            bodyRef.current.setRotation(
                new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(0, newRotationY, 0, 'YXZ'),
                ),
                true,
            );
        }

        /** @description Superman Pose - ถ้านอนลงตอนบินเร็ว (Shift) */
        const isFlyingPose = isCurrentlyFlying && keys.shift && isMoving;
        const targetMeshRotX = isFlyingPose ? -pitch : 0;
        const poseMeshRotX = isFlyingPose ? Math.PI / 2 : 0;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
            meshRef.current.rotation.x,
            targetMeshRotX + poseMeshRotX,
            delta * 10,
        );

        const translation = bodyRef.current.translation();

        /** @description ป้องกันพิกัดกลายเป็น NaN (Physics Explosion) */
        if (
            !isFinite(translation.x) ||
            !isFinite(translation.y) ||
            !isFinite(translation.z)
        ) {
            bodyRef.current.setTranslation({ x: 0, y: 10, z: 0 }, true);
            bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            return;
        }

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

        /** @description Ground Guard - ใช้ Raycast สแกนความสูงจากท้องฟ้าลงมา (ครอบคลุมการตกโลกทุกระยะ) */
        const guardRayOrigin = { x: translation.x, y: 200, z: translation.z };
        const guardRayDir = { x: 0, y: -1, z: 0 };
        const guardRay = new rapier.Ray(guardRayOrigin, guardRayDir);
        const guardHit = world.castRay(
            guardRay,
            400,
            true,
            undefined,
            undefined,
            undefined,
            bodyRef.current,
        );

        if (guardHit) {
            const distance = guardHit.timeOfImpact;
            if (typeof distance === 'number' && isFinite(distance)) {
                const actualFloorY = guardRayOrigin.y - distance;
                if (translation.y < actualFloorY - 0.5) {
                    bodyRef.current.setTranslation(
                        {
                            x: translation.x,
                            y: actualFloorY + 1.5,
                            z: translation.z,
                        },
                        true,
                    );
                    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
                }
            }
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
