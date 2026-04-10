// -Path: "PokeRotom/client/src/stores/cameraStore.ts"
'use client';
import * as THREE from 'three';
import { create } from 'zustand';

interface CameraState {
    yaw: number;
    offset: THREE.Vector3;
    lookOffset: THREE.Vector3;
    lerpSpeed: number;
    setYaw: (yaw: number) => void;
    addYaw: (delta: number) => void;
    setZoom: (deltaY: number) => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
    yaw: 0,
    lerpSpeed: 6,
    offset: new THREE.Vector3(0, 12, 14),
    lookOffset: new THREE.Vector3(0, 1.5, 0),
    setYaw: (yaw) => set({ yaw }),
    addYaw: (delta) => set((state) => ({ yaw: state.yaw + delta })),
    setZoom: (deltaY) =>
        set((state) => {
            const offset = state.offset.clone();
            offset.z = Math.max(6, Math.min(25, offset.z + deltaY * 0.02));
            offset.y = Math.max(5, Math.min(20, offset.y + deltaY * 0.01));
            return { offset };
        }),
}));
