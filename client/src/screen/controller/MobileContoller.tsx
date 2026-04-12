// -Path: "PokeRotom/client/src/screen/controller/MobileContoller.tsx"
import Joystick from '../components/Joystick';
import ActionButton from '../components/ActionButton';
import { useIsMobile } from '$/hooks/useIsMobile';
import { useGameStore } from '$/stores/gameStore';

export default function MobileContoller() {
    const isMobile = useIsMobile();
    if (!isMobile) return <></>;

    const {
        setJoystick,
        isMobileRunning,
        setMobileRunning,
        isMobileJumping,
        setMobileJumping,
    } = useGameStore();

    return (
        <>
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
