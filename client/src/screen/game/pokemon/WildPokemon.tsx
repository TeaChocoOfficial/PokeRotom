// -Path: "PokeRotom/client/src/screen/game/pokemon/WildPokemon.tsx"
import BoardText from '../entity/BoardText';

interface WildPokemonProps {
    name: string;
    pokemonId: number;
    position: [number, number, number];
}

export default function WildPokemon({ name, position }: WildPokemonProps) {
    return (
        <group position={position}>
            <BoardText position={[0, 1.8, 0]} text={name} />
        </group>
    );
}
