// -Path: "PokeRotom/client/src/screen/game/world/hooks/noise.ts"
import {
    biomePresets,
    type BiomePreset,
    type BiomePresetKeys,
} from '../data/biome';
import * as THREE from 'three';
import { useControls } from 'leva';
import { useCallback, useMemo } from 'react';
import type { ReactThreeFiber } from '@react-three/fiber';
import { createNoise2D, type NoiseFunction2D } from 'simplex-noise';

export type Noise2D = ReturnType<typeof createNoise2D>;
export type Simplex2 = (seed: string) => NoiseFunction2D;
export type CreateSeededRng = (seed: string, offset?: number) => () => number;
export type GetTerrainHeight = (worldX: number, worldZ: number) => number;
export type UseNoise = {
    noise2D: NoiseFunction2D;
    createSeededRng: CreateSeededRng;
    getTerrainHeight: GetTerrainHeight;
    getBiomeConfig: (worldX: number, worldZ: number) => BiomePreset;
    colors: ReactThreeFiber.Color[];
    patchNoiseFreq: number;
    segments: number;
};

/** พรีโปรเซสสีใน biomePresets ให้เป็น THREE.Color ทั้งหมดเพื่อลดการสร้าง object ใหม่ */
const parsedBiomePresets = Object.keys(biomePresets).reduce(
    (acc, key) => {
        const preset = biomePresets[key as BiomePresetKeys];
        acc[key as BiomePresetKeys] = {
            ...preset,
            threeColors: preset.terrains.colors.map(
                (clr) => new THREE.Color(clr as string),
            ),
            threeTreeColors: preset.trees.color.map(
                (clr) => new THREE.Color(clr as string),
            ),
        };
        return acc;
    },
    {} as Record<
        BiomePresetKeys,
        (typeof biomePresets)[BiomePresetKeys] & {
            threeColors: THREE.Color[];
            threeTreeColors: THREE.Color[];
        }
    >,
);

export default function useNoise(seed?: string): UseNoise {
    const { set, noiseScale, patchNoiseFreq, segments, biomeScale } =
        useControls('noise', {
            set: {
                value: 'auto' as BiomePresetKeys | 'auto',
                options: ['auto', ...Object.keys(biomePresets)],
            },
            noiseScale: { value: 0.005, min: 0.001, max: 0.2, step: 0.001 },
            biomeScale: { value: 0.0005, min: 0.0001, max: 0.01, step: 0.0001 },
            patchNoiseFreq: { value: 0.04, min: 0.001, max: 0.2, step: 0.001 },
            segments: { value: 64, min: 8, max: 128, step: 1 },
        });

    const { colors } = useMemo(() => {
        if (set === 'auto') return biomePresets.default.terrains;
        return biomePresets[set as BiomePresetKeys].terrains;
    }, [set]);

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

    const noise2D = useCallback(createNoise2D(createSeededRng(seed || 'default')), [
        seed,
        createNoise2D,
        createSeededRng,
    ]);

    const biomeNoise2D = useCallback(
        createNoise2D(createSeededRng(seed || 'biome-seed')),
        [createSeededRng, seed],
    );

    const getBiomeConfig = useCallback(
        (worldX: number, worldZ: number): BiomePreset => {
            if (set !== 'auto') return biomePresets[set as BiomePresetKeys];

            const n = biomeNoise2D(worldX * biomeScale, worldZ * biomeScale);
            const keys = Object.keys(biomePresets) as BiomePresetKeys[];
            const normalized = (n + 1) / 2; // 0 to 1

            // คำนวณ Index แบบทศนิยมเพื่อใช้หา Biome 2 อันที่อยู่ติดกัน
            const floatIndex = normalized * (keys.length - 1);
            const index1 = Math.floor(floatIndex);
            const index2 = Math.min(index1 + 1, keys.length - 1);
            const t = floatIndex - index1; // ค่าความคืบหน้า 0 (Biome1) ไป 1 (Biome2)

            const b1 = parsedBiomePresets[keys[index1]];
            const b2 = parsedBiomePresets[keys[index2]];

            // ฟังก์ชันช่วย Lerp ตัวเลข
            const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

            // ผสมผสานค่า Config ของ 2 Biome เข้าด้วยกันให้ Smooth
            // Note: ส่งคืนเฉพาะค่าดิบที่จำเป็นเพื่อลด CPU ในการสร้าง object ใหญ่ๆ ใน Loop พื้นที่

            // ใช้ Biome ที่ค่อนข้างเด่นกว่าสำหรับข้อมูลพรรณไม้ เพื่อลดปัญหา RNG Shift (สีกะพริบ)
            const dominantBiome = t < 0.5 ? b1 : b2;

            return {
                terrains: {
                    amplitude: lerp(
                        b1.terrains.amplitude,
                        b2.terrains.amplitude,
                        t,
                    ),
                    detailScale: lerp(
                        b1.terrains.detailScale,
                        b2.terrains.detailScale,
                        t,
                    ),
                    detailAmplitude: lerp(
                        b1.terrains.detailAmplitude,
                        b2.terrains.detailAmplitude,
                        t,
                    ),
                    microScale: lerp(
                        b1.terrains.microScale,
                        b2.terrains.microScale,
                        t,
                    ),
                    microAmplitude: lerp(
                        b1.terrains.microAmplitude,
                        b2.terrains.microAmplitude,
                        t,
                    ),
                    colors: b1.threeColors.map((col1, index) => {
                        const col2 = b2.threeColors[index] || col1;
                        return col1.clone().lerp(col2, t).getHex();
                    }),
                },
                trees: {
                    density: dominantBiome.trees.density,
                    minHeight: dominantBiome.trees.minHeight,
                    maxSlope: dominantBiome.trees.maxSlope,
                    scale: dominantBiome.trees.scale,
                    weights: dominantBiome.trees.weights,
                    color: dominantBiome.threeTreeColors.map((clr) =>
                        clr.getHex(),
                    ),
                },
                water: {
                    color: new THREE.Color(b1.water.color as string)
                        .clone()
                        .lerp(
                            new THREE.Color(b2.water.color as string),
                            t,
                        )
                        .getHex(),
                    opacity: lerp(b1.water.opacity, b2.water.opacity, t),
                },
            };
        },
        [set, biomeNoise2D, biomeScale],
    );

    /** คำนวณความสูงของพื้นจาก noise (ใช้ world position) */
    const getTerrainHeight: GetTerrainHeight = useCallback(
        (worldX, worldZ) => {
            const { terrains } = getBiomeConfig(worldX, worldZ);
            const {
                amplitude,
                detailScale,
                detailAmplitude,
                microScale,
                microAmplitude,
            } = terrains;

            return (
                noise2D(worldX * noiseScale, worldZ * noiseScale) * amplitude +
                noise2D(
                    worldX * noiseScale * detailScale,
                    worldZ * noiseScale * detailScale,
                ) *
                    detailAmplitude +
                noise2D(
                    worldX * noiseScale * microScale,
                    worldZ * noiseScale * microScale,
                ) *
                    microAmplitude
            );
        },
        [noiseScale, noise2D, getBiomeConfig],
    );

    return {
        colors,
        segments,
        noise2D,
        getBiomeConfig,
        createSeededRng,
        getTerrainHeight,
        patchNoiseFreq,
    };
}
