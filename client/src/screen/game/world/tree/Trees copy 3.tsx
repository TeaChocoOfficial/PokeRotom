//-Path: "PokeRotom/client/src/screen/game/world/tree/Trees.tsx"
'use client';
import * as THREE from 'three';
import { useMemo } from 'react';
import { useGameStore } from '$/stores/gameStore';
import { simplex2, createSeededRng } from '../terrain/noise';
import { CHUNK_SIZE, getTerrainHeight } from '../terrain/Terrain';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CylinderCollider, RigidBodyProps } from '@react-three/rapier';

const RENDER_DISTANCE = 2;
const FOREST_DENSITY = 30;

const TREE_SPECIES = {
    OAK: { trunkHeight: 4, trunkRadius: 0.5, leafColor: '#4e7a27' },
    PINE: { trunkHeight: 5, trunkRadius: 0.3, leafColor: '#2d4c1e' },
    BUSH: { trunkHeight: 1, trunkRadius: 0.2, leafColor: '#7a9e3a' },
};

export type InstancedTreeProps = RigidBodyProps & {
    key: string | number;
};

export default function Trees({ seed }: { seed: string }) {
    const { chunk } = useGameStore();
    const woodColor = '#5d4037';
    const noise2D = useMemo(() => simplex2(seed), [seed]);

    const treeModels = useMemo(() => {
        /** ล้าง attribute ให้พร้อมสำหรับ merge */
        const cleanGeo = (geometry: THREE.BufferGeometry) => {
            const nonIndexed = geometry.toNonIndexed();
            nonIndexed.deleteAttribute('uv');
            geometry.dispose();
            return nonIndexed;
        };

        const createModel = (species: keyof typeof TREE_SPECIES) => {
            const { trunkHeight, trunkRadius } = TREE_SPECIES[species];
            const trunkGeo = cleanGeo(
                new THREE.CylinderGeometry(
                    trunkRadius * 0.7,
                    trunkRadius,
                    trunkHeight,
                    6,
                ),
            );

            trunkGeo.translate(0, trunkHeight / 2, 0);
            trunkGeo.groups.push({
                start: 0,
                count: Infinity,
                materialIndex: 0,
            });

            let leafGeo: THREE.BufferGeometry;
            if (species === 'OAK') {
                const s1 = cleanGeo(new THREE.IcosahedronGeometry(2.5, 0));
                const s2 = cleanGeo(new THREE.IcosahedronGeometry(2, 0));
                const s3 = cleanGeo(new THREE.IcosahedronGeometry(1.8, 0));
                s1.translate(0, trunkHeight + 1, 0);
                s2.translate(1.2, trunkHeight, 1.2);
                s3.translate(-1.2, trunkHeight + 0.5, -1);
                leafGeo = mergeGeometries([s1, s2, s3]);
            } else if (species === 'PINE') {
                const c1 = cleanGeo(new THREE.CylinderGeometry(0, 2.5, 3, 6));
                const c2 = cleanGeo(new THREE.CylinderGeometry(0, 2, 2.5, 6));
                const c3 = cleanGeo(new THREE.CylinderGeometry(0, 1.5, 2, 6));
                c1.translate(0, trunkHeight - 1, 0);
                c2.translate(0, trunkHeight + 1, 0);
                c3.translate(0, trunkHeight + 2.5, 0);
                leafGeo = mergeGeometries([c1, c2, c3]);
            } else {
                leafGeo = cleanGeo(new THREE.IcosahedronGeometry(1.2, 0));
                leafGeo.translate(0, trunkHeight + 0.2, 0);
            }

            leafGeo.groups.push({
                start: 0,
                count: Infinity,
                materialIndex: 1,
            });
            return {
                geometry: mergeGeometries([trunkGeo, leafGeo], true),
                materials: [
                    new THREE.MeshToonMaterial({ color: woodColor }),
                    new THREE.MeshToonMaterial({
                        color: TREE_SPECIES[species].leafColor,
                    }),
                ],
            };
        };

        return {
            OAK: createModel('OAK'),
            PINE: createModel('PINE'),
            BUSH: createModel('BUSH'),
        };
    }, []);

    const forestData = useMemo(() => {
        const oakData: InstancedTreeProps[] = [];
        const pineData: InstancedTreeProps[] = [];
        const bushData: InstancedTreeProps[] = [];

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
                    const localX = (seededRng() - 0.5) * CHUNK_SIZE;
                    const localZ = (seededRng() - 0.5) * CHUNK_SIZE;
                    const worldX = chunkX * CHUNK_SIZE + localX;
                    const worldZ = chunkZ * CHUNK_SIZE + localZ;

                    const originDist = Math.sqrt(
                        worldX * worldX + worldZ * worldZ,
                    );
                    if (originDist < 15) continue;

                    const patchVal = noise2D(worldX * 0.01, worldZ * 0.01);
                    if (patchVal < -0.1) continue;

                    const densityVal = noise2D(worldX * 0.08, worldZ * 0.08);
                    if (densityVal < 0) continue;

                    const height = getTerrainHeight(noise2D, worldX, worldZ);
                    const scale = 0.7 + seededRng() * 0.6;
                    const rotateY = seededRng() * Math.PI * 2;
                    const treeKey = `tree_${chunkX}_${chunkZ}_${index}`;

                    const selector = seededRng();
                    const instance = {
                        key: treeKey,
                        scale: [scale, scale, scale] as [
                            number,
                            number,
                            number,
                        ],
                        position: [worldX, height, worldZ] as [
                            number,
                            number,
                            number,
                        ],
                        rotation: [0, rotateY, 0] as [number, number, number],
                    };

                    if (selector > 0.6) oakData.push(instance);
                    else if (selector > 0.2) pineData.push(instance);
                    else bushData.push(instance);
                }
            }
        }
        return { oakData, pineData, bushData };
    }, [chunk, seed, noise2D]);

    const renderTrees = (
        species: keyof typeof TREE_SPECIES,
        data: InstancedTreeProps[],
    ) => {
        if (data.length === 0) return null;
        const { geometry, materials } = treeModels[species];
        const { trunkHeight, trunkRadius } = TREE_SPECIES[species];

        return (
            <group
                key={`${species}_${chunk.x}_${chunk.z}_${data.length}`}
                type="fixed"
            >
                <instancedMesh
                    args={[geometry, materials, data.length]}
                    castShadow
                    receiveShadow
                    frustumCulled={false}
                />
                <CylinderCollider
                    args={[trunkHeight / 2, trunkRadius]}
                    position={[0, trunkHeight / 2, 0]}
                />
            </group>
        );
    };

    return (
        <group>
            {renderTrees('OAK', forestData.oakData)}
            {renderTrees('PINE', forestData.pineData)}
            {renderTrees('BUSH', forestData.bushData)}
        </group>
    );
}
