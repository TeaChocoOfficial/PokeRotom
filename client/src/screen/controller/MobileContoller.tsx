// -Path: "PokeRotom/client/src/screen/controller/MobileContoller.tsx"
import { useRef, useCallback } from 'react';
import Joystick from '../../components/controller/Joystick';
import { useIsMobile } from '$/hooks/useIsMobile';
import { useGameStore } from '$/stores/gameStore';
import { useCameraStore } from '$/stores/cameraStore';
import ActionButton from '../../components/controller/ActionButton';

export default function MobileContoller() {
    const isMobile = useIsMobile();
    const lastTouchX = useRef<number | null>(null);
    const lastTouchY = useRef<number | null>(null);
    const lastPinchDist = useRef<number | null>(null);
    const { setZoom, addRotation } = useCameraStore();

    const {
        setJoystick,
        isMobileRunning,
        setMobileRunning,
        isMobileJumping,
        setMobileJumping,
    } = useGameStore();

    const onTouchMove = useCallback(
        (event: React.TouchEvent) => {
            if (event.touches.length === 2) {
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                const dist = Math.hypot(
                    touch1.clientX - touch2.clientX,
                    touch1.clientY - touch2.clientY,
                );

                if (lastPinchDist.current !== null) {
                    const delta = lastPinchDist.current - dist;
                    setZoom(delta * 20);
                }
                lastPinchDist.current = dist;
                return;
            }

            const touch = event.touches[0];
            if (lastTouchX.current !== null && lastTouchY.current !== null) {
                const deltaX = touch.clientX - lastTouchX.current;
                const deltaY = touch.clientY - lastTouchY.current;
                addRotation(-deltaX * 0.005, -deltaY * 0.005);
            }
            lastTouchX.current = touch.clientX;
            lastTouchY.current = touch.clientY;
        },
        [addRotation, setZoom],
    );

    const onTouchEnd = useCallback(() => {
        lastTouchX.current = null;
        lastTouchY.current = null;
        lastPinchDist.current = null;
    }, []);

    if (!isMobile) return <></>;
    return (
        <>
            {/* Rotation Area (Right Side) */}
            <div
                onTouchEnd={onTouchEnd}
                onTouchMove={onTouchMove}
                className="absolute inset-y-0 right-0 w-1/2 bg-red"
            />

            {/* Bottom-left: Joystick */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-6 items-start">
                <Joystick dynamic="left" setValue={setJoystick} />
            </div>

            {/* Bottom-right: Action Buttons */}
            <div className="absolute bottom-12 right-8 flex gap-4 items-center z-10">
                <ActionButton
                    icon="🏃"
                    active={isMobileRunning}
                    onPointerDown={() => setMobileRunning(true)}
                    onPointerUp={() => setMobileRunning(false)}
                />
                <ActionButton
                    icon="⬆️"
                    active={isMobileJumping}
                    onPointerDown={() => setMobileJumping(true)}
                    onPointerUp={() => setMobileJumping(false)}
                />
            </div>
        </>
    );
}
