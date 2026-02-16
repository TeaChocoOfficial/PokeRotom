// -Path: "PokeRotom/server/src/hooks/pokemonStatCalculator.ts"
import * as PokemonStatCalculator from '@zahidmahmood/pokemon-stat-calculator';

namespace PkmStatCalc {
    export enum NATURE_MODIFIERS_KEYS {
        HARDY = 'hardy',
        LONELY = 'lonely',
        BRAVE = 'brave',
        ADAMANT = 'adamant',
        NAUGHTY = 'naughty',
        BOLD = 'bold',
        DOCILE = 'docile',
        RELAXED = 'relaxed',
        IMPETUOUS = 'impetuous',
        LAX = 'lax',
        TIMID = 'timid',
        HASTY = 'hasty',
        SERIOUS = 'serious',
        JOLLY = 'jolly',
        NAIVE = 'naive',
        MODEST = 'modest',
        MILD = 'mild',
        QUIET = 'quiet',
        BASHFUL = 'bashful',
        RASH = 'rash',
        CALM = 'calm',
        GENTLE = 'gentle',
        SISSY = 'sissy',
        CAREFUL = 'careful',
        QUIRKY = 'quirky',
    }
    export enum STATS_KEYS {
        HP = 'hp',
        ATTACK = 'attack',
        DEFENSE = 'defense',
        SP_ATTACK = 'spAttack',
        SP_DEFENSE = 'spDefense',
        SPEED = 'speed',
    }
    export type STATS_TYPE = {
        [key in STATS_KEYS]?: number;
    };
    export type POKEMON_TYPE = {
        baseStats: STATS_TYPE;
    };
    export type NATURE_MODIFIERS_TYPE = {
        [key in NATURE_MODIFIERS_KEYS]: STATS_TYPE;
    };
    export const NATURE_MODIFIERS: NATURE_MODIFIERS_TYPE = {
        hardy: { attack: 1, defense: 1, spAttack: 1, spDefense: 1, speed: 1 },
        lonely: {
            attack: 1.1,
            defense: 0.9,
            spAttack: 1,
            spDefense: 1,
            speed: 1,
        },
        brave: {
            attack: 1.1,
            defense: 1,
            spAttack: 1,
            spDefense: 1,
            speed: 0.9,
        },
        adamant: {
            attack: 1.1,
            defense: 1,
            spAttack: 0.9,
            spDefense: 1,
            speed: 1,
        },
        naughty: {
            attack: 1.1,
            defense: 1,
            spAttack: 1,
            spDefense: 0.9,
            speed: 1,
        },
        bold: {
            attack: 0.9,
            defense: 1.1,
            spAttack: 1,
            spDefense: 1,
            speed: 1,
        },
        docile: { attack: 1, defense: 1, spAttack: 1, spDefense: 1, speed: 1 },
        relaxed: {
            attack: 1,
            defense: 1.1,
            spAttack: 1,
            spDefense: 1,
            speed: 0.9,
        },
        impetuous: {
            attack: 1.1,
            defense: 1,
            spAttack: 1,
            spDefense: 0.9,
            speed: 1,
        },
        lax: {
            attack: 1,
            defense: 1.1,
            spAttack: 0.9,
            spDefense: 1,
            speed: 1,
        },
        timid: {
            attack: 0.9,
            defense: 1,
            spAttack: 1,
            spDefense: 1,
            speed: 1.1,
        },
        hasty: {
            attack: 1,
            defense: 0.9,
            spAttack: 1,
            spDefense: 1,
            speed: 1.1,
        },
        serious: { attack: 1, defense: 1, spAttack: 1, spDefense: 1, speed: 1 },
        jolly: {
            attack: 1,
            defense: 1,
            spAttack: 0.9,
            spDefense: 1,
            speed: 1.1,
        },
        naive: {
            attack: 1,
            defense: 1,
            spAttack: 1,
            spDefense: 0.9,
            speed: 1.1,
        },
        modest: {
            attack: 0.9,
            defense: 1,
            spAttack: 1.1,
            spDefense: 1,
            speed: 1,
        },
        mild: {
            attack: 1,
            defense: 0.9,
            spAttack: 1.1,
            spDefense: 1,
            speed: 1,
        },
        quiet: {
            attack: 1,
            defense: 1,
            spAttack: 1.1,
            spDefense: 1,
            speed: 0.9,
        },
        bashful: { attack: 1, defense: 1, spAttack: 1, spDefense: 1, speed: 1 },
        rash: {
            attack: 1,
            defense: 1,
            spAttack: 1.1,
            spDefense: 0.9,
            speed: 1,
        },
        calm: {
            attack: 0.9,
            defense: 1,
            spAttack: 1,
            spDefense: 1.1,
            speed: 1,
        },
        gentle: {
            attack: 1,
            defense: 0.9,
            spAttack: 1,
            spDefense: 1.1,
            speed: 1,
        },
        sissy: {
            attack: 1,
            defense: 1,
            spAttack: 1,
            spDefense: 1.1,
            speed: 0.9,
        },
        careful: {
            attack: 1,
            defense: 1,
            spAttack: 0.9,
            spDefense: 1.1,
            speed: 1,
        },
        quirky: { attack: 1, defense: 1, spAttack: 1, spDefense: 1, speed: 1 },
    };
    export const calculateStat = (
        base: number,
        iv: number,
        ev: number,
        level: number,
        nature: NATURE_MODIFIERS_KEYS,
        isHP?: boolean,
    ) => PokemonStatCalculator.calculateStat(base, iv, ev, level, nature, isHP);
    export const getStatName = (isHP?: boolean) =>
        PokemonStatCalculator.getStatName(isHP);
    export const calculateAllStats = (
        pokemon: POKEMON_TYPE,
        level: number,
        nature: NATURE_MODIFIERS_KEYS,
        ivs: number,
        evs: number,
    ) =>
        PokemonStatCalculator.calculateAllStats(
            pokemon,
            level,
            nature,
            ivs,
            evs,
        );
}

export default PkmStatCalc;
