// -Path: "PokeRotom/client/src/types/pokeApi.ts"
import {
    Move as MoveType,
    Nature as NatureType,
    Ability as AbilityType,
    Pokemon as PokemonType,
    TypeElement as TypeElementType,
    PokemonDetail as PokemonDetailType,
} from './pokemon';
import { Url } from './types';
import { Item as ItemType } from './inventory';
import PkmStat from '../hooks/pokemonStat';

namespace PokeApi {
    export interface PokemonSprite {
        back_default: Url;
        back_female: Url;
        back_shiny: Url;
        back_shiny_female: Url;
        front_default: Url;
        front_female: Url;
        front_shiny: Url;
        front_shiny_female: Url;
        other: {
            dream_world: {
                front_default: Url;
                front_female: Url;
            };
            home: {
                front_default: Url;
                front_female: Url;
                front_shiny: Url;
                front_shiny_female: Url;
            };
            'official-artwork': {
                front_default: Url;
                front_female: Url;
            };
            showdown: {
                back_default: Url;
                back_female: Url;
                back_shiny: Url;
                back_shiny_female: Url;
                front_default: Url;
                front_female: Url;
                front_shiny: Url;
                front_shiny_female: Url;
            };
        };
    }

    export interface PokemonStat {
        pokemon_v2_stat: { name: PkmStat.STATS_KEYS };
        base_stat: number;
    }

    export interface PokemonAbility {
        is_hidden: boolean;
        pokemon_v2_ability: {
            name: string;
            pokemon_v2_abilityflavortexts: { flavor_text: string }[];
        };
    }

    export interface PokemonSpeciesName {
        name: string;
        pokemon_v2_language: { name: string };
    }

    export interface TypeEfficacy {
        damage_factor: number;
        pokemonV2TypeByTargetTypeId: { name: string };
    }

    export interface PokemonTypeDetail {
        pokemon_v2_type: {
            name: string;
            pokemon_v2_typeefficacies: TypeEfficacy[];
        };
    }

    export interface PokemonMoveEntry {
        level: number;
        pokemon_v2_move: {
            id: number;
            name: string;
            power: number;
            accuracy: number;
            pp: number;
            pokemon_v2_type: { name: string };
            pokemon_v2_movedamageclass: { name: string };
        };
        pokemon_v2_movelearnmethod: { name: string };
    }

    export interface EvolutionSpecies {
        id: number;
        name: string;
        order: number;
        evolves_from_species_id: number | null;
        pokemon_v2_pokemonevolutions: {
            min_level: number | null;
            pokemon_v2_evolutiontrigger: { name: string };
            pokemon_v2_item: { name: string } | null;
        }[];
        pokemon_v2_pokemons: {
            pokemon_v2_pokemonsprites: { sprites: PokemonSprite }[];
        }[];
    }

    export const toPokemon = (pokemon: Pokemon): PokemonType => {
        const sprites = pokemon.pokemon_v2_pokemonsprites[0]?.sprites;

        return {
            id: pokemon.id,
            name: pokemon.name,
            img: sprites.front_default,
        };
    };

