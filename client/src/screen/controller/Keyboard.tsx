//-Path: "PokeRotom/client/src/screen/controller/Keyboard.tsx"
import {
    KeyboardControls,
    type KeyboardControlsEntry,
} from '@react-three/drei';
import { useMemo } from 'react';

export enum Controls {
    left = 'left',
    right = 'right',
    forward = 'forward',
    backward = 'backward',
    shift = 'shift',
    jump = 'jump',
}

export function KeyBoardProvider({ children }: { children: React.ReactNode }) {
    const map = useMemo<KeyboardControlsEntry<Controls>[]>(
        () => [
            { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
            { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
            { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
            { name: Controls.backward, keys: ['ArrowDown', 'KeyS'] },
            { name: Controls.shift, keys: ['ShiftLeft', 'ShiftRight'] },
            { name: Controls.jump, keys: ['Space'] },
        ],
        [],
    );

    return <KeyboardControls map={map}>{children}</KeyboardControls>;
}
