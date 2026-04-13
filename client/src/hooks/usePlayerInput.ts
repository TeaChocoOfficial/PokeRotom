// -Path: "PokeRotom/client/src/hooks/usePlayerInput.ts"
import { useMemo, useEffect } from 'react';
import { useGameStore } from '$/stores/gameStore';
import { Controls } from '$/screen/controller/Keyboard';
import { useKeyboardControls } from '@react-three/drei';

/** @description Hook จัดการ Input ของผู้เล่น โดยใช้ KeyboardControls จาก drei */
export function usePlayerInput() {
    const [, get] = useKeyboardControls<Controls>();
    const { isChatFocused, joystick, isMobileRunning, isMobileJumping } =
        useGameStore();

    /** @description สร้าง Proxy เพื่อรักษาโครงสร้าง keysRef.current เดิม */
    const keys = useMemo(
        () => ({
            get current() {
                if (isChatFocused)
                    return {
                        jump: false,
                        left: false,
                        right: false,
                        shift: false,
                        forward: false,
                        backward: false,
                    };

                const keyboard = get();
                return {
                    jump: keyboard.jump || isMobileJumping,
                    down: keyboard.down,
                    shift: keyboard.shift || isMobileRunning,
                    left: keyboard.left || joystick.x < -0.1,
                    right: keyboard.right || joystick.x > 0.1,
                    forward: keyboard.forward || joystick.y < -0.1,
                    backward: keyboard.backward || joystick.y > 0.1,
                };
            },
        }),
        [get, isChatFocused, joystick, isMobileRunning, isMobileJumping],
    );

    useEffect(() => {
        const handleContextMenu = (event: MouseEvent) => event.preventDefault();
        window.addEventListener('contextmenu', handleContextMenu);
        return () =>
            window.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    return keys;
}