    export const toPokemonDetail = (
        pokemon: PokemonDetail,
    ): PokemonDetailType => {
        const sprites = pokemon.pokemon_v2_pokemonsprites[0]?.sprites;
        const specy = pokemon.pokemon_v2_pokemonspecy;

        const weaknesses = new Set<string>();
        pokemon.pokemon_v2_pokemontypes?.forEach((typeEntry) => {
            typeEntry.pokemon_v2_type.pokemon_v2_typeefficacies?.forEach(
                (efficacy) => {
                    weaknesses.add(efficacy.pokemonV2TypeByTargetTypeId.name);
                },
            );
        });

        return {
            id: pokemon.id,
            name: pokemon.name,
            height: pokemon.height,
            weight: pokemon.weight,
            sprites,
            img: sprites.front_default,
            types: pokemon.pokemon_v2_pokemontypes?.map(
                (type) => type.pokemon_v2_type.name,
            ),
            stats: {
                hp: pokemon.pokemon_v2_pokemonstats[0].base_stat,
                atk: pokemon.pokemon_v2_pokemonstats[1].base_stat,
                def: pokemon.pokemon_v2_pokemonstats[2].base_stat,
                spAtk: pokemon.pokemon_v2_pokemonstats[3].base_stat,
                spDef: pokemon.pokemon_v2_pokemonstats[4].base_stat,
                spd: pokemon.pokemon_v2_pokemonstats[5].base_stat,
            },
            abilities: pokemon.pokemon_v2_pokemonabilities.map((ability) => ({
                name: ability.pokemon_v2_ability.name,
                desc:
                    ability.pokemon_v2_ability.pokemon_v2_abilityflavortexts[0]
                        ?.flavor_text ?? '',
                isHidden: ability.is_hidden,
            })),
            species:
                specy?.pokemon_v2_pokemonspeciesflavortexts?.[0]?.flavor_text ??
                '',
            generationId: specy?.generation_id ?? 0,
            speciesNames:
                specy?.pokemon_v2_pokemonspeciesnames?.map(
                    (entry: PokemonSpeciesName) => ({
                        language: entry.pokemon_v2_language.name,
                        name: entry.name,
                    }),
                ) ?? [],
            weaknesses: Array.from(weaknesses),
            moves:
                pokemon.pokemon_v2_pokemonmoves?.map(
                    (moveEntry: PokemonMoveEntry) => ({
                        level: moveEntry.level,
                        method: moveEntry.pokemon_v2_movelearnmethod.name,
                        move: {
                            id: moveEntry.pokemon_v2_move.id,
                            name: moveEntry.pokemon_v2_move.name,
                            power: moveEntry.pokemon_v2_move.power,
                            accuracy: moveEntry.pokemon_v2_move.accuracy,
                            pp: moveEntry.pokemon_v2_move.pp,
                            type: moveEntry.pokemon_v2_move.pokemon_v2_type
                                .name,
                            damageClass:
                                moveEntry.pokemon_v2_move
                                    .pokemon_v2_movedamageclass?.name ?? '',
                        },
                    }),
                ) ?? [],
            evolutionChain:
                specy?.pokemon_v2_evolutionchain?.pokemon_v2_pokemonspecies?.map(
                    (evo: EvolutionSpecies) => ({
                        id: evo.id,
                        name: evo.name,
                        evolvesFromId: evo.evolves_from_species_id,
                        img:
                            evo.pokemon_v2_pokemons?.[0]
                                ?.pokemon_v2_pokemonsprites?.[0]?.sprites
                                ?.other?.['official-artwork']?.front_default ??
                            evo.pokemon_v2_pokemons?.[0]
                                ?.pokemon_v2_pokemonsprites?.[0]?.sprites
                                ?.front_default ??
                            '',
                        trigger:
                            evo.pokemon_v2_pokemonevolutions?.[0]
                                ?.pokemon_v2_evolutiontrigger?.name ?? '',
                        minLevel:
                            evo.pokemon_v2_pokemonevolutions?.[0]?.min_level ??
                            null,
                        item:
                            evo.pokemon_v2_pokemonevolutions?.[0]
                                ?.pokemon_v2_item?.name ?? null,
                    }),
                ) ?? [],
        };
    };

    export interface Pokemon {
        id: number;
        name: string;
        height: number;
        weight: number;
        pokemon_v2_pokemonsprites: { sprites: PokemonSprite }[];
    }

    export interface PokemonListData {
        pokemon_v2_pokemon: Pokemon[];
    }
    export type PokemonDetail = Pokemon & {
        pokemon_v2_pokemonabilities: PokemonAbility[];
        pokemon_v2_pokemontypes: PokemonTypeDetail[];
        pokemon_v2_pokemonstats: PokemonStat[];
        pokemon_v2_pokemonmoves: PokemonMoveEntry[];
        pokemon_v2_pokemonspecy: {
            generation_id: number;
            name: string;
            pokemon_v2_pokemonspeciesnames: PokemonSpeciesName[];
            pokemon_v2_pokemonspeciesflavortexts: { flavor_text: string }[];
            pokemon_v2_evolutionchain: {
                pokemon_v2_pokemonspecies: EvolutionSpecies[];
            };
        };
    };

