//-Path: "PokeRotom/client/src/stores/settingStore.ts"
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SettingKeys = keyof Omit<
    SettingState,
    'setSetting' | 'toggleSetting'
>;

interface SettingState {
    sound: boolean;
    music: boolean;
    vibration: boolean;
    animation: boolean;
    darkMode: boolean;
    notifications: boolean;
    setSetting: (key: SettingKeys, value: boolean) => void;
    toggleSetting: (key: SettingKeys) => void;
}

export const useSettingStore = create<SettingState>()(
    persist(
        (set) => ({
            sound: true,
            music: true,
            vibration: false,
            animation: true,
            darkMode: true,
            notifications: true,
            setSetting: (key, value) => {
                set({ [key]: value });
            },
            toggleSetting: (key) => {
                set((state) => ({ [key]: !state[key] }));
            },
        }),
        {
            name: 'pokerotom-settings',
        },
    ),
);
