// -Path: "PokeRotom/client/src/screen/game/world/terrain/Terrain.tsx"
import { Suspense, useMemo } from 'react';
import useNoise from '../hooks/noise';
import useChunk from '../hooks/chunk';
import TerrainChunk from './TerrainChunk';
import { type ChunkType } from '../hooks/chunk';
import { useGameStore } from '$/stores/gameStore';

export default function Terrain({ seed }: { seed: string }) {
    const {
        noise2D,
        segments,
        getBiomeConfig,
        patchNoiseFreq,
        getTerrainHeight,
    } = useNoise(seed);
    const { chunk } = useGameStore();
    const { CHUNK_SIZE, renderDistance } = useChunk();

    /** สร้างรายการ chunk keys ที่ต้อง render รอบ ๆ ตัวผู้เล่น (รูปแบบวงกลม) */
    const visibleChunks = useMemo(() => {
        const chunks: ChunkType[] = [];
        const distanceSq = renderDistance * renderDistance;

        for (let dz = -renderDistance; dz <= renderDistance; dz++) {
            for (let dx = -renderDistance; dx <= renderDistance; dx++) {
                if (dx * dx + dz * dz <= distanceSq) {
                    const cx = chunk.x + dx;
                    const cz = chunk.z + dz;
                    chunks.push({ chunkX: cx, chunkZ: cz, key: `${cx}_${cz}` });
                }
            }
        }
        return chunks;
    }, [chunk, renderDistance]);

    return (
        <Suspense fallback={null}>
            {visibleChunks.map((chunk) => (
                <TerrainChunk
                    key={chunk.key}
                    seed={seed}
                    noise2D={noise2D}
                    chunkX={chunk.chunkX}
                    chunkZ={chunk.chunkZ}
                    getTerrainHeight={getTerrainHeight}
                    getBiomeConfig={getBiomeConfig}
                    patchNoiseFreq={patchNoiseFreq}
                    segments={segments}
                    CHUNK_SIZE={CHUNK_SIZE}
                />
            ))}
        </Suspense>
    );
}
