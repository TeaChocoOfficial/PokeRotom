// -Path: "PokeRotom/client/src/screen/game/world/Trees.tsx"
'use client';
import * as THREE from 'three';
import { useMemo, useRef, useLayoutEffect } from 'react';
import { useThemeStore } from '$/stores/themeStore';
import { InstancedRigidBodies, CylinderCollider } from '@react-three/rapier';

const TREE_COUNT = 120;
const TERRAIN_SIZE = 200;

export default function Trees() {
    const theme = useThemeStore((state) => state.theme);
    const trunkMeshRef = useRef<THREE.InstancedMesh>(null);
    const leaves1Ref = useRef<THREE.InstancedMesh>(null);
    const leaves2Ref = useRef<THREE.InstancedMesh>(null);

    const leafColor = theme === 'dark' ? '#0d4a0d' : '#2d8a2d';
    const trunkColor = theme === 'dark' ? '#3a2a1a' : '#6b4423';

    const instanceData = useMemo(() => {
        const instances = [];
        for (let index = 0; index < TREE_COUNT; index++) {
            const posX = (Math.random() - 0.5) * TERRAIN_SIZE * 0.9;
            const posZ = (Math.random() - 0.5) * TERRAIN_SIZE * 0.9;
            const dist = Math.sqrt(posX * posX + posZ * posZ);

            if (dist < 15) {
                index--;
                continue;
            }

            const scale = 0.8 + Math.random() * 1.2;
            const rotationY = Math.random() * Math.PI * 2;

            // วางบนพื้นราบ (Y = 0)
            const position: [number, number, number] = [posX, 0, posZ];

            instances.push({
                key: 'tree_' + index,
                position,
                rotation: [0, rotationY, 0] as [number, number, number],
                scale: [scale, scale, scale] as [number, number, number],
            });
        }
        return instances;
    }, []);

    useLayoutEffect(() => {
        const matrix = new THREE.Matrix4();
        const rotation = new THREE.Quaternion();
        const euler = new THREE.Euler();

        instanceData.forEach((data, index) => {
            const pos = new THREE.Vector3(...data.position);
            const scl = new THREE.Vector3(...data.scale);
            euler.set(data.rotation[0], data.rotation[1], data.rotation[2]);
            rotation.setFromEuler(euler);

            // Trunk (สูง 3, จุดหมุนอยู่กลาง -> เลื่อนขึ้น 1.5)
            matrix.compose(
                pos.clone().add(new THREE.Vector3(0, 1.5 * scl.y, 0)),
                rotation,
                scl,
            );
            trunkMeshRef.current?.setMatrixAt(index, matrix);

            // Leaves 1 (สูงขึ้นไปอีก)
            matrix.compose(
                pos.clone().add(new THREE.Vector3(0, 4 * scl.y, 0)),
                rotation,
                scl,
            );
            leaves1Ref.current?.setMatrixAt(index, matrix);

            // Leaves 2 (ยอดบนสุด)
            matrix.compose(
                pos.clone().add(new THREE.Vector3(0, 5.5 * scl.y, 0)),
                rotation,
                scl,
            );
            leaves2Ref.current?.setMatrixAt(index, matrix);
        });

        if (trunkMeshRef.current)
            trunkMeshRef.current.instanceMatrix.needsUpdate = true;
        if (leaves1Ref.current)
            leaves1Ref.current.instanceMatrix.needsUpdate = true;
        if (leaves2Ref.current)
            leaves2Ref.current.instanceMatrix.needsUpdate = true;
    }, [instanceData]);

    return (
        <group>
            <InstancedRigidBodies
                instances={instanceData}
                type="fixed"
                colliders={false}
            >
                <CylinderCollider args={[1.5, 0.3]} position={[0, 1.5, 0]} />
            </InstancedRigidBodies>

            <instancedMesh
                ref={trunkMeshRef}
                args={[null as any, null as any, TREE_COUNT]}
                castShadow
            >
                <cylinderGeometry args={[0.2, 0.35, 3, 8]} />
                <meshStandardMaterial color={trunkColor} roughness={0.9} />
            </instancedMesh>

            <instancedMesh
                ref={leaves1Ref}
                args={[null as any, null as any, TREE_COUNT]}
                castShadow
            >
                <coneGeometry args={[2, 4, 8]} />
                <meshStandardMaterial color={leafColor} roughness={0.8} />
            </instancedMesh>

            <instancedMesh
                ref={leaves2Ref}
                args={[null as any, null as any, TREE_COUNT]}
                castShadow
            >
                <coneGeometry args={[1.5, 3, 8]} />
                <meshStandardMaterial color={leafColor} roughness={0.8} />
            </instancedMesh>
        </group>
    );
}
