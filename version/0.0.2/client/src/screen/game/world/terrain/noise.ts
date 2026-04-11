// -Path: "PokeRotom/client/src/screen/game/world/terrain/noise.ts"
'use client';
import { createNoise2D, createNoise3D } from 'simplex-noise';

/** สร้าง mulberry32 RNG จาก seed string */
export function createSeededRng(seed: string, offset = 0) {
    let hash = offset;
    for (let index = 0; index < seed.length; index++) {
        hash = (hash << 5) - hash + seed.charCodeAt(index);
        hash |= 0;
    }
    return () => {
        hash |= 0;
        hash = (hash + 0x9e3779b9) | 0;
        let t = hash ^ (hash >>> 16);
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ (t >>> 15);
        t = Math.imul(t, 0x735a2d97);
        t = t ^ (t >>> 15);
        return (t >>> 0) / 4294967296;
    };
}

/** สร้าง noise2D จาก seed (Export ให้ Trees ใช้ร่วมกัน) */
export function simplex2(seed: string) {
    return createNoise2D(createSeededRng(seed));
}

export function simplex3(seed: string) {
    return createNoise3D(createSeededRng(seed));
}
