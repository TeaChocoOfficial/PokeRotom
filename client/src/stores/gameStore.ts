// -Path: "PokeRotom/client/src/stores/gameStore.ts"
'use client';
import * as THREE from 'three';
import { create } from 'zustand';

export type MovementState = 'idle' | 'walking' | 'running';

interface PlayerState {
    rotation: THREE.Euler;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    movementState: MovementState;
}

interface GameState {
    fps: number;
    time: number;
    player: PlayerState;
    isMenuOpen: boolean;
    isChatOpen: boolean;
    isChatFocused: boolean;
    isSettingsOpen: boolean;
    setFps: (fps: number) => void;
    setTime: (time: number) => void;
    addTime: (time: number) => void;
    setChatOpen: (open: boolean) => void;
    setMenuOpen: (open: boolean) => void;
    setSettingsOpen: (open: boolean) => void;
    setChatFocused: (focused: boolean) => void;
    setMovementState: (state: MovementState) => void;
    setPlayerRotation: (rotation: THREE.Euler) => void;
    setPlayerPosition: (position: THREE.Vector3) => void;
    setPlayerVelocity: (velocity: THREE.Vector3) => void;
}

export const useGameStore = create<GameState>()((set) => ({
    fps: 0,
    time: 0,
    player: {
        rotation: new THREE.Euler(0, 0, 0),
        position: new THREE.Vector3(0, 2, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        movementState: 'idle',
    },
    isChatOpen: false,
    isMenuOpen: false,
    isChatFocused: false,
    isSettingsOpen: false,
    setFps: (fps) => set({ fps }),
    setTime: (time) => set({ time }),
    addTime: (time) => set((state) => ({ time: state.time + time })),
    setChatOpen: (isChatOpen) => set({ isChatOpen }),
    setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
    setChatFocused: (isChatFocused) => set({ isChatFocused }),
    setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
    setPlayerPosition: (position) =>
        set((state) => ({ player: { ...state.player, position } })),
    setPlayerRotation: (rotation) =>
        set((state) => ({ player: { ...state.player, rotation } })),
    setPlayerVelocity: (velocity) =>
        set((state) => ({ player: { ...state.player, velocity } })),
    setMovementState: (movementState) =>
        set((state) => ({ player: { ...state.player, movementState } })),
}));
