// -Path: "PokeRotom/client/src/screen/game/Objects.tsx"
'use client';
import { Suspense } from 'react';
import Player from './player/Player';
import Trees from './world/tree/Trees';
import Terrain from './world/terrain/Terrain';
import { Physics } from '@react-three/rapier';
import OtherPlayer from './player/OtherPlayer';
import PhysicsLoader from './world/PhysicsLoader';
import { useSocketStore } from '$/stores/socketStore';

export default function Objects({
    seed,
    debug,
}: {
    seed: string;
    debug: boolean;
}) {
    const { remotePlayers } = useSocketStore();

    return (
        <Suspense fallback={<PhysicsLoader />}>
            <Physics gravity={[0, -20, 0]} debug={debug}>
                <Trees seed={seed} />
                <Terrain seed={seed} />
                <Player debug={debug} />
                {/* Remote Players (From Server) */}
                {Array.from(remotePlayers.entries()).map(([id, player]) => (
                    <OtherPlayer key={id} player={player} />
                ))}
            </Physics>
        </Suspense>
    );
}
