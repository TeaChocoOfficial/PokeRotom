// -Path: "PokeRotom/client/src/screen/components/Joystick.tsx"
import { Vector2 } from 'three';
import { useThemeStore } from '$/stores/themeStore';
import { useState, useCallback, useEffect } from 'react';

const resetBasePos = (radius: number): Vector2 =>
    new Vector2(radius * 1.5, window.innerHeight - radius * 1.5);

export type JoystickDynamic =
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'left-top'
    | 'right-top'
    | 'left-bottom'
    | 'right-bottom';

export default function Joystick({
    radius = 64,
    setValue,
    dynamic,
}: {
    radius?: number;
    dynamic?: JoystickDynamic;
    setValue: (value: Vector2) => void;
}) {
    const { theme } = useThemeStore();
    const [active, setActive] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [basePos, setBasePos] = useState(resetBasePos(radius));

    useEffect(() => {
        setBasePos(resetBasePos(radius));
    }, []);

    const handleStart = useCallback(
        (clientX: number, clientY: number) => {
            if (!dynamic) {
                const deltaX = clientX - basePos.x;
                const deltaY = clientY - basePos.y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if (distance > radius * 2.5) return;

                const limitedDistance = Math.min(distance, radius);
                const angle = Math.atan2(deltaY, deltaX);
                const x = Math.cos(angle) * limitedDistance;
                const y = Math.sin(angle) * limitedDistance;

                setActive(true);
                setPos({ x, y });
                setValue(new Vector2(x / radius, y / radius));
            } else {
                switch (dynamic) {
                    case 'left':
                        if (clientX > window.innerWidth / 2) return;
                        break;
                    case 'right':
                        if (clientX < window.innerWidth / 2) return;
                        break;
                    case 'top':
                        if (clientY > window.innerHeight / 2) return;
                        break;
                    case 'bottom':
                        if (clientY < window.innerHeight / 2) return;
                        break;
                    case 'left-top':
                        if (
                            clientX > window.innerWidth / 2 ||
                            clientY > window.innerHeight / 2
                        )
                            return;
                        break;
                    case 'right-top':
                        if (
                            clientX < window.innerWidth / 2 ||
                            clientY > window.innerHeight / 2
                        )
                            return;
                        break;
                    case 'left-bottom':
                        if (
                            clientX > window.innerWidth / 2 ||
                            clientY < window.innerHeight / 2
                        )
                            return;
                        break;
                    case 'right-bottom':
                        if (
                            clientX < window.innerWidth / 2 ||
                            clientY < window.innerHeight / 2
                        )
                            return;
                        break;
                }
                setActive(true);
                setBasePos(new Vector2(clientX, clientY));
                setPos({ x: 0, y: 0 });
            }
        },
        [basePos, dynamic, radius, setValue],
    );

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
            setValue(new Vector2(x / radius, y / radius));
        },
        [active, basePos, setValue],
    );

    const handleEnd = useCallback(() => {
        setActive(false);
        setPos({ x: 0, y: 0 });
        setValue(new Vector2(0, 0));
        setBasePos(resetBasePos(radius));
    }, [setValue]);

    return (
        <div
            className="fixed inset-0 pointer-events-auto select-none"
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
