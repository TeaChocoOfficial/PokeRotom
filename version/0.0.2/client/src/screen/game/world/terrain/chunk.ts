import * as THREE from 'three';

const RENDER_DISTANCE = 2;
export const CHUNK_SIZE = 64;
export const CHUNK_SEGMENTS = 32;

export type ChunkType = {
    key: string;
    chunkX: number;
    chunkZ: number;
};

/** คำนวณว่า chunk ไหนที่ player อยู่ */
export function getPlayerChunk(playerPos: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3(
        Math.floor(playerPos.x / CHUNK_SIZE),
        0,
        Math.floor(playerPos.z / CHUNK_SIZE),
    );
}
