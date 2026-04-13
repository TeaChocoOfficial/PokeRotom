// -Path: "PokeRotom/client/src/stores/cameraStore.ts"
import * as THREE from 'three';
import { create } from 'zustand';
import { isDev } from '$/secure/env';

interface CameraState {
    yaw: number;
    pitch: number;
    lerpSpeed: number;
    offset: THREE.Vector3;
    lookOffset: THREE.Vector3;
    setYaw: (yaw: number) => void;
    setZoom: (deltaY: number) => void;
    setPitch: (pitch: number) => void;
    addRotation: (yaw: number, pitch: number) => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
    yaw: 0,
    pitch: 0,
    lerpSpeed: 6,
    offset: new THREE.Vector3(0, 12, 14),
    lookOffset: new THREE.Vector3(0, 1.5, 0),
    setYaw: (yaw) => set({ yaw }),
    setPitch: (pitch) => set({ pitch }),
    addRotation: (yaw, pitch) =>
        set((state) => ({
            yaw: state.yaw + yaw,
            pitch: Math.max(-1.5, Math.min(1.5, state.pitch + pitch)),
        })),
    setZoom: (deltaY) =>
        set((state) => {
            const offset = state.offset.clone();
            const maxPush = isDev ? Infinity : 0;
            offset.z = Math.max(
                6,
                Math.min(25 + maxPush, offset.z + deltaY * 0.02),
            );
            offset.y = Math.max(
                5,
                Math.min(20 + maxPush, offset.y + deltaY * 0.01),
            );
            return { offset };
        }),
}));
