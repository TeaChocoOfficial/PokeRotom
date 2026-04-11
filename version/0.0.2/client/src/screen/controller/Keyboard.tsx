//-Path: "PokeRotom/client/src/screen/controller/Keyboard.tsx"
'use client';
import { useMemo } from 'react';
import { KeyboardControls, KeyboardControlsEntry } from '@react-three/drei';

export enum Controls {
    left = 'left',
    right = 'right',
    forward = 'forward',
    backward = 'backward',
    shift = 'shift',
}

export function KeyBoardProvider({ children }: { children: React.ReactNode }) {
    const map = useMemo<KeyboardControlsEntry<Controls>[]>(
        () => [
            { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
            { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
            { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
            { name: Controls.backward, keys: ['ArrowDown', 'KeyS'] },
            { name: Controls.shift, keys: ['ShiftLeft', 'ShiftRight'] },
        ],
        [],
    );

    return <KeyboardControls map={map}>{children}</KeyboardControls>;
}
