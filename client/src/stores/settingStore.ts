// -Path: "PokeRotom/client/src/stores/settingStore.ts"
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum BaseQuality {
    CUSTOM = 'custom',
    VERY_LOW = 'very_low',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    VERY_HIGH = 'very_high',
}

export enum Quality {
    NONE = 'none',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum FullQuality {
    VERY_LOW = 'very_low',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    VERY_HIGH = 'very_high',
}

export interface SettingState {
    quality: BaseQuality;
    bloomQuality: Quality;
    mirrorQuality: FullQuality;
    renderDistance: number;
    powerPreference: WebGLPowerPreference;
    setQuality: (quality: BaseQuality) => void;
    setBloomQuality: (bloomQuality: Quality) => void;
    setMirrorQuality: (mirrorQuality: FullQuality) => void;
    setRenderDistance: (renderDistance: number) => void;
    setPowerPreference: (powerPreference: WebGLPowerPreference) => void;
}

export const useSettingStore = create<SettingState>()(
    persist(
        (set) => ({
            quality: BaseQuality.MEDIUM,
            bloomQuality: Quality.MEDIUM,
            mirrorQuality: FullQuality.MEDIUM,
            renderDistance: 4,
            powerPreference: 'default',
            setQuality: (quality: BaseQuality) => {
                switch (quality) {
                    case BaseQuality.VERY_LOW:
                        set({
                            quality,
                            bloomQuality: Quality.NONE,
                            mirrorQuality: FullQuality.VERY_LOW,
                            renderDistance: 2,
                            powerPreference: 'low-power',
                        });
                        return;
                    case BaseQuality.LOW:
                        set({
                            quality,
                            bloomQuality: Quality.LOW,
                            mirrorQuality: FullQuality.LOW,
                            renderDistance: 4,
                            powerPreference: 'default',
                        });
                        return;
                    case BaseQuality.MEDIUM:
                        set({
                            quality,
                            bloomQuality: Quality.MEDIUM,
                            mirrorQuality: FullQuality.MEDIUM,
                            renderDistance: 8,
                            powerPreference: 'default',
                        });
                        return;
                    case BaseQuality.HIGH:
                        set({
                            quality,
                            bloomQuality: Quality.HIGH,
                            mirrorQuality: FullQuality.HIGH,
                            renderDistance: 16,
                            powerPreference: 'high-performance',
                        });
                        return;
                    case BaseQuality.CUSTOM:
                        set({ quality });
                        return;
                    case BaseQuality.VERY_HIGH:
                        set({
                            quality,
                            bloomQuality: Quality.HIGH,
                            mirrorQuality: FullQuality.VERY_HIGH,
                            renderDistance: 32,
                            powerPreference: 'high-performance',
                        });
                        return;
                }
            },
            setBloomQuality: (bloomQuality: Quality) =>
                set({ bloomQuality, quality: BaseQuality.CUSTOM }),
            setMirrorQuality: (mirrorQuality: FullQuality) =>
                set({ mirrorQuality, quality: BaseQuality.CUSTOM }),
            setRenderDistance: (renderDistance: number) =>
                set({ renderDistance, quality: BaseQuality.CUSTOM }),
            setPowerPreference: (powerPreference: WebGLPowerPreference) =>
                set({ powerPreference, quality: BaseQuality.CUSTOM }),
        }),
        { name: 'pokerotom-setting' },
    ),
);
