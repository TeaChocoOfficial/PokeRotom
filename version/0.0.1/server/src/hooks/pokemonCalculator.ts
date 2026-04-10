//-Path: "PokeRotom/client/src/hooks/pokemonStatCalculator.ts"
namespace PkmCalc {
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
        statKey: STATS_KEYS,
    ) => {
        if (statKey === STATS_KEYS.HP)
            return (
                Math.floor(
                    ((2 * base + iv + Math.floor(ev / 4)) * level) / 100,
                ) +
                level +
                10
            );
        const statValue =
            Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) +
            5;
        const natureModifier = NATURE_MODIFIERS[nature];
        return Math.floor(statValue * (natureModifier[statKey] || 1));
    };
    export const calculateAllStats = (
        pokemon: POKEMON_TYPE,
        level: number,
        nature: NATURE_MODIFIERS_KEYS,
        ivs: STATS_TYPE,
        evs: STATS_TYPE,
    ) => ({
        hp: calculateStat(
            pokemon.baseStats.hp || 0,
            ivs.hp || 0,
            evs.hp || 0,
            level,
            nature,
            STATS_KEYS.HP,
        ),
        attack: calculateStat(
            pokemon.baseStats.attack || 0,
            ivs.attack || 0,
            evs.attack || 0,
            level,
            nature,
            STATS_KEYS.ATTACK,
        ),
        defense: calculateStat(
            pokemon.baseStats.defense || 0,
            ivs.defense || 0,
            evs.defense || 0,
            level,
            nature,
            STATS_KEYS.DEFENSE,
        ),
        spAttack: calculateStat(
            pokemon.baseStats.spAttack || 0,
            ivs.spAttack || 0,
            evs.spAttack || 0,
            level,
            nature,
            STATS_KEYS.SP_ATTACK,
        ),
        spDefense: calculateStat(
            pokemon.baseStats.spDefense || 0,
            ivs.spDefense || 0,
            evs.spDefense || 0,
            level,
            nature,
            STATS_KEYS.SP_DEFENSE,
        ),
        speed: calculateStat(
            pokemon.baseStats.speed || 0,
            ivs.speed || 0,
            evs.speed || 0,
            level,
            nature,
            STATS_KEYS.SPEED,
        ),
    });
}

export default PkmCalc;
