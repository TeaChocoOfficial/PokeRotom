//-Path: "PokeRotom/client/src/hooks/pokemonStatCalculator.ts"
namespace PkmStat {
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
        ATTACK = 'atk',
        DEFENSE = 'def',
        SP_ATTACK = 'spAtk',
        SP_DEFENSE = 'spDef',
        SPEED = 'spd',
    }
    export enum STATS_NAMES {
        HP = 'HP',
        ATTACK = 'Attack',
        DEFENSE = 'Defense',
        SP_ATTACK = 'Sp. Attack',
        SP_DEFENSE = 'Sp. Defense',
        SPEED = 'Speed',
    }
    export const getStatNameByID = (
        id?: number | null,
    ): STATS_NAMES | undefined => {
        switch (id) {
            case 1:
                return STATS_NAMES.HP;
            case 2:
                return STATS_NAMES.ATTACK;
            case 3:
                return STATS_NAMES.DEFENSE;
            case 4:
                return STATS_NAMES.SP_ATTACK;
            case 5:
                return STATS_NAMES.SP_DEFENSE;
            case 6:
                return STATS_NAMES.SPEED;
            default:
                return undefined;
        }
    };
    export const STAT_DEFAULT: STATS_TYPE = {
        hp: 0,
        atk: 0,
        def: 0,
        spAtk: 0,
        spDef: 0,
        spd: 0,
    };
    export type STATS_TYPE = {
        [key in STATS_KEYS]: number;
    };
    export type BASE_STATS_TYPE = Omit<STATS_TYPE, STATS_KEYS.HP>;
    export type POKEMON_TYPE = {
        baseStats: STATS_TYPE;
    };
    export type NATURE_MODIFIERS_TYPE = {
        [key in NATURE_MODIFIERS_KEYS]: BASE_STATS_TYPE;
    };
    export const NATURE_MODIFIERS: NATURE_MODIFIERS_TYPE = {
        hardy: { atk: 1, def: 1, spAtk: 1, spDef: 1, spd: 1 },
        lonely: {
            atk: 1.1,
            def: 0.9,
            spAtk: 1,
            spDef: 1,
            spd: 1,
        },
        brave: {
            atk: 1.1,
            def: 1,
            spAtk: 1,
            spDef: 1,
            spd: 0.9,
        },
        adamant: {
            atk: 1.1,
            def: 1,
            spAtk: 0.9,
            spDef: 1,
            spd: 1,
        },
        naughty: {
            atk: 1.1,
            def: 1,
            spAtk: 1,
            spDef: 0.9,
            spd: 1,
        },
        bold: {
            atk: 0.9,
            def: 1.1,
            spAtk: 1,
            spDef: 1,
            spd: 1,
        },
        docile: { atk: 1, def: 1, spAtk: 1, spDef: 1, spd: 1 },
        relaxed: {
            atk: 1,
            def: 1.1,
            spAtk: 1,
            spDef: 1,
            spd: 0.9,
        },
        impetuous: {
            atk: 1.1,
            def: 1,
            spAtk: 1,
            spDef: 0.9,
            spd: 1,
        },
        lax: {
            atk: 1,
            def: 1.1,
            spAtk: 0.9,
            spDef: 1,
            spd: 1,
        },
        timid: {
            atk: 0.9,
            def: 1,
            spAtk: 1,
            spDef: 1,
            spd: 1.1,
        },
        hasty: {
            atk: 1,
            def: 0.9,
            spAtk: 1,
            spDef: 1,
            spd: 1.1,
        },
        serious: { atk: 1, def: 1, spAtk: 1, spDef: 1, spd: 1 },
        jolly: {
            atk: 1,
            def: 1,
            spAtk: 0.9,
            spDef: 1,
            spd: 1.1,
        },
        naive: {
            atk: 1,
            def: 1,
            spAtk: 1,
            spDef: 0.9,
            spd: 1.1,
        },
        modest: {
            atk: 0.9,
            def: 1,
            spAtk: 1.1,
            spDef: 1,
            spd: 1,
        },
        mild: {
            atk: 1,
            def: 0.9,
            spAtk: 1.1,
            spDef: 1,
            spd: 1,
        },
        quiet: {
            atk: 1,
            def: 1,
            spAtk: 1.1,
            spDef: 1,
            spd: 0.9,
        },
        bashful: { atk: 1, def: 1, spAtk: 1, spDef: 1, spd: 1 },
        rash: {
            atk: 1,
            def: 1,
            spAtk: 1.1,
            spDef: 0.9,
            spd: 1,
        },
        calm: {
            atk: 0.9,
            def: 1,
            spAtk: 1,
            spDef: 1.1,
            spd: 1,
        },
        gentle: {
            atk: 1,
            def: 0.9,
            spAtk: 1,
            spDef: 1.1,
            spd: 1,
        },
        sissy: {
            atk: 1,
            def: 1,
            spAtk: 1,
            spDef: 1.1,
            spd: 0.9,
        },
        careful: {
            atk: 1,
            def: 1,
            spAtk: 0.9,
            spDef: 1.1,
            spd: 1,
        },
        quirky: { atk: 1, def: 1, spAtk: 1, spDef: 1, spd: 1 },
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
        return Math.floor(
            statValue * (natureModifier[statKey as keyof BASE_STATS_TYPE] || 1),
        );
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
        atk: calculateStat(
            pokemon.baseStats.atk || 0,
            ivs.atk || 0,
            evs.atk || 0,
            level,
            nature,
            STATS_KEYS.ATTACK,
        ),
        def: calculateStat(
            pokemon.baseStats.def || 0,
            ivs.def || 0,
            evs.def || 0,
            level,
            nature,
            STATS_KEYS.DEFENSE,
        ),
        spAtk: calculateStat(
            pokemon.baseStats.spAtk || 0,
            ivs.spAtk || 0,
            evs.spAtk || 0,
            level,
            nature,
            STATS_KEYS.SP_ATTACK,
        ),
        spDef: calculateStat(
            pokemon.baseStats.spDef || 0,
            ivs.spDef || 0,
            evs.spDef || 0,
            level,
            nature,
            STATS_KEYS.SP_DEFENSE,
        ),
        spd: calculateStat(
            pokemon.baseStats.spd || 0,
            ivs.spd || 0,
            evs.spd || 0,
            level,
            nature,
            STATS_KEYS.SPEED,
        ),
    });
}

export default PkmStat;
