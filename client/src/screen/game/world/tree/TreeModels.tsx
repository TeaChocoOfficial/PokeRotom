// -Path: "PokeRotom/client/src/screen/game/world/tree/TreeModels.tsx"
import {
    InstancedRigidBodies,
    InstancedRigidBodyProps,
} from '@react-three/rapier';
import * as THREE from 'three';
import { useMemo } from 'react';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

type TreeModelsProps = { instances: InstancedRigidBodyProps[] };

export default function TreeModels({ instances }: TreeModelsProps) {
    const leafColor = '#2d8a2d';
    const trunkColor = '#6b4423';

    // วัสดุ (Trunk = index 0, Leaves = index 1)
    const materials = useMemo(
        () => [
            new THREE.MeshToonMaterial({ color: trunkColor }),
            new THREE.MeshToonMaterial({ color: leafColor }),
        ],
        [trunkColor, leafColor],
    );

    // รวม Geometry ของต้นไม้ (Trunk + 2 Leaves Layers)
    const mergedGeo = useMemo(() => {
        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 3, 8);
        trunkGeo.translate(0, 1.5, 0); // ตั้งบนพื้น
        trunkGeo.groups.push({ start: 0, count: Infinity, materialIndex: 0 });

        // Leaves Layer 1 (Bottom)
        const leaves1Geo = new THREE.ConeGeometry(2, 4, 8);
        leaves1Geo.translate(0, 4, 0);
        leaves1Geo.groups.push({ start: 0, count: Infinity, materialIndex: 1 });

        // Leaves Layer 2 (Top)
        const leaves2Geo = new THREE.ConeGeometry(1.5, 3, 8);
        leaves2Geo.translate(0, 5.5, 0);
        leaves2Geo.groups.push({ start: 0, count: Infinity, materialIndex: 1 });

        return mergeGeometries([trunkGeo, leaves1Geo, leaves2Geo], true);
    }, []);

    return (
        <InstancedRigidBodies
            instances={instances}
            type="fixed"
            colliders="trimesh"
            friction={1}
        >
            <instancedMesh
                args={[mergedGeo, materials, instances.length]}
                castShadow
                receiveShadow
                frustumCulled={false}
            />
        </InstancedRigidBodies>
    );
}
