// -Path: "PokeRotom/client/src/types/pokeApi.ts"

export interface PokemonSprite {
    sprites: string | object;
}

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    pokemon_v2_pokemonsprites: PokemonSprite[];
    pokemon_v2_pokemontypes?: any[];
    pokemon_v2_pokemonstats?: any[];
    pokemon_v2_pokemonspecy?: any;
}

export interface PokemonListData {
    pokemon_v2_pokemon: Pokemon[];
}

export interface PokemonDetailData {
    pokemon_v2_pokemon_by_pk: Pokemon;
}
