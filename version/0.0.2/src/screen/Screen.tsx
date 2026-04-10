// -Path: "PokeRotom/client/src/screen/Screen.tsx"
'use client';
import GameHUD from './hud/GameHUD';
import GameScene from './game/GameScene';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import FPSCounter from './components/FPSCounter';
import { useThemeStore } from '$/stores/themeStore';
import { useSocketStore } from '$/stores/socketStore';
import LoadingScreen from './components/LoadingScreen';

export default function Screen() {
    const theme = useThemeStore((state) => state.theme);
    const connect = useSocketStore((state) => state.connect);

    useEffect(() => {
        const html = document.documentElement;
        if (theme === 'dark') html.classList.add('dark');
        else html.classList.remove('dark');
    }, [theme]);

    useEffect(() => {
        connect();
    }, [connect]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            <Suspense fallback={<LoadingScreen />}>
                <Canvas
                    shadows
                    camera={{ position: [0, 10, 20], fov: 60 }}
                    style={{
                        background: theme === 'dark' ? '#0a0a1a' : '#87ceeb',
                    }}
                    gl={{
                        antialias: true,
                        powerPreference: 'high-performance',
                    }}
                >
                    <GameScene />
                </Canvas>
            </Suspense>
            <FPSCounter />
            <GameHUD />
        </div>
    );
}
