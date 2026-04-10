//-Path: "PokeRotom/client/src/screen/game/world/tree/PhysicsForest.tsx"
'use client';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
    InstancedRigidBodies,
    CylinderCollider,
    InstancedRigidBodyProps,
} from '@react-three/rapier';

export function PhysicsForest() {
    const count = 500;
    const leafColor = '#43a047';
    const trunkColor = '#5d4037';
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

    const instances = useMemo(() => {
        const items: InstancedRigidBodyProps[] = [];
        for (let index = 0; index < count; index++) {
            items.push({
                key: index,
                position: [
                    (Math.random() - 0.5) * 120,
                    0,
                    (Math.random() - 0.5) * 120,
                ],
                rotation: [0, Math.random() * Math.PI * 2, 0],
            });
        }
        return items;
    }, []);

    const mergedGeo = useMemo(() => {
        // สร้างลำต้นทรง 6 เหลี่ยม
        const trunkGeo = new THREE.CylinderGeometry(
            0.3,
            0.5,
            3,
            6,
        ).toNonIndexed();
        trunkGeo.translate(0, 1.5, 0);
        trunkGeo.groups.push({ start: 0, count: Infinity, materialIndex: 0 });

        // พุ่มใบไม้ก้อนหลัก
        const leaf1Geo = new THREE.IcosahedronGeometry(2, 0).toNonIndexed();
        leaf1Geo.translate(0, 3.5, 0);
        leaf1Geo.groups.push({ start: 0, count: Infinity, materialIndex: 1 });

        // พุ่มใบไม้ก้อนรอง (เยื้อง)
        const leaf2Geo = new THREE.IcosahedronGeometry(1.5, 0).toNonIndexed();
        leaf2Geo.translate(1, 3.8, 0.8);
        leaf2Geo.groups.push({ start: 0, count: Infinity, materialIndex: 1 });

        // พุ่มใบไม้ก้อนเล็ก (เยื้องอีกฝั่ง)
        const leaf3Geo = new THREE.IcosahedronGeometry(1.2, 0).toNonIndexed();
        leaf3Geo.translate(-0.8, 3.2, -1);
        leaf3Geo.groups.push({ start: 0, count: Infinity, materialIndex: 1 });

        // ลบ UV ทิ้งเพื่อป้องกัน Error ตอน merge
        trunkGeo.deleteAttribute('uv');
        leaf1Geo.deleteAttribute('uv');
        leaf2Geo.deleteAttribute('uv');
        leaf3Geo.deleteAttribute('uv');

        return mergeGeometries([trunkGeo, leaf1Geo, leaf2Geo, leaf3Geo], true);
    }, []);

    const materials = useMemo(
        () => [
            new THREE.MeshToonMaterial({ color: trunkColor }),
            new THREE.MeshToonMaterial({ color: leafColor }),
        ],
        [trunkColor, leafColor],
    );

    return (
        <InstancedRigidBodies
            key={count}
            type="fixed"
            colliders={false}
            instances={instances}
        >
            <instancedMesh
                ref={instancedMeshRef}
                args={[mergedGeo, materials, count]}
                castShadow
                receiveShadow
                frustumCulled={false}
            />
            <CylinderCollider args={[1.5, 0.45]} position={[0, 1.5, 0]} />
        </InstancedRigidBodies>
    );
}
