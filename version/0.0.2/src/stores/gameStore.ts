// -Path: "PokeRotom/client/src/stores/gameStore.ts"
import { create } from 'zustand';
import * as THREE from 'three';

export type MovementState = 'idle' | 'walking' | 'running';

interface PlayerState {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    velocity: THREE.Vector3;
    movementState: MovementState;
}

interface GameState {
    player: PlayerState;
    isMenuOpen: boolean;
    isSettingsOpen: boolean;
    isChatOpen: boolean;
    isChatFocused: boolean;
    fps: number;
    setPlayerPosition: (position: THREE.Vector3) => void;
    setPlayerRotation: (rotation: THREE.Euler) => void;
    setPlayerVelocity: (velocity: THREE.Vector3) => void;
    setMovementState: (state: MovementState) => void;
    setMenuOpen: (open: boolean) => void;
    setSettingsOpen: (open: boolean) => void;
    setChatOpen: (open: boolean) => void;
    setChatFocused: (focused: boolean) => void;
    setFps: (fps: number) => void;
}

export const useGameStore = create<GameState>()((set) => ({
    player: {
        position: new THREE.Vector3(0, 2, 0),
        rotation: new THREE.Euler(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        movementState: 'idle',
    },
    fps: 0,
    isChatOpen: false,
    isMenuOpen: false,
    isChatFocused: false,
    isSettingsOpen: false,
    setPlayerPosition: (position) =>
        set((state) => ({ player: { ...state.player, position } })),
    setPlayerRotation: (rotation) =>
        set((state) => ({ player: { ...state.player, rotation } })),
    setPlayerVelocity: (velocity) =>
        set((state) => ({ player: { ...state.player, velocity } })),
    setMovementState: (movementState) =>
        set((state) => ({ player: { ...state.player, movementState } })),
    setFps: (fps) => set({ fps }),
    setChatOpen: (isChatOpen) => set({ isChatOpen }),
    setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
    setChatFocused: (isChatFocused) => set({ isChatFocused }),
    setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
}));
