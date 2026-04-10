// -Path: "PokeRotom/client/src/screen/game/world/tree/Trees.tsx"
'use client';
import {
    CHUNK_SIZE,
    createSeededRng,
    getTerrainHeight,
    createTerrainNoise,
} from '../terrain/Terrain';
import * as THREE from 'three';
import TreeModels from './TreeModels';
import { useState, useMemo } from 'react';
import { useGameStore } from '$/stores/gameStore';
import { useFrame, Vector3 } from '@react-three/fiber';

const RENDER_DISTANCE = 2;
const TREES_PER_CHUNK = 15;

/** สร้างรายการต้นไม้สำหรับ chunk เดียว */
function generateTreesForChunk(
    chunkX: number,
    chunkZ: number,
    seed: string,
    noise2D: ReturnType<typeof import('simplex-noise').createNoise2D>,
) {
    const originX = chunkX * CHUNK_SIZE + CHUNK_SIZE / 2;
    const originZ = chunkZ * CHUNK_SIZE + CHUNK_SIZE / 2;
    const chunkSeed = `${seed}_tree_${chunkX}_${chunkZ}`;
    const seededRandom = createSeededRng(chunkSeed, 77777);
    const instances = [];

    for (let index = 0; index < TREES_PER_CHUNK; index++) {
        const localX = (seededRandom() - 0.5) * CHUNK_SIZE * 0.9;
        const localZ = (seededRandom() - 0.5) * CHUNK_SIZE * 0.9;
        const worldX = originX + localX;
        const worldZ = originZ + localZ;

        // ใช้ noise ในการตัดสินใจว่าจะวางต้นไม้ตรงนี้ไหม
        const density = noise2D(worldX * 0.05, worldZ * 0.05);
        if (density < -0.2) continue;

        // กันไม่ให้ต้นไม้อยู่ใกล้จุดเกิด (0,0) เกินไป
        const distFromOrigin = Math.sqrt(worldX * worldX + worldZ * worldZ);
        if (distFromOrigin < 15) continue;

        const scale = 0.8 + seededRandom() * 1.2;
        const rotationY = seededRandom() * Math.PI * 2;
        const posY = getTerrainHeight(noise2D, worldX, worldZ);

        instances.push({
            key: `tree_${chunkX}_${chunkZ}_${index}`,
            scale: [scale, scale, scale] as Vector3,
            rotation: [0, rotationY, 0] as Vector3,
            position: [worldX, posY, worldZ] as Vector3,
        });
    }
    return instances;
}

/** คำนวณว่า player อยู่ chunk ไหน */
function getPlayerChunk(playerPos: THREE.Vector3) {
    return {
        chunkX: Math.floor(playerPos.x / CHUNK_SIZE),
        chunkZ: Math.floor(playerPos.z / CHUNK_SIZE),
    };
}

export default function Trees({ seed }: { seed: string }) {
    const {
        player: { position: playerPosition },
    } = useGameStore();

    const noise2D = useMemo(() => createTerrainNoise(seed), [seed]);

    const [currentChunk, setCurrentChunk] = useState(() =>
        getPlayerChunk(playerPosition),
    );

    useFrame(() => {
        const { chunkX, chunkZ } = getPlayerChunk(playerPosition);
        if (chunkX !== currentChunk.chunkX || chunkZ !== currentChunk.chunkZ)
            setCurrentChunk({ chunkX, chunkZ });
    });

    const instanceData = useMemo(() => {
        const allInstances = [];
        for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
            for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
                const cx = currentChunk.chunkX + dx;
                const cz = currentChunk.chunkZ + dz;
                allInstances.push(
                    ...generateTreesForChunk(cx, cz, seed, noise2D),
                );
            }
        }
        return allInstances;
    }, [currentChunk, seed, noise2D]);

    const treeCount = instanceData.length;

    if (treeCount === 0) return null;

    return <TreeModels instances={instanceData} />;
}
