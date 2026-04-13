// -Path: "PokeRotom/client/src/screen/game/world/tree/TreeChunk.tsx"
import {
    CylinderCollider,
    InstancedRigidBodies,
    type InstancedRigidBodyProps,
} from '@react-three/rapier';
import * as THREE from 'three';
import { memo, useMemo } from 'react';
import type { BiomePreset } from '../data/biome';

interface TreeChunkProps {
    seed: string;
    chunkX: number;
    chunkZ: number;
    variations: { key: string; geo: THREE.BufferGeometry }[];
    getBiomeConfig: (x: number, z: number) => BiomePreset;
    getTerrainHeight: (noise: any, x: number, z: number) => number;
    noise2D: (x: number, z: number) => number;
    createSeededRng: (seed: string, iter?: number) => () => number;
    CHUNK_SIZE: number;
    FOREST_DENSITY: number;
}

const woodColor = '#6e4e4e';

function TreeChunkComponent({
    seed,
    chunkX,
    chunkZ,
    variations,
    getBiomeConfig,
    getTerrainHeight,
    noise2D,
    createSeededRng,
    CHUNK_SIZE,
    FOREST_DENSITY,
}: TreeChunkProps) {
    const treeInstances = useMemo(() => {
        const groups: Record<
            string,
            (InstancedRigidBodyProps & { color: number[] })[]
        > = {};
        variations.forEach((v) => (groups[v.key] = []));

        for (let index = 0; index < FOREST_DENSITY; index++) {
            // สำคัญมาก: ต้องสร้าง RNG แยกรายต้น (Per-tree RNG) เพื่อป้องกันบั๊ก "RNG Shift"
            // หากเราใช้ RNG รวม แล้วต้นไม้ต้นที่ 5 ถูก skip ไปเพราะความหนาแน่นลดลง
            // ลำดับการสุ่มของต้นที่ 6 จะเปลี่ยนทันที ทำให้สีและตำแหน่งกะพริบเวลาเราเดิน
            const treeRng = createSeededRng(
                `${seed}_tree_${chunkX}_${chunkZ}_${index}`,
            );

            const localX = treeRng() * CHUNK_SIZE;
            const localZ = treeRng() * CHUNK_SIZE;
            const worldX = chunkX * CHUNK_SIZE + localX;
            const worldZ = chunkZ * CHUNK_SIZE + localZ;

            const originDist = Math.sqrt(worldX * worldX + worldZ * worldZ);
            if (originDist < 15) continue;

            const biome = getBiomeConfig(worldX, worldZ);
            // ขั้นตอนนี้ (density check) จะเสถียรแล้ว เพราะ treeRng ของต้นถัดไปจะไม่เปลี่ยนตาม
            if (treeRng() > biome.trees.density) continue;

            const w = biome.trees.weights;
            const totalW = w.oak + w.pine + w.bush;
            let randW = treeRng() * totalW;

            let type = variations[0].key;
            if (randW < w.oak) type = 'oak';
            else if (randW < w.oak + w.pine) type = 'pine';
            else type = 'bush';

            // 3. สุ่มขนาดตาม Range ของ Biome
            const [minS, maxS] = biome.trees.scale;
            const scale = minS + treeRng() * (maxS - minS);

            // 4. เตรียมสีประจำต้น (ดึงจาก treeColor ของ Biome และปรับให้ต่างกันรายต้น)
            // const baseCol = new THREE.Color(biome.trees.color[0]);
            const baseCol = new THREE.Color(0x00ff00);

            // // ปรับ HSL ให้ต่างกันรายต้น (Stable เพราะใช้ treeRng ของใครของมัน)
            // const hsl = { h: 0, s: 0, l: 0 };
            // baseCol.getHSL(hsl);
            // baseCol.setHSL(
            //     hsl.h + (treeRng() - 0.5) * 0.05,
            //     THREE.MathUtils.clamp(hsl.s + (treeRng() - 0.5) * 0.2, 0, 1),
            //     THREE.MathUtils.clamp(
            //         hsl.l + (treeRng() - 0.5) * 0.2,
            //         0.1,
            //         0.9,
            //     ),
            // );

            const height = getTerrainHeight(noise2D, worldX, worldZ);
            const rotateY = treeRng() * Math.PI * 2;

            groups[type]?.push({
                key: `tree_${chunkX}_${chunkZ}_${index}`,
                position: [worldX, height, worldZ],
                rotation: [0, rotateY, 0],
                scale: [scale, scale, scale],
                color: [baseCol.r, baseCol.g, baseCol.b],
            });
        }
        return groups;
    }, [
        seed,
        chunkX,
        chunkZ,
        variations,
        FOREST_DENSITY,
        CHUNK_SIZE,
        getBiomeConfig,
        getTerrainHeight,
        noise2D,
        createSeededRng,
    ]);

    const materials = useMemo(
        () => [
            new THREE.MeshToonMaterial({ color: woodColor }),
            new THREE.MeshToonMaterial({ vertexColors: true }),
        ],
        [],
    );

    return (
        <>
            {variations.map((variation) => {
                const instances = treeInstances[variation.key];
                if (!instances || instances.length === 0) return null;

                const colorsData = new Float32Array(instances.length * 3);
                instances.forEach((instance, index) => {
                    colorsData[index * 3] = instance.color[0];
                    colorsData[index * 3 + 1] = instance.color[1];
                    colorsData[index * 3 + 2] = instance.color[2];
                });

                return (
                    <InstancedRigidBodies
                        key={variation.key}
                        type="fixed"
                        colliders={false}
                        instances={instances}
                        colliderNodes={[
                            <CylinderCollider
                                key="col"
                                args={[1.5, variation.key === 'bush' ? 1 : 0.4]}
                                position={[
                                    0,
                                    variation.key === 'bush' ? 0.5 : 1.5,
                                    0,
                                ]}
                            />,
                        ]}
                    >
                        <instancedMesh
                            castShadow
                            receiveShadow
                            args={[variation.geo, materials, instances.length]}
                        >
                            <instancedBufferAttribute
                                attach="geometry-attributes-color"
                                args={[colorsData, 3]}
                            />
                        </instancedMesh>
                    </InstancedRigidBodies>
                );
            })}
        </>
    );
}

const TreeChunk = memo(TreeChunkComponent);
export default TreeChunk;
