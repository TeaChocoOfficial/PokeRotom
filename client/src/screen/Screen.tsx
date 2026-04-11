// -Path: "PokeRotom/client/src/screen/Screen.tsx"
import { Suspense } from 'react';
import GameHUD from './hud/GameHUD';
import GameScene from './game/GameScene';
import { Canvas } from '@react-three/fiber';
import FPSCounter from './components/FPSCounter';
import LoadingScreen from './components/LoadingScreen';
import { KeyBoardProvider } from './controller/Keyboard';

export default function Screen() {
    return (
        <div className="relative w-dvw h-dvh overflow-hidden">
            <Suspense fallback={<LoadingScreen />}>
                <KeyBoardProvider>
                    <Canvas
                        shadows
                        camera={{ position: [10, 10, 20], fov: 60 }}
                        gl={{
                            antialias: true,
                            powerPreference: 'high-performance',
                        }}
                    >
                        <GameScene />
                    </Canvas>
                </KeyBoardProvider>
                <FPSCounter />
                <GameHUD />
            </Suspense>
        </div>
    );
}
