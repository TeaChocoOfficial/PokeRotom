// -Path: "PokeRotom/client/src/screen/game/world/Trees.tsx"
'use client';
import * as THREE from 'three';
import { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThemeStore } from '$/stores/themeStore';
import { InstancedRigidBodies, CylinderCollider } from '@react-three/rapier';

const TREE_COUNT = 150;
const TERRAIN_SIZE = 200;

export default function Trees() {
    const theme = useThemeStore((state) => state.theme);
    const trunkMeshRef = useRef<THREE.InstancedMesh>(null);
    const leaves1Ref = useRef<THREE.InstancedMesh>(null);
    const leaves2Ref = useRef<THREE.InstancedMesh>(null);

    const leafColor = theme === 'dark' ? '#0d4a0d' : '#2d8a2d';
    const trunkColor = theme === 'dark' ? '#3a2a1a' : '#6b4423';

    // เตรียมข้อมูลสำหรับคัดลอกลง Matrix
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

            const heightY = Math.sin(posX * 0.05) * 1.5 + Math.cos(posZ * 0.08) * 1.0;
            const scale = 0.8 + Math.random() * 1.2;
            const rotation = new THREE.Euler(0, Math.random() * Math.PI * 2, 0);
            const position = [posX, heightY - 0.5, posZ] as [number, number, number];

            instances.push({
                key: 'tree_' + index,
                position,
                rotation: [0, rotation.y, 0] as [number, number, number],
                scale: [scale, scale, scale] as [number, number, number],
            });
        }
        return instances;
    }, []);

    // อัปเดต Instance Matrices เมื่อโหลดเสร็จ
    useLayoutEffect(() => {
        const matrix = new THREE.Matrix4();
        instanceData.forEach((data, index) => {
            // Trunk Matrix
            matrix.compose(
                new THREE.Vector3(...data.position),
                new THREE.Quaternion().setFromEuler(new THREE.Euler(...data.rotation)),
                new THREE.Vector3(...data.scale)
            );
            trunkMeshRef.current?.setMatrixAt(index, matrix);

            // Leaves 1 Matrix (Offset Y by 4)
            matrix.compose(
                new THREE.Vector3(data.position[0], data.position[1] + 4 * data.scale[1], data.position[2]),
                new THREE.Quaternion().setFromEuler(new THREE.Euler(...data.rotation)),
                new THREE.Vector3(...data.scale)
            );
            leaves1Ref.current?.setMatrixAt(index, matrix);

            // Leaves 2 Matrix (Offset Y by 5.5)
            matrix.compose(
                new THREE.Vector3(data.position[0], data.position[1] + 5.5 * data.scale[1], data.position[2]),
                new THREE.Quaternion().setFromEuler(new THREE.Euler(...data.rotation)),
                new THREE.Vector3(...data.scale)
            );
            leaves2Ref.current?.setMatrixAt(index, matrix);
        });

        trunkMeshRef.current!.instanceMatrix.needsUpdate = true;
        leaves1Ref.current!.instanceMatrix.needsUpdate = true;
        leaves2Ref.current!.instanceMatrix.needsUpdate = true;
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
                args={[undefined, undefined, TREE_COUNT]}
                castShadow
            >
                <cylinderGeometry args={[0.2, 0.35, 3, 8]} />
                <meshStandardMaterial color={trunkColor} roughness={0.9} />
            </instancedMesh>

            <instancedMesh
                ref={leaves1Ref}
                args={[undefined, undefined, TREE_COUNT]}
                castShadow
            >
                <coneGeometry args={[2, 4, 8]} />
                <meshStandardMaterial color={leafColor} roughness={0.8} />
            </instancedMesh>

            <instancedMesh
                ref={leaves2Ref}
                args={[undefined, undefined, TREE_COUNT]}
                castShadow
            >
                <coneGeometry args={[1.5, 3, 8]} />
                <meshStandardMaterial color={leafColor} roughness={0.8} />
            </instancedMesh>
        </group>
    );
}

