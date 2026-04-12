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

export default function Screen() {
    const { debug } = useControls('game', {
        debug: false,
    });

    return (
        <div className="relative w-dvw h-dvh overflow-hidden">
            <KeyBoardProvider>
                <Suspense fallback={<LoadingScreen />}>
                    <Canvas
                        shadows
                        camera={{ position: [10, 10, 20], fov: 60 }}
                        gl={{
                            antialias: true,
                            powerPreference: 'high-performance',
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
