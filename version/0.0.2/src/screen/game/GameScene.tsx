// -Path: "PokeRotom/client/src/screen/game/GameScene.tsx"
'use client';
import Trees from './world/Trees';
import Water from './world/Water';
import Player from './player/Player';
import Terrain from './world/Terrain';
import { Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import OtherPlayer from './player/OtherPlayer';
import WildPokemon from './pokemon/WildPokemon';
import { useThemeStore } from '$/stores/themeStore';
import { useSocketStore } from '$/stores/socketStore';

export default function GameScene() {
    const { theme } = useThemeStore();
    const wildPokemon = useSocketStore((state) => state.wildPokemon);
    const remotePlayers = useSocketStore((state) => state.remotePlayers);

    const isDark = theme === 'dark';
    const fogColor = isDark ? '#0a0a1a' : '#87ceeb';
    const ambientIntensity = isDark ? 0.15 : 0.4;
    const directionalIntensity = isDark ? 0.3 : 1.2;
    const sunPosition: [number, number, number] = isDark
        ? [0, -1, 0]
        : [100, 80, 50];

    return (
        <>
            {/* Sky & Atmosphere */}
            <fog attach="fog" args={[fogColor, 50, 200]} />
            <Sky
                distance={450000}
                sunPosition={sunPosition}
                inclination={isDark ? 0 : 0.5}
                azimuth={0.25}
                rayleigh={isDark ? 0.1 : 2}
                turbidity={isDark ? 0.5 : 8}
            />

            {/* Lighting */}
            <ambientLight intensity={ambientIntensity} />
            <directionalLight
                castShadow
                intensity={directionalIntensity}
                position={[50, 50, 25]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={150}
                shadow-camera-left={-60}
                shadow-camera-right={60}
                shadow-camera-top={60}
                shadow-camera-bottom={-60}
            />
            {isDark && (
                <hemisphereLight
                    color="#334466"
                    groundColor="#111122"
                    intensity={0.3}
                />
            )}

            {/* Physics World — Terrain ต้องอยู่ใน Physics เพราะมี RigidBody */}
            <Physics gravity={[0, -20, 0]}>
                <Terrain />
                <Player />
            </Physics>

            {/* Decorations (ไม่ต้องมี physics) */}
            <Trees />
            <Water />

            {/* Wild Pokemon (From Server) */}
            {wildPokemon && (
                <WildPokemon
                    name={wildPokemon.name}
                    position={[
                        wildPokemon.position.x,
                        wildPokemon.position.y,
                        wildPokemon.position.z,
                    ]}
                    pokemonId={wildPokemon.id}
                />
            )}

            {/* Remote Players (From Server) */}
            {Array.from(remotePlayers.entries()).map(([id, player]) => (
                <OtherPlayer key={id} player={player} />
            ))}
        </>
    );
}
