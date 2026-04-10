//-Path: "PokeRotom/client/src/screen/game/world/tree/Tree.tsx"
'use client';
import {
    CylinderCollider,
    InstancedRigidBodies,
    InstancedRigidBodyProps,
} from '@react-three/rapier';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default function Tree({ seed = '10' }: { seed?: string }) {
    const count = 50;
    const leafColor = '#43a047';
    const trunkColor = '#5d4037';
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

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
            const result = geo.index ? geo.toNonIndexed() : geo.clone();
            result.deleteAttribute('uv');
            return result;
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

    return (
        <>
            <InstancedRigidBodies
                type="fixed"
                colliders={false}
                instances={instances}
                colliderNodes={[
                    <CylinderCollider
                        key="collider"
                        args={[1.5, 0.45]}
                        position={[0, 0, 0]}
                    />,
                ]}
            >
                <instancedMesh
                    ref={instancedMeshRef}
                    castShadow
                    receiveShadow
                    frustumCulled={false}
                    args={[mergedGeo, materials, count]}
                />
            </InstancedRigidBodies>
        </>
    );
}
