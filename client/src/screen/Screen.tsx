// -Path: "PokeRotom/client/src/screen/Screen.tsx"
import { Suspense } from 'react';
import { useControls } from 'leva';
import GameHUD from './hud/GameHUD';
import GameScene from './game/GameScene';
import { Canvas } from '@react-three/fiber';
import FPSCounter from './components/FPSCounter';
import LoadingScreen from './components/LoadingScreen';
import { KeyBoardProvider } from './controller/Keyboard';
import MobileContoller from './controller/MobileContoller';
import { useSettingStore } from '$/stores/settingStore';

export default function Screen() {
    const { debug } = useControls('game', {
        debug: false,
    });
    const { powerPreference } = useSettingStore();

    return (
        <div className="relative w-dvw h-dvh overflow-hidden">
            <KeyBoardProvider>
                <Suspense fallback={<LoadingScreen />}>
                    <Canvas
                        shadows
                        camera={{ position: [10, 10, 20], fov: 60 }}
                        gl={{
                            depth: false,
                            stencil: false,
                            antialias: false,
                            powerPreference,
                        }}
                    >
                        <GameScene debug={debug} />
                    </Canvas>
                </Suspense>
                {!debug && <MobileContoller />}
                <FPSCounter />
                <GameHUD />
            </KeyBoardProvider>
        </div>
    );
}
