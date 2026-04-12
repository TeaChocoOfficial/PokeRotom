// -Path: "PokeRotom/client/src/screen/game/world/terrain/Terrain.tsx"
import { useMemo } from 'react';
import useNoise from '../hooks/noise';
import useChunk from '../hooks/chunk';
import TerrainChunk from './TerrainChunk';
import { type ChunkType } from '../hooks/chunk';
import { useGameStore } from '$/stores/gameStore';

export default function Terrain({ seed }: { seed: string }) {
    const { simplex2 } = useNoise();
    const { chunk } = useGameStore();
    const { RENDER_DISTANCE } = useChunk();
    const noise2D = useMemo(() => simplex2(seed), [seed, simplex2]);

    /** สร้างรายการ chunk keys ที่ต้อง render รอบ ๆ ตัวผู้เล่น */
    const visibleChunks = useMemo(() => {
        const chunks: ChunkType[] = [];
        for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
            for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
                const cx = chunk.x + dx;
                const cz = chunk.z + dz;
                chunks.push({ chunkX: cx, chunkZ: cz, key: `${cx}_${cz}` });
            }
        }
        return chunks;
    }, [chunk, RENDER_DISTANCE]);

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
