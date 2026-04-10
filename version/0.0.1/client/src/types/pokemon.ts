//-Path: "PokeRotom/client/src/types/pokemon.ts"
import PkmStat from '../hooks/pokemonStat';
import PokeApi from './pokeApi';
import { Url } from './types';

export interface PokemonDB {
    _id: string;
    pkmId: number;
    name: string;
    nickname: string;
    img: string;
    isInParty: boolean;
    lv: number;
    exp: number;
    index: number;
    ivs: PkmStat.STATS_TYPE;
    createdAt: string;
    updatedAt: string;
}

export interface Ability {
    id: number;
    name: string;
    desc: string;
}

export interface Move {
    id: number;
    name: string;
    pp: number;
    type: string;
    power: number;
    accuracy: number;
    desc: string;
}

export interface Nature {
    id: number;
    name: string;
    in_stat_id: number;
    de_stat_id: number;
    like_flavor_id: number;
    hate_flavor_id: number;
}

export interface TypeElement {
    id: number;
    name: string;
}

export interface Pokemon {
    id: number;
    name: string;
    img: Url;
}

export interface PokemonAbilityDetail {
    name: string;
    desc: string;
    isHidden: boolean;
}

export interface PokemonMoveDetail {
    level: number;
    method: string;
    move: {
        id: number;
        name: string;
        power: number;
        accuracy: number;
        pp: number;
        type: string;
        damageClass: string;
    };
}

export interface EvolutionEntry {
    id: number;
    name: string;
    img: string;
    evolvesFromId: number | null;
    trigger: string;
    minLevel: number | null;
    item: string | null;
}

export interface SpeciesName {
    language: string;
    name: string;
}

export interface PokemonDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    img: Url;
    sprites: PokeApi.PokemonSprite;
    types: string[];
    stats: PkmStat.STATS_TYPE;
    abilities: PokemonAbilityDetail[];
    species: string;
    generationId: number;
    speciesNames: SpeciesName[];
    weaknesses: string[];
    moves: PokemonMoveDetail[];
    evolutionChain: EvolutionEntry[];
}
