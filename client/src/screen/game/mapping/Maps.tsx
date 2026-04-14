// -Path: "PokeRotom/client/src/screen/game/mapping/Map.tsx"
import FlatMap from './FlatMap';
import { useControls } from 'leva';
import ProceduralTerrain from './ProceduralTerrain';

export default function Maps() {
    const { seed, map } = useControls('world', {
        seed: 't1234',
        map: {
            value: 'procedural',
            options: ['procedural', 'flat'],
        },
    });

    return (
        <>
            {map === 'procedural' && <ProceduralTerrain seed={seed} />}
            {map === 'flat' && <FlatMap />}
        </>
    );
}
