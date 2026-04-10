// -Path: "PokeRotom/client/src/screen/game/GameScene.tsx"
'use client';
import Test from './Test';
import { Suspense } from 'react';
import Trees from './world/Trees';
import Player from './player/Player';
import Terrain from './world/Terrain';
import Lighting from './world/Lighting';
import { Physics } from '@react-three/rapier';
import OtherPlayer from './player/OtherPlayer';
import WildPokemon from './pokemon/WildPokemon';
import { OrbitControls } from '@react-three/drei';
import { useSocketStore } from '$/stores/socketStore';

export default function GameScene() {
    const { wildPokemon, remotePlayers } = useSocketStore();

    return (
        <>
            <OrbitControls />
            <Lighting />
            {/* <Test /> */}

            {/* Physics World — ใช้ Suspense ครอบเพื่อให้ Rapier WASM โหลดเสร็จก่อน */}
            <Suspense fallback={null}>
                <Physics gravity={[0, -20, 0]}>
                    <Terrain />
                    <Player />
                    {/* Remote Players (From Server) */}
                    {Array.from(remotePlayers.entries()).map(([id, player]) => (
                        <OtherPlayer key={id} player={player} />
                    ))}
                    <Trees />
                </Physics>
            </Suspense>

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
        </>
    );
}
