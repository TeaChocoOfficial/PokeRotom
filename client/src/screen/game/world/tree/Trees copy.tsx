//-Path: "PokeRotom/client/src/screen/game/world/tree/Trees.tsx"
import * as THREE from 'three';
import { useMemo } from 'react';
import TreeChunk from './TreeChunk copy';
import useNoise from '../hooks/noise';
import useChunk from '../hooks/chunk';
import { useGameStore } from '$/stores/gameStore';
import { type RigidBodyProps } from '@react-three/rapier';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type InstancedTreeProps = RigidBodyProps & {
    key: string | number;
};

export default function Trees({ seed }: { seed: string }) {
    const { chunk } = useGameStore();
    const { noise2D, createSeededRng, getTerrainHeight, getBiomeConfig } =
        useNoise(seed);
    const { RENDER_DISTANCE, CHUNK_SIZE, FOREST_DENSITY } = useChunk();

    const treeVariations = useMemo(() => {
        const cleanGeo = (geo: THREE.BufferGeometry) => {
            const result = geo.index ? geo.toNonIndexed() : geo.clone();
            result.deleteAttribute('uv');
            return result;
        };

        // 1. Oak Tree (ต้นไม้ปกติ)
        const trunkOak = cleanGeo(new THREE.CylinderGeometry(0.3, 0.5, 3, 6));
        const leafOak1 = cleanGeo(new THREE.IcosahedronGeometry(2, 0));
        leafOak1.translate(0, 2, 0);
        const leafOak2 = cleanGeo(new THREE.IcosahedronGeometry(1.5, 0));
        leafOak2.translate(1, 2.3, 0.5);
        const variation1 = mergeGeometries(
            [trunkOak, leafOak1, leafOak2],
            true,
        );
        variation1.groups = [
            {
                start: 0,
                count: trunkOak.getAttribute('position').count,
                materialIndex: 0,
            },
            {
                start: trunkOak.getAttribute('position').count,
                count: Infinity,
                materialIndex: 1,
            },
        ];

        // 2. Pine Tree (ต้นสน แหลม ๆ)
        const trunkPine = cleanGeo(new THREE.CylinderGeometry(0.2, 0.3, 4, 6));
        const leafPine1 = cleanGeo(new THREE.ConeGeometry(2, 3, 6));
        leafPine1.translate(0, 2.5, 0);
        const leafPine2 = cleanGeo(new THREE.ConeGeometry(1.5, 2, 6));
        leafPine2.translate(0, 4, 0);
        const variation2 = mergeGeometries(
            [trunkPine, leafPine1, leafPine2],
            true,
        );
        variation2.groups = [
            {
                start: 0,
                count: trunkPine.getAttribute('position').count,
                materialIndex: 0,
            },
            {
                start: trunkPine.getAttribute('position').count,
                count: Infinity,
                materialIndex: 1,
            },
        ];

        // 3. Bush (พุ่มไม้ เตี้ย ๆ)
        const leafBush = cleanGeo(new THREE.SphereGeometry(1.2, 6, 6));
        leafBush.translate(0, 0.5, 0);
        const variation3 = leafBush;
        variation3.groups = [{ start: 0, count: Infinity, materialIndex: 1 }];

        return [
            { key: 'oak', geo: variation1 },
            { key: 'pine', geo: variation2 },
            { key: 'bush', geo: variation3 },
        ];
    }, []);

    const visibleChunks = useMemo(() => {
        const chunks: { x: number; z: number }[] = [];
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
                chunks.push({
                    x: chunk.x + deltaX,
                    z: chunk.z + deltaZ,
                });
            }
        }
        return chunks;
    }, [chunk, RENDER_DISTANCE]);

    return (
        <>
            {visibleChunks.map((c) => (
                <TreeChunk
                    key={`${c.x}_${c.z}`}
                    seed={seed}
                    chunkX={c.x}
                    chunkZ={c.z}
                    variations={treeVariations}
                    getBiomeConfig={getBiomeConfig}
                    getTerrainHeight={getTerrainHeight}
                    noise2D={noise2D}
                    createSeededRng={createSeededRng}
                    CHUNK_SIZE={CHUNK_SIZE}
                    FOREST_DENSITY={FOREST_DENSITY}
                />
            ))}
        </>
    );
}