    export interface PokemonDetailData {
        pokemon_v2_pokemon_by_pk: PokemonDetail;
    }

    export const toItem = (item: Item): ItemType => {
        return {
            id: item.id,
            name: item.name,
            price: item.cost,
            category: item.pokemon_v2_itemcategory?.name,
            desc: item.pokemon_v2_itemflavortexts[0]?.flavor_text,
            img: item.pokemon_v2_itemsprites[0].sprites.default,
        };
    };

    export interface Item {
        id: number;
        name: string;
        cost: number;
        pokemon_v2_itemcategory?: { name: string };
        pokemon_v2_itemflavortexts: { flavor_text: string }[];
        pokemon_v2_itemsprites: {
            sprites: {
                default: string;
            };
        }[];
    }

    export interface ItemListData {
        pokemon_v2_item: Item[];
    }

    export interface ItemDetailData {
        pokemon_v2_item_by_pk: Item & {
            pokemon_v2_itemcategory: { name: string };
            pokemon_v2_itemeffecttexts: {
                short_effect: string;
                effect: string;
            }[];
        };
    }

    export const toMove = (move: Move): MoveType => {
        return {
            id: move.id,
            name: move.name,
            pp: move.pp,
            power: move.power,
            accuracy: move.accuracy,
            type: move.pokemon_v2_type.name,
            desc: move.pokemon_v2_moveflavortexts[0]?.flavor_text,
        };
    };

    export interface Move {
        id: number;
        name: string;
        pp: number;
        power: number;
        accuracy: number;
        pokemon_v2_type: { name: string };
        pokemon_v2_moveflavortexts: { flavor_text: string }[];
    }

    export interface MoveListData {
        pokemon_v2_move: Move[];
    }

    export interface MoveDetailData {
        pokemon_v2_move_by_pk: Move & {
            priority: number;
            pokemon_v2_movelearnmethods: {
                pokemon_v2_movelearnmethod: { name: string };
            }[];
            pokemon_v2_movedamageclass: { name: string };
        };
    }

    export const toAbility = (ability: Ability): AbilityType => {
        return {
            id: ability.id,
            name: ability.name,
            desc: ability.pokemon_v2_abilityflavortexts[0]?.flavor_text,
        };
    };

    export interface Ability {
        id: number;
        name: string;
        pokemon_v2_abilityflavortexts: { flavor_text: string }[];
    }

    export interface AbilityListData {
        pokemon_v2_ability: Ability[];
    }

    export interface AbilityDetailData {
        pokemon_v2_ability_by_pk: Ability & {
            pokemon_v2_abilityeffecttexts: {
                short_effect: string;
                effect: string;
            }[];
        };
    }

    export interface TypeElement {
        id: number;
        name: string;
    }

    export interface TypeListData {
        pokemon_v2_type: TypeElement[];
    }

    export const toTypeElement = (type: TypeElement): TypeElementType => {
        return {
            id: type.id,
            name: type.name,
        };
    };

    export interface Nature {
        id: number;
        name: string;
        likes_flavor_id: number;
        hates_flavor_id: number;
        increased_stat_id: number;
        decreased_stat_id: number;
    }

    export interface NatureListData {
        pokemon_v2_nature: Nature[];
    }

    export const toNature = (nature: Nature): NatureType => {
        return {
            id: nature.id,
            name: nature.name,
            in_stat_id: nature.increased_stat_id,
            de_stat_id: nature.decreased_stat_id,
            like_flavor_id: nature.likes_flavor_id,
            hate_flavor_id: nature.hates_flavor_id,
        };
    };
}
export default PokeApi;
