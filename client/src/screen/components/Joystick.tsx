// -Path: "PokeRotom/client/src/screen/components/Joystick.tsx"
import { useGameStore } from '$/stores/gameStore';
import { useThemeStore } from '$/stores/themeStore';
import { useState, useCallback, useEffect } from 'react';

export default function Joystick() {
    const radius = 64;
    const { theme } = useThemeStore();
    const { setJoystick } = useGameStore();
    const [active, setActive] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [basePos, setBasePos] = useState({ x: 120, y: 600 });

    useEffect(() => {
        setBasePos({ x: 120, y: window.innerHeight - 120 });
    }, []);

    const handleStart = useCallback((clientX: number, clientY: number) => {
        if (clientX > window.innerWidth / 2) return;
        setActive(true);
        setBasePos({ x: clientX, y: clientY });
        setPos({ x: 0, y: 0 });
    }, []);

    const handleMove = useCallback(
        (clientX: number, clientY: number) => {
            if (!active) return;
            const deltaX = clientX - basePos.x;
            const deltaY = clientY - basePos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const limitedDistance = Math.min(distance, radius);
            const angle = Math.atan2(deltaY, deltaX);
            const x = Math.cos(angle) * limitedDistance;
            const y = Math.sin(angle) * limitedDistance;
            setPos({ x, y });
            setJoystick({ x: x / radius, y: y / radius });
        },
        [active, basePos, setJoystick],
    );

    const handleEnd = useCallback(() => {
        setActive(false);
        setPos({ x: 0, y: 0 });
        setJoystick({ x: 0, y: 0 });
        setBasePos({ x: 120, y: window.innerHeight - 120 });
    }, [setJoystick]);

    return (
        <div
            className="fixed inset-0 z-50 pointer-events-auto select-none"
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => active && handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onTouchStart={(e) =>
                handleStart(e.touches[0].clientX, e.touches[0].clientY)
            }
            onTouchMove={(e) =>
                handleMove(e.touches[0].clientX, e.touches[0].clientY)
            }
            onTouchEnd={handleEnd}
        >
            <div
                className="absolute pointer-events-none transition-[opacity,left,top] duration-0"
                style={{
                    left: `${basePos.x}px`,
                    top: `${basePos.y}px`,
                    opacity: active ? 1 : 0.4,
                }}
            >
                <div
                    className="absolute translate-x-[-50%] translate-y-[-50%] rounded-full"
                    style={{
                        width: `${radius * 2.2}px`,
                        height: `${radius * 2.2}px`,
                        background:
                            theme === 'dark'
                                ? 'rgba(0, 0, 0, 0.05)'
                                : 'rgba(255, 255, 255, 0.05)',
                        border:
                            theme === 'dark'
                                ? '2px solid rgba(0, 0, 0, 0.2)'
                                : '2px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(4px)',
                    }}
                />
                <div
                    className="absolute translate-x-[-50%] translate-y-[-50%] rounded-full transition-shadow duration-0"
                    style={{
                        width: `${radius * 1.0}px`,
                        height: `${radius * 1.0}px`,
                        background: theme === 'dark' ? '#000000' : '#ffffff',
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        boxShadow:
                            theme === 'dark'
                                ? active
                                    ? '0 0 25px rgba(0, 0, 0, 0.8)'
                                    : '0 0 10px rgba(0, 0, 0, 0.3)'
                                : active
                                  ? '0 0 25px rgba(255, 255, 255, 0.8)'
                                  : '0 0 10px rgba(255, 255, 255, 0.3)',
                    }}
                />
            </div>
        </div>
    );
}
