// -Path: "PokeRotom/client/src/screen/game/world/hooks/noise.ts"
import { useControls } from 'leva';
import { useCallback, useMemo } from 'react';
import { createNoise2D, type NoiseFunction2D } from 'simplex-noise';

export type Noise2D = ReturnType<typeof createNoise2D>;
export type Simplex2 = (seed: string) => NoiseFunction2D;
export type CreateSeededRng = (seed: string, offset?: number) => () => number;
export type GetTerrainHeight = (
    noise2D: NoiseFunction2D,
    worldX: number,
    worldZ: number,
) => number;
export type UseNoise = {
    simplex2: Simplex2;
    createSeededRng: CreateSeededRng;
    getTerrainHeight: GetTerrainHeight;
};

// terrainPresets.ts
export const terrainPresets = {
    // เรียบ สวยงาม เหมือนทุ่งหญ้า
    smooth: {
        scale: 0.01,
        amplitude: 3,
        detailScale: 3,
        detailAmplitude: 0.5,
        microScale: 10,
        microAmplitude: 0.1,
        offsetY: 0,
    },

    // เนินเขาลูกคลื่น เหมาะกับชนบท
    rollingHills: {
        scale: 0.02,
        amplitude: 5,
        detailScale: 4,
        detailAmplitude: 1.2,
        microScale: 12,
        microAmplitude: 0.3,
        offsetY: 0,
    },

    // ภูเขาสูงชัน เหมาะกับแนวเขา
    mountain: {
        scale: 0.015,
        amplitude: 12,
        detailScale: 3,
        detailAmplitude: 3,
        microScale: 8,
        microAmplitude: 0.8,
        offsetY: -2,
    },

    // ขรุขระ เหมือนพื้นผิวดวงจันทร์
    cratered: {
        scale: 0.03,
        amplitude: 4,
        detailScale: 8,
        detailAmplitude: 2,
        microScale: 20,
        microAmplitude: 0.5,
        offsetY: 0,
    },

    // เกาะ/หมู่เกาะ (ต้องใช้ mask เพิ่ม)
    island: {
        scale: 0.025,
        amplitude: 8,
        detailScale: 5,
        detailAmplitude: 1.5,
        microScale: 15,
        microAmplitude: 0.2,
        offsetY: -3,
    },

    // ทะเลทราย + เนินทราย
    desert: {
        scale: 0.008,
        amplitude: 2,
        detailScale: 6,
        detailAmplitude: 0.8,
        microScale: 25,
        microAmplitude: 0.15,
        offsetY: 0.5,
    },

    // ป่าทึบ ภูมิประเทศขรุขระปานกลาง
    denseForest: {
        scale: 0.018,
        amplitude: 6,
        detailScale: 7,
        detailAmplitude: 1.8,
        microScale: 18,
        microAmplitude: 0.4,
        offsetY: 0,
    },

    // หน้าผาสูงชันมาก
    cliff: {
        scale: 0.012,
        amplitude: 15,
        detailScale: 2,
        detailAmplitude: 4,
        microScale: 6,
        microAmplitude: 1.2,
        offsetY: -5,
    },

    // หนองน้ำ/พื้นที่ราบน้ำท่วมถึง
    swamp: {
        scale: 0.022,
        amplitude: 1.5,
        detailScale: 10,
        detailAmplitude: 0.3,
        microScale: 30,
        microAmplitude: 0.05,
        offsetY: -1,
    },

    // เริ่มต้น (ค่า default เดิม)
    default: {
        scale: 0.02,
        amplitude: 5,
        detailScale: 5,
        detailAmplitude: 1,
        microScale: 15,
        microAmplitude: 0.2,
        offsetY: 0,
    },
} as const;

export type TerrainPreset = keyof typeof terrainPresets;
export type TerrainConfig =
    (typeof terrainPresets)[keyof typeof terrainPresets];

export default function useNoise(): UseNoise {
    // const {
    //     scale,
    //     amplitude,
    //     detailScale,
    //     detailAmplitude,
    //     microScale,
    //     microAmplitude,
    //     offsetY,
    // } = useControls('noise', {
    //     scale: { value: 0.02, min: 0.001, max: 0.1, step: 0.001 },
    //     amplitude: { value: 5, min: 0, max: 50, step: 0.1 },
    //     detailScale: { value: 5, min: 0.5, max: 20, step: 0.1 },
    //     detailAmplitude: { value: 1, min: 0, max: 20, step: 0.1 },
    //     microScale: { value: 15, min: 1, max: 50, step: 0.1 },
    //     microAmplitude: { value: 0.2, min: 0, max: 5, step: 0.05 },
    //     offsetY: { value: 0, min: -20, max: 20, step: 0.5 },
    // });

    const { set } = useControls('noise', {
        set: {
            value: 'cliff',
            options: Object.keys(terrainPresets),
        },
    });

    const {
        scale,
        amplitude,
        detailScale,
        detailAmplitude,
        microScale,
        microAmplitude,
        offsetY,
    } = useMemo(() => terrainPresets[set], [set]);

    /** สร้าง mulberry32 RNG จาก seed string */
    const createSeededRng: CreateSeededRng = useCallback(
        (seed: string, offset = 0) => {
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
        },
        [],
    );

    /** สร้าง noise2D จาก seed (Export ให้ Trees ใช้ร่วมกัน) */
    const simplex2 = useCallback(
        (seed: string) => createNoise2D(createSeededRng(seed)),
        [createNoise2D, createSeededRng],
    );

    /** คำนวณความสูงของพื้นจาก noise (ใช้ world position) */
    const getTerrainHeight: GetTerrainHeight = useCallback(
        (noise2D, worldX, worldZ) =>
            noise2D(worldX * scale, worldZ * scale) * amplitude +
            noise2D(
                worldX * scale * detailScale,
                worldZ * scale * detailScale,
            ) *
                detailAmplitude +
            noise2D(worldX * scale * microScale, worldZ * scale * microScale) *
                microAmplitude +
            offsetY,
        [
            scale,
            amplitude,
            detailScale,
            detailAmplitude,
            microScale,
            microAmplitude,
            offsetY,
        ],
    );

    return { simplex2, createSeededRng, getTerrainHeight };
}
