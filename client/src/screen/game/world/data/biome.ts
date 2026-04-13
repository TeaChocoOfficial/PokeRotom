// - Path: "client/src/screen/game/world/data/biome.ts"
import type { Color } from '@react-three/fiber';

export type BiomePreset = {
    terrains: {
        colors: Color[];
        amplitude: number;
        detailScale: number;
        detailAmplitude: number;
        microScale: number;
        microAmplitude: number;
    };
    trees: {
        density: number;

        minHeight: number;
        maxSlope: number;
        weights: { oak: number; pine: number; bush: number };
        scale: [number, number];
        color: Color[];
    };
    water: {
        color: Color;
        opacity: number;
    };
};

export type BiomePresetKeys =
    | 'smooth'
    | 'rollingHills'
    | 'mountain'
    | 'cratered'
    | 'sand'
    | 'island'
    | 'desert'
    | 'denseForest'
    | 'cliff'
    | 'swamp'
    | 'default';

export type BiomeConfig = Record<BiomePresetKeys, BiomePreset>;

export const biomePresets: BiomeConfig = {
    // เรียบ สวยงาม เหมือนทุ่งหญ้า
    smooth: {
        terrains: {
            colors: ['#8ec968', '#73ab4f'],
            amplitude: 8,
            detailScale: 3,
            detailAmplitude: 1.5,
            microScale: 10,
            microAmplitude: 0.3,
        },
        trees: {
            density: 0.2,
            minHeight: 0.5,
            maxSlope: 0.8,
            weights: { oak: 0.7, pine: 0.1, bush: 0.2 },
            scale: [0.8, 1.2],
            color: ['#84aa55'],
        },
        water: {
            color: '#3a8bd6',
            opacity: 0.6,
        },
    },

    // เนินเขาลูกคลื่น เหมาะกับชนบท
    rollingHills: {
        terrains: {
            colors: ['#a3c968', '#639e4f'],
            amplitude: 15,
            detailScale: 4,
            detailAmplitude: 4,
            microScale: 12,
            microAmplitude: 0.8,
        },
        trees: {
            density: 0.3,
            minHeight: 1,
            maxSlope: 0.7,
            weights: { oak: 0.4, pine: 0.4, bush: 0.2 },
            scale: [1.0, 1.5],
            color: ['#5c803a'],
        },
        water: {
            color: '#4a90c4',
            opacity: 0.55,
        },
    },

    // ภูเขาสูงชัน เหมาะกับแนวเขา
    mountain: {
        terrains: {
            colors: ['#555555', '#bbbbbb', '#ffffff'],
            amplitude: 40,
            detailScale: 3,
            detailAmplitude: 10,
            microScale: 8,
            microAmplitude: 2,
        },
        trees: {
            density: 0.1,
            minHeight: 5,
            maxSlope: 0.5,
            weights: { oak: 0.1, pine: 0.8, bush: 0.1 },
            scale: [1.2, 2.0],
            color: ['#425c42'],
        },
        water: {
            color: '#2a6fa8',
            opacity: 0.7,
        },
    },

    // ขรุขระ เหมือนพื้นผิวดวงจันทร์
    cratered: {
        terrains: {
            colors: ['#444444', '#777777', '#999999'],
            amplitude: 12,
            detailScale: 8,
            detailAmplitude: 5,
            microScale: 20,
            microAmplitude: 1.5,
        },
        trees: {
            density: 0.05,
            minHeight: 0,
            maxSlope: 0.4,
            weights: { oak: 0.2, pine: 0.1, bush: 0.7 },
            scale: [1.0, 1.2],
            color: ['#556b2f'],
        },
        water: {
            color: '#1a4a6a',
            opacity: 0.8,
        },
    },

    // พื้นที่ทราย
    sand: {
        terrains: {
            colors: ['#f2d2a9', '#e6c291', '#d9b37a'],
            amplitude: 5,
            detailScale: 5,
            detailAmplitude: 3,
            microScale: 15,
            microAmplitude: 0.5,
        },
        trees: {
            density: 0.05,
            minHeight: 1,
            maxSlope: 0.6,
            weights: { oak: 0.1, pine: 0.1, bush: 0.8 },
            scale: [0.8, 1.0],
            color: ['#d2b48c'],
        },
        water: {
            color: '#1ca3d8',
            opacity: 0.45,
        },
    },

    // เกาะ/หมู่เกาะ (ต้องใช้ mask เพิ่ม)
    island: {
        terrains: {
            colors: ['#dcd295', '#8ec968', '#5e9e42'],
            amplitude: 25,
            detailScale: 5,
            detailAmplitude: 5,
            microScale: 15,
            microAmplitude: 0.6,
        },
        trees: {
            density: 0.15,
            minHeight: 2,
            maxSlope: 0.7,
            weights: { oak: 0.5, pine: 0.2, bush: 0.3 },
            scale: [0.9, 1.3],
            color: ['#889e4f'],
        },
        water: {
            color: '#0e87c9',
            opacity: 0.5,
        },
    },

    // ทะเลทราย + เนินทราย
    desert: {
        terrains: {
            colors: ['#e0cd86', '#d6b658', '#c2a84a'],
            amplitude: 6,
            detailScale: 6,
            detailAmplitude: 2,
            microScale: 25,
            microAmplitude: 0.4,
        },
        trees: {
            density: 0.02,
            minHeight: 0,
            maxSlope: 0.5,
            weights: { oak: 0, pine: 0, bush: 1.0 },
            scale: [0.5, 0.8],
            color: ['#b0a060'],
        },
        water: {
            color: '#5a9ab5',
            opacity: 0.35,
        },
    },

    // ป่าทึบ ภูมิประเทศขรุขระปานกลาง
    denseForest: {
        terrains: {
            colors: ['#2d4d1a', '#3d5d2a', '#1d3d0a'],
            amplitude: 10,
            detailScale: 7,
            detailAmplitude: 5,
            microScale: 18,
            microAmplitude: 1,
        },
        trees: {
            density: 0.9,
            minHeight: -1,
            maxSlope: 0.9,
            weights: { oak: 0.8, pine: 0.1, bush: 0.1 },
            scale: [1.3, 1.8],
            color: ['#2d4d1a'],
        },
        water: {
            color: '#2a5a3a',
            opacity: 0.7,
        },
    },

    // หน้าผาสูงชันมาก
    cliff: {
        terrains: {
            colors: ['#5a544c', '#403a32', '#2a241c'],
            amplitude: 50,
            detailScale: 2,
            detailAmplitude: 12,
            microScale: 6,
            microAmplitude: 3,
        },
        trees: {
            density: 0.05,
            minHeight: 3,
            maxSlope: 0.3,
            weights: { oak: 0.2, pine: 0.7, bush: 0.1 },
            scale: [1.2, 2.5],
            color: ['#3a4a3a'],
        },
        water: {
            color: '#1a3a5a',
            opacity: 0.75,
        },
    },

    // หนองน้ำ/พื้นที่ราบน้ำท่วมถึง
    swamp: {
        terrains: {
            colors: ['#565e42', '#3e452a', '#2a301a'],
            amplitude: 4,
            detailScale: 10,
            detailAmplitude: 0.8,
            microScale: 30,
            microAmplitude: 0.15,
        },
        trees: {
            density: 0.6,
            minHeight: -2,
            maxSlope: 1,
            weights: { oak: 0.2, pine: 0.1, bush: 0.7 },
            scale: [1.0, 1.2],
            color: ['#454a3a'],
        },
        water: {
            color: '#3a5a3a',
            opacity: 0.8,
        },
    },

    // เริ่มต้น (ค่า default เดิม)
    default: {
        terrains: {
            colors: ['#5e9e42', '#7cb85c'],
            amplitude: 15,
            detailScale: 5,
            detailAmplitude: 3,
            microScale: 15,
            microAmplitude: 0.6,
        },
        trees: {
            density: 0.25,
            minHeight: 0.5,
            maxSlope: 0.75,
            weights: { oak: 0.6, pine: 0.2, bush: 0.2 },
            scale: [1.0, 1.3],
            color: ['#6b8e23'],
        },
        water: {
            color: '#3a7abd',
            opacity: 0.55,
        },
    },
};
