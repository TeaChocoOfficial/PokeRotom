// -Path: "PokeRotom/client/src/screen/game/world/hooks/chunk.ts"
import * as THREE from 'three';
import { useControls } from 'leva';
import { useCallback } from 'react';

export type ChunkType = {
    key: string;
    chunkX: number;
    chunkZ: number;
};

export default function useChunk() {
    const { CHUNK_SIZE, CHUNK_SEGMENTS, RENDER_DISTANCE, FOREST_DENSITY } =
        useControls('chunk', {
            CHUNK_SIZE: 64,
            CHUNK_SEGMENTS: 32,
            RENDER_DISTANCE: 2,
            FOREST_DENSITY: 10,
        });

    /** คำนวณว่า chunk ไหนที่ player อยู่ */
    const getPlayerChunk = useCallback(
        (playerPos: THREE.Vector3): THREE.Vector3 => {
            return new THREE.Vector3(
                Math.floor(playerPos.x / CHUNK_SIZE),
                0,
                Math.floor(playerPos.z / CHUNK_SIZE),
            );
        },
        [],
    );
    return {
        CHUNK_SIZE,
        CHUNK_SEGMENTS,
        RENDER_DISTANCE,
        FOREST_DENSITY,
        getPlayerChunk,
    };
}
