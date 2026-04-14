// -Path: "PokeRotom/client/src/screen/game/Objects.tsx"
import { Suspense } from 'react';
import Maps from './mapping/Maps';
import Player from './player/Player';
import { Physics } from '@react-three/rapier';
import OtherPlayer from './player/OtherPlayer';
import WildPokemon from './pokemon/WildPokemon';
import PhysicsLoader from './world/PhysicsLoader';
import { useSocketStore } from '$/stores/socketStore';

export default function Objects({ debug }: { debug?: boolean }) {
    const { remotePlayers, wildPokemon } = useSocketStore();

    return (
        <Suspense fallback={<PhysicsLoader />}>
            <Physics gravity={[0, -50, 0]} debug={debug}>
                <Maps />
                <Player debug={debug} />
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
