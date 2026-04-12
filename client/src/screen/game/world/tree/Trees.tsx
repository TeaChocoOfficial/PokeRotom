//-Path: "PokeRotom/client/src/screen/game/world/tree/Trees.tsx"
import {
    CylinderCollider,
    type RigidBodyProps,
    InstancedRigidBodies,
    type InstancedRigidBodyProps,
} from '@react-three/rapier';
import * as THREE from 'three';
import { useMemo } from 'react';
import useNoise from '../hooks/noise';
import useChunk from '../hooks/chunk';
import { useGameStore } from '$/stores/gameStore';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const woodColor = '#6e4e4e';
const leafColor = '#84aa55';

export type InstancedTreeProps = RigidBodyProps & {
    key: string | number;
};

export default function Trees({ seed }: { seed: string }) {
    const { chunk } = useGameStore();
    const { simplex2, createSeededRng, getTerrainHeight } = useNoise();
    const { RENDER_DISTANCE, CHUNK_SIZE, FOREST_DENSITY } = useChunk();

    const noise2D = useMemo(() => simplex2(seed), [seed, simplex2]);

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
            new THREE.MeshToonMaterial({ color: woodColor }),
            new THREE.MeshToonMaterial({ color: leafColor }),
        ],
        [woodColor, leafColor],
    );

    const instances = useMemo(() => {
        const items: InstancedRigidBodyProps[] = [];
        for (
            let deltaZ = -RENDER_DISTANCE;
            deltaZ <= RENDER_DISTANCE;
            deltaZ++
        ) {
            for (
                let deltaX = -RENDER_DISTANCE;
                deltaX <= RENDER_DISTANCE;
                deltaX++
            ) {
                const chunkX = chunk.x + deltaX;
                const chunkZ = chunk.z + deltaZ;
                const seededRng = createSeededRng(
                    `${seed}_forest_${chunkX}_${chunkZ}`,
                    888,
                );

                for (let index = 0; index < FOREST_DENSITY; index++) {
                    const localX = seededRng() * CHUNK_SIZE;
                    const localZ = seededRng() * CHUNK_SIZE;
                    const rotateY = seededRng() * Math.PI * 2;

                    const worldX = chunkX * CHUNK_SIZE + localX;
                    const worldZ = chunkZ * CHUNK_SIZE + localZ;

                    const originDist = Math.sqrt(
                        worldX * worldX + worldZ * worldZ,
                    );
                    if (originDist < 15) continue;

                    const patchVal = noise2D(worldX * 0.01, worldZ * 0.01);
                    if (patchVal < 0) continue;

                    const treeNoise = noise2D(worldX * 0.1, worldZ * 0.1);
                    if (treeNoise < -0.2) continue;

                    const height =
                        getTerrainHeight(noise2D, worldX, worldZ) + 1.5;
                    const treeKey = `tree_${chunkX}_${chunkZ}_${index}`;

                    items.push({
                        key: treeKey,
                        rotation: [0, rotateY, 0],
                        position: [worldX, height, worldZ],
                    });
                }
            }
        }
        return items;
    }, [
        chunk,
        seed,
        noise2D,
        createSeededRng,
        getTerrainHeight,
        RENDER_DISTANCE,
        CHUNK_SIZE,
    ]);

    const key = `trees_${seed}-${chunk.x}-${chunk.z}-${instances.length}-${mergedGeo.uuid}`;

    return (
        <InstancedRigidBodies
            key={key}
            type="fixed"
            colliders={false}
            instances={instances}
            colliderNodes={[
                <CylinderCollider
                    key={key}
                    args={[3, 0.5]}
                    position={[0, 0, 0]}
                />,
            ]}
        >
            <instancedMesh
                key={key}
                castShadow
                receiveShadow
                args={[mergedGeo, materials, instances.length]}
            />
        </InstancedRigidBodies>
    );
}
