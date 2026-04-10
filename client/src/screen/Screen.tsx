// -Path: "PokeRotom/client/src/screen/Screen.tsx"
'use client';
import { Suspense } from 'react';
import GameHUD from './hud/GameHUD';
import GameScene from './game/GameScene';
import { Canvas } from '@react-three/fiber';
import FPSCounter from './components/FPSCounter';
import LoadingScreen from './components/LoadingScreen';

export default function Screen() {
    return (
        <div className="relative w-full h-full overflow-hidden">
            <Suspense fallback={<LoadingScreen />}>
                <Canvas
                    shadows
                    camera={{ position: [0, 10, 20], fov: 60 }}
                    gl={{
                        antialias: true,
                        powerPreference: 'high-performance',
                    }}
                >
                    <GameScene />
                </Canvas>
                <FPSCounter />
                <GameHUD />
            </Suspense>
        </div>
    );
}
