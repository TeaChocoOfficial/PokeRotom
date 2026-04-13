// -Path: "PokeRotom/client/src/stores/settingStore.ts"
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum BaseQuality {
    CUSTOM = 'custom',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum Quality {
    NONE = 'none',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export interface SettingState {
    quality: BaseQuality;
    bloomQuality: Quality;
    mirrorQuality: Quality;
    powerPreference: WebGLPowerPreference;
    setQuality: (quality: BaseQuality) => void;
    setBloomQuality: (bloomQuality: Quality) => void;
    setMirrorQuality: (mirrorQuality: Quality) => void;
    setPowerPreference: (powerPreference: WebGLPowerPreference) => void;
}

export const useSettingStore = create<SettingState>()(
    persist(
        (set) => ({
            quality: BaseQuality.MEDIUM,
            bloomQuality: Quality.MEDIUM,
            mirrorQuality: Quality.MEDIUM,
            powerPreference: 'default',
            setQuality: (quality: BaseQuality) => {
                switch (quality) {
                    case BaseQuality.LOW:
                        set({
                            quality,
                            bloomQuality: Quality.NONE,
                            mirrorQuality: Quality.NONE,
                            powerPreference: 'low-power',
                        });
                        return;
                    case BaseQuality.MEDIUM:
                        set({
                            quality,
                            bloomQuality: Quality.MEDIUM,
                            mirrorQuality: Quality.MEDIUM,
                            powerPreference: 'default',
                        });
                        return;
                    case BaseQuality.HIGH:
                        set({
                            quality,
                            bloomQuality: Quality.HIGH,
                            mirrorQuality: Quality.HIGH,
                            powerPreference: 'high-performance',
                        });
                        return;
                    case BaseQuality.CUSTOM:
                        set({ quality });
                        return;
                }
            },
            setBloomQuality: (bloomQuality: Quality) =>
                set({ bloomQuality, quality: BaseQuality.CUSTOM }),
            setMirrorQuality: (mirrorQuality: Quality) =>
                set({ mirrorQuality, quality: BaseQuality.CUSTOM }),
            setPowerPreference: (powerPreference: WebGLPowerPreference) =>
                set({ powerPreference, quality: BaseQuality.CUSTOM }),
        }),
        { name: 'pokerotom-setting' },
    ),
);
