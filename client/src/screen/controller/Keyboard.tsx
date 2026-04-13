//-Path: "PokeRotom/client/src/screen/controller/Keyboard.tsx"
import {
    KeyboardControls,
    type KeyboardControlsEntry,
} from '@react-three/drei';
import { useMemo, useEffect } from 'react';

export enum Controls {
    left = 'left',
    lock = 'lock',
    right = 'right',
    shift = 'shift',
    jump = 'jump',
    down = 'down',
    forward = 'forward',
    backward = 'backward',
}

export function KeyBoardProvider({ children }: { children: React.ReactNode }) {
    /** @description ปิด Browser Shortcuts ที่มารบกวนการเล่น (เช่น Ctrl+W) */
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // ปิด Ctrl+W, Ctrl+S, Ctrl+F ฯลฯ
            if (
                event.ctrlKey &&
                (event.key === 'w' || event.key === 's' || event.key === 'f')
            )
                event.preventDefault();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const map = useMemo<KeyboardControlsEntry<Controls>[]>(
        () => [
            { name: Controls.lock, keys: ['F1'] },
            { name: Controls.jump, keys: ['Space'] },
            { name: Controls.down, keys: ['ControlLeft'] },
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
