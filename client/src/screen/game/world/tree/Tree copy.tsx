'use client';
import * as THREE from 'three';
import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber'; // เพิ่ม
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
    CylinderCollider,
    InstancedRigidBodies,
    InstancedRigidBodyProps,
    RapierRigidBody,
} from '@react-three/rapier';

export default function Tree({ seed = '10' }: { seed?: string }) {
    const count = 50;
    const leafColor = '#43a047';
    const trunkColor = '#5d4037';
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
    const rigidBodiesRef = useRef<(RapierRigidBody | null)[] | null>(null);
    const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
    const tempPosition = useMemo(() => new THREE.Vector3(), []);
    const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);

    const instances = useMemo(() => {
        const items: InstancedRigidBodyProps[] = [];
        for (let index = 0; index < count; index++) {
            items.push({
                key: index,
                position: [
                    (Math.random() - 0.5) * 80,
                    1.5,
                    (Math.random() - 0.5) * 80,
                ],
                rotation: [0, Math.random() * Math.PI * 2, 0],
            });
        }
        return items;
    }, [seed, count]);

    const mergedGeo = useMemo(() => {
        const cleanGeo = (geo: THREE.BufferGeometry) => {
            const nonIndexed = geo.toNonIndexed();
            nonIndexed.deleteAttribute('uv');
            return nonIndexed;
        };

        const trunkGeo = cleanGeo(new THREE.CylinderGeometry(0.3, 0.5, 3, 6));
        trunkGeo.groups.push({ start: 0, count: Infinity, materialIndex: 0 });

        const leaf1 = cleanGeo(new THREE.IcosahedronGeometry(2, 0));
        leaf1.translate(0, 2, 0);
        leaf1.groups.push({ start: 0, count: Infinity, materialIndex: 1 });

        const leaf2 = cleanGeo(new THREE.IcosahedronGeometry(1.5, 0));
        leaf2.translate(1, 2.3, 0.5);
        leaf2.groups.push({ start: 0, count: Infinity, materialIndex: 1 });

        const leaf3 = cleanGeo(new THREE.IcosahedronGeometry(1.2, 0));
        leaf3.translate(-0.8, 1.7, -0.8);
        leaf3.groups.push({ start: 0, count: Infinity, materialIndex: 1 });

        return mergeGeometries([trunkGeo, leaf1, leaf2, leaf3], true);
    }, []);

    const materials = useMemo(
        () => [
            new THREE.MeshToonMaterial({ color: trunkColor }),
            new THREE.MeshToonMaterial({ color: leafColor }),
        ],
        [trunkColor, leafColor],
    );

    // ใช้ useFrame เพื่อ sync ตำแหน่งทุกเฟรม (หรือตอนแรกครั้งเดียว)
    const isInitialized = useRef(false);

    useFrame(() => {
        if (!rigidBodiesRef.current || !instancedMeshRef.current) return;

        let hasUpdate = false;

        rigidBodiesRef.current.forEach((body, index) => {
            if (!body) return;

            const position = body.translation();
            const rotation = body.rotation();

            tempPosition.set(position.x, position.y, position.z);
            tempQuaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
            tempMatrix.compose(
                tempPosition,
                tempQuaternion,
                new THREE.Vector3(1, 1, 1),
            );

            instancedMeshRef.current!.setMatrixAt(index, tempMatrix);
            hasUpdate = true;
        });

        if (hasUpdate) {
            instancedMeshRef.current.instanceMatrix.needsUpdate = true;
            if (
                !isInitialized.current &&
                rigidBodiesRef.current.every((body) => body !== null)
            ) {
                isInitialized.current = true;
                console.log('Initialized all tree instances'); // debug
            }
        }
    });

    return (
        <InstancedRigidBodies
            key={`${count}_${seed}`}
            ref={rigidBodiesRef}
            type="fixed"
            colliders={false}
            instances={instances}
        >
            <CylinderCollider args={[1.5, 0.45]} position={[0, 0, 0]} />

            {/* <instancedMesh
                ref={instancedMeshRef}
                args={[mergedGeo, materials, count]}
                castShadow
                receiveShadow
                frustumCulled={false}
            /> */}
        </InstancedRigidBodies>
    );
}
