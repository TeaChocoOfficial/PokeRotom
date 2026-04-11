// -Path: "PokeRotom/client/src/hooks/usePlayerInput.ts"
'use client';
import { useMemo, useEffect } from 'react';
import { useGameStore } from '$/stores/gameStore';
import { Controls } from '$/screen/controller/Keyboard';
import { useKeyboardControls } from '@react-three/drei';

/** @description Hook จัดการ Input ของผู้เล่น โดยใช้ KeyboardControls จาก drei */
export function usePlayerInput() {
    const { isChatFocused } = useGameStore();
    const [, get] = useKeyboardControls<Controls>();

    /** @description สร้าง Proxy เพื่อรักษาโครงสร้าง keysRef.current เดิม */
    const keys = useMemo(() => ({
        get current() {
            if (isChatFocused) return {
                left: false,
                right: false,
                shift: false,
                forward: false,
                backward: false,
            };
            return get();
        }
    }), [get, isChatFocused]);

    useEffect(() => {
        const handleContextMenu = (event: MouseEvent) => event.preventDefault();
        window.addEventListener('contextmenu', handleContextMenu);
        return () => window.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    return keys;
}

