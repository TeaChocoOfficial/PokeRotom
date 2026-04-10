// -Path: "PokeRotom/client/src/screen/components/FPSCounter.tsx"
'use client';
import { useEffect } from 'react';
import { useGameStore } from '$/stores/gameStore';

export default function FPSCounter() {
    const setFps = useGameStore((state) => state.setFps);

    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();

        const loop = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                setFps(frameCount);
                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(loop);
        };

        const animationId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationId);
    }, [setFps]);

    return null;
}
