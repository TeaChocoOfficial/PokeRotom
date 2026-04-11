// -Path: "PokeRotom/client/src/screen/game/world/terrain/Terrain.tsx"
import { useMemo } from 'react';
import { simplex2 } from './noise';
import { type ChunkType } from './chunk';
import TerrainChunk from './TerrainChunk';
import { RENDER_DISTANCE } from './chunk';
import { createNoise2D } from 'simplex-noise';
import { useGameStore } from '$/stores/gameStore';

/** คำนวณความสูงของพื้นจาก noise (ใช้ world position) */
export function getTerrainHeight(
    noise2D: ReturnType<typeof createNoise2D>,
    worldX: number,
    worldZ: number,
) {
    return (
        noise2D(worldX * 0.02, worldZ * 0.02) * 5 +
        noise2D(worldX * 0.1, worldZ * 0.1) * 1
    );
}

/** สร้างรายการ chunk keys ที่ต้อง render รอบ ๆ ตัวผู้เล่น */
function getVisibleChunks(chunkX: number, chunkZ: number): ChunkType[] {
    const chunks: ChunkType[] = [];
    for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
        for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
            const cx = chunkX + dx;
            const cz = chunkZ + dz;
            chunks.push({ chunkX: cx, chunkZ: cz, key: `${cx}_${cz}` });
        }
    }
    return chunks;
}

export default function Terrain({ seed }: { seed: string }) {
    const { chunk } = useGameStore();
    const noise2D = useMemo(() => simplex2(seed), [seed]);

    const visibleChunks = useMemo(
        () => getVisibleChunks(chunk.x, chunk.z),
        [chunk],
    );

    return (
        <>
            {visibleChunks.map((chunk) => (
                <TerrainChunk
                    key={chunk.key}
                    seed={seed}
                    noise2D={noise2D}
                    chunkX={chunk.chunkX}
                    chunkZ={chunk.chunkZ}
                />
            ))}
        </>
    );
}
