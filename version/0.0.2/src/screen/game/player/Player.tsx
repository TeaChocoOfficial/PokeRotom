// -Path: "PokeRotom/client/src/screen/game/player/Player.tsx"
'use client';
import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useGameStore } from '$/stores/gameStore';
import { useSocketStore } from '$/stores/socketStore';
import { useFrame, useThree } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';

const WALK_SPEED = 5;
const RUN_SPEED = 10;
const ROTATION_SPEED = 3;

interface KeyState {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    shift: boolean;
}

export default function Player() {
    const bodyRef = useRef<RapierRigidBody>(null);
    const meshRef = useRef<THREE.Group>(null);
    const keysRef = useRef<KeyState>({
        forward: false,
        backward: false,
        left: false,
        right: false,
        shift: false,
    });

    const { camera } = useThree();
    const cameraAngle = useRef(0);
    const cameraDistance = useRef(12);
    const cameraHeight = useRef(8);
    const isDragging = useRef(false);
    const lastEmitTime = useRef(0);

    const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
    const setMovementState = useGameStore((state) => state.setMovementState);
    const emitPlayerMove = useSocketStore((state) => state.emitPlayerMove);
    const isChatFocused = useGameStore((state) => state.isChatFocused);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isChatFocused) return;
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    keysRef.current.forward = true;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    keysRef.current.backward = true;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    keysRef.current.left = true;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    keysRef.current.right = true;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    keysRef.current.shift = true;
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    keysRef.current.forward = false;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    keysRef.current.backward = false;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    keysRef.current.left = false;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    keysRef.current.right = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    keysRef.current.shift = false;
                    break;
            }
        };

        const handleMouseDown = (event: MouseEvent) => {
            if (event.button === 2 || event.button === 1)
                isDragging.current = true;
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isDragging.current) return;
            cameraAngle.current -= event.movementX * 0.005;
            cameraHeight.current = Math.max(
                3,
                Math.min(20, cameraHeight.current - event.movementY * 0.05),
            );
        };

        const handleWheel = (event: WheelEvent) => {
            cameraDistance.current = Math.max(
                5,
                Math.min(25, cameraDistance.current + event.deltaY * 0.01),
            );
        };

        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [isChatFocused]);

    useFrame((_, delta) => {
        if (!bodyRef.current || !meshRef.current) return;

        const keys = keysRef.current;
        const isMoving =
            keys.forward || keys.backward || keys.left || keys.right;
        const speed = keys.shift ? RUN_SPEED : WALK_SPEED;

        const direction = new THREE.Vector3();

        const cameraForward = new THREE.Vector3(
            -Math.sin(cameraAngle.current),
            0,
            -Math.cos(cameraAngle.current),
        ).normalize();

        const cameraRight = new THREE.Vector3(
            cameraForward.z,
            0,
            -cameraForward.x,
        ).normalize();

        if (keys.forward) direction.add(cameraForward);
        if (keys.backward) direction.sub(cameraForward);
        if (keys.right) direction.add(cameraRight);
        if (keys.left) direction.sub(cameraRight);

        if (direction.length() > 0) {
            direction.normalize();
            const targetAngle = Math.atan2(direction.x, direction.z);
            const currentRotation = meshRef.current.rotation.y;
            const angleDiff = targetAngle - currentRotation;
            const normalizedDiff = Math.atan2(
                Math.sin(angleDiff),
                Math.cos(angleDiff),
            );
            meshRef.current.rotation.y +=
                normalizedDiff * ROTATION_SPEED * delta * 5;
        }

        const currentTranslation = bodyRef.current.translation();

        const velocity = {
            x: isMoving ? direction.x * speed : 0,
            y: bodyRef.current.linvel().y,
            z: isMoving ? direction.z * speed : 0,
        };

        bodyRef.current.setLinvel(velocity, true);

        const playerPos = new THREE.Vector3(
            currentTranslation.x,
            currentTranslation.y,
            currentTranslation.z,
        );
        setPlayerPosition(playerPos);

        const movementState = !isMoving
            ? 'idle'
            : keys.shift
              ? 'running'
              : 'walking';
        setMovementState(movementState);

        // Camera follow
        const cameraX =
            currentTranslation.x +
            Math.sin(cameraAngle.current) * cameraDistance.current;
        const cameraZ =
            currentTranslation.z +
            Math.cos(cameraAngle.current) * cameraDistance.current;

        camera.position.lerp(
            new THREE.Vector3(
                cameraX,
                currentTranslation.y + cameraHeight.current,
                cameraZ,
            ),
            5 * delta,
        );

        camera.lookAt(
            currentTranslation.x,
            currentTranslation.y + 1.5,
            currentTranslation.z,
        );

        // Emit position to socket (throttled to 15 times/sec)
        const now = Date.now();
        if (now - lastEmitTime.current > 66) {
            lastEmitTime.current = now;
            emitPlayerMove({
                position: {
                    x: currentTranslation.x,
                    y: currentTranslation.y,
                    z: currentTranslation.z,
                },
                rotation: {
                    x: meshRef.current.rotation.x,
                    y: meshRef.current.rotation.y,
                    z: meshRef.current.rotation.z,
                },
                movementState,
            });
        }
    });

    return (
        <RigidBody
            ref={bodyRef}
            position={[0, 5, 0]}
            enabledRotations={[false, false, false]}
            linearDamping={4}
            mass={1}
        >
            <CapsuleCollider args={[0.5, 0.4]} position={[0, 0.9, 0]} />
            <group ref={meshRef}>
                {/* Body */}
                <mesh castShadow position={[0, 1.0, 0]}>
                    <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
                    <meshStandardMaterial color="#e85d3a" roughness={0.6} />
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
                    <meshStandardMaterial color="#c43030" roughness={0.4} />
                </mesh>
                <mesh castShadow position={[0, 2.25, 0]}>
                    <sphereGeometry
                        args={[0.33, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]}
                    />
                    <meshStandardMaterial color="#c43030" roughness={0.4} />
                </mesh>
                {/* Arms */}
                <mesh castShadow position={[0.5, 0.95, 0]}>
                    <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
                    <meshStandardMaterial color="#e85d3a" roughness={0.6} />
                </mesh>
                <mesh castShadow position={[-0.5, 0.95, 0]}>
                    <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
                    <meshStandardMaterial color="#e85d3a" roughness={0.6} />
                </mesh>
                {/* Legs */}
                <mesh castShadow position={[0.15, 0.25, 0]}>
                    <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
                    <meshStandardMaterial color="#2255aa" roughness={0.7} />
                </mesh>
                <mesh castShadow position={[-0.15, 0.25, 0]}>
                    <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
                    <meshStandardMaterial color="#2255aa" roughness={0.7} />
                </mesh>
            </group>
        </RigidBody>
    );
}
