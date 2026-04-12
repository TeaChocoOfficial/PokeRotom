// -Path: "PokeRotom/client/src/stores/gameStore.ts"
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
    chunk: THREE.Vector3;
    player: PlayerState;
    isChatOpen: boolean;
    isMenuOpen: boolean;
    isChatFocused: boolean;
    isSettingsOpen: boolean;
    isMobileRunning: boolean;
    isMobileJumping: boolean;
    joystick: { x: number; y: number };
    toggleChatOpen: () => void;
    toggleSettingsOpen: () => void;
    setFps: (fps: number) => void;
    setTime: (time: number) => void;
    addTime: (time: number) => void;
    setChatOpen: (open: boolean) => void;
    setMenuOpen: (open: boolean) => void;
    setSettingsOpen: (open: boolean) => void;
    setMobileRunning: (running: boolean) => void;
    setMobileJumping: (jumping: boolean) => void;
    setChatFocused: (focused: boolean) => void;
    setPlayerChunk: (chunk: THREE.Vector3) => void;
    setMovementState: (state: MovementState) => void;
    setPlayerRotation: (rotation: THREE.Euler) => void;
    setPlayerPosition: (position: THREE.Vector3) => void;
    setPlayerVelocity: (velocity: THREE.Vector3) => void;
    setJoystick: (joystick: { x: number; y: number }) => void;
}

export const useGameStore = create<GameState>()((set) => ({
    fps: 0,
    time: 0,
    chunk: new THREE.Vector3(0, 0, 0),
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
    isMobileRunning: false,
    isMobileJumping: false,
    joystick: { x: 0, y: 0 },
    toggleChatOpen: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
    toggleSettingsOpen: () =>
        set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
    setFps: (fps) => set({ fps }),
    setTime: (time) => set({ time }),
    addTime: (time) => set((state) => ({ time: state.time + time })),
    setChatOpen: (isChatOpen) => set({ isChatOpen }),
    setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
    setChatFocused: (isChatFocused) => set({ isChatFocused }),
    setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
    setMobileRunning: (isMobileRunning) => set({ isMobileRunning }),
    setMobileJumping: (isMobileJumping) => set({ isMobileJumping }),
    setJoystick: (joystick) => set({ joystick }),
    setPlayerChunk: (chunk) =>
        set((state) => {
            const prevChunk = state.chunk;
            if (chunk.x !== prevChunk.x || chunk.z !== prevChunk.z)
                return { chunk };
            return state;
        }),
    setPlayerPosition: (position) =>
        set((state) => ({ player: { ...state.player, position } })),
    setPlayerRotation: (rotation) =>
        set((state) => ({ player: { ...state.player, rotation } })),
    setPlayerVelocity: (velocity) =>
        set((state) => ({ player: { ...state.player, velocity } })),
    setMovementState: (movementState) =>
        set((state) => ({ player: { ...state.player, movementState } })),
}));
