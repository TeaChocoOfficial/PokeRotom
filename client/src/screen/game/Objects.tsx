// -Path: "PokeRotom/client/src/screen/game/Objects.tsx"
import { Suspense } from 'react';
import Player from './player/Player';
import Trees from './world/tree/Trees';
import Water from './world/water/Water';
import Terrain from './world/terrain/Terrain';
import { Physics } from '@react-three/rapier';
import OtherPlayer from './player/OtherPlayer';
import WildPokemon from './pokemon/WildPokemon';
import PhysicsLoader from './world/PhysicsLoader';
import { useSocketStore } from '$/stores/socketStore';

export default function Objects({
    seed,
    debug,
}: {
    seed: string;
    debug?: boolean;
}) {
    const { remotePlayers, wildPokemon } = useSocketStore();

    return (
        <Suspense fallback={<PhysicsLoader />}>
            <Physics gravity={[0, -50, 0]} debug={debug}>
                <Water seed={seed} />
                <Trees seed={seed} />
                <Terrain seed={seed} />
                <Player seed={seed} debug={debug} />
                {/* Remote Players (From Server) */}
                {Array.from(remotePlayers.entries()).map(([id, player]) => (
                    <OtherPlayer key={id} player={player} />
                ))}
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
            </Physics>
        </Suspense>
    );
}
