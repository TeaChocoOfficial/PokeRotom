// -Path: "PokeRotom/client/src/hooks/usePlayerInput.ts"
'use client';
import { useRef, useEffect } from 'react';
import { useGameStore } from '$/stores/gameStore';

export interface KeyState {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    shift: boolean;
}

/** @description Hook จัดการ Input ของผู้เล่น (Keyboard + Mouse) */
export function usePlayerInput() {
    const { isChatFocused } = useGameStore();
    const keysRef = useRef<KeyState>({
        forward: false,
        backward: false,
        shift: false,
        right: false,
        left: false,
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isChatFocused) return;
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    keysRef.current.forward = true;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    keysRef.current.backward = true;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    keysRef.current.left = true;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    keysRef.current.right = true;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    keysRef.current.shift = true;
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    keysRef.current.forward = false;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    keysRef.current.backward = false;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    keysRef.current.left = false;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    keysRef.current.right = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    keysRef.current.shift = false;
                    break;
            }
        };

        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [isChatFocused]);

    return keysRef;
}
