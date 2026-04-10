// -Path: "PokeRotom/client/src/screen/game/GameScene.tsx"
'use client';
import Objects from './Objects';
import { useControls } from 'leva';
import Lighting from './world/Lighting';
import WildPokemon from './pokemon/WildPokemon';
import { OrbitControls } from '@react-three/drei';
import { useSocketStore } from '$/stores/socketStore';

export default function GameScene() {
    const { wildPokemon } = useSocketStore();
    const { seed, debug } = useControls('world', {
        seed: '1234',
        debug: false,
    });

    return (
        <>
            <OrbitControls enabled={debug} />
            <Lighting />

            {/* Physics World — ใช้ Suspense ครอบเพื่อให้ Rapier WASM โหลดเสร็จก่อน */}
            <Objects seed={seed} debug={debug} />

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
