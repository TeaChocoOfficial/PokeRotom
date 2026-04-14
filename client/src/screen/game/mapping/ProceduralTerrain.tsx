// -Path: "PokeRotom/client/src/screen/game/mapping/ProceduralTerrain.tsx"
import Trees from '../world/tree/Trees';
import Water from '../world/water/Water';
import Terrain from '../world/terrain/Terrain';

export default function ProceduralTerrain({ seed }: { seed: string }) {
    return (
        <>
            <Water />
            <Trees seed={seed} />
            <Terrain seed={seed} />
        </>
    );
}
