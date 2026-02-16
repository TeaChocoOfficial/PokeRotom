// - Path: "PokeRotom/server/src/data/starter.ts"

export interface StarterData {
    name: string;
    height: number;
    weight: number;
    spriteUrl: string;
}

/** ข้อมูล Starter Pokémon ทุก Gen */
export const starterMap: Record<number, StarterData> = {
    // Gen 1
    1: {
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    },
    4: {
        name: 'charmander',
        height: 6,
        weight: 85,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    },
    7: {
        name: 'squirtle',
        height: 5,
        weight: 90,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    },
    // Gen 2
    152: {
        name: 'chikorita',
        height: 9,
        weight: 64,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png',
    },
    155: {
        name: 'cyndaquil',
        height: 5,
        weight: 79,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png',
    },
    158: {
        name: 'totodile',
        height: 6,
        weight: 95,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png',
    },
    // Gen 3
    252: {
        name: 'treecko',
        height: 5,
        weight: 50,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/252.png',
    },
    255: {
        name: 'torchic',
        height: 4,
        weight: 25,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/255.png',
    },
    258: {
        name: 'mudkip',
        height: 4,
        weight: 76,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/258.png',
    },
    // Gen 4
    387: {
        name: 'turtwig',
        height: 4,
        weight: 102,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/387.png',
    },
    390: {
        name: 'chimchar',
        height: 5,
        weight: 62,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/390.png',
    },
    393: {
        name: 'piplup',
        height: 4,
        weight: 52,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png',
    },
    // Gen 5
    495: {
        name: 'snivy',
        height: 6,
        weight: 81,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/495.png',
    },
    498: {
        name: 'tepig',
        height: 5,
        weight: 99,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/498.png',
    },
    501: {
        name: 'oshawott',
        height: 5,
        weight: 59,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/501.png',
    },
    // Gen 6
    650: {
        name: 'chespin',
        height: 4,
        weight: 90,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/650.png',
    },
    653: {
        name: 'fennekin',
        height: 4,
        weight: 94,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/653.png',
    },
    656: {
        name: 'froakie',
        height: 3,
        weight: 70,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/656.png',
    },
    // Gen 7
    722: {
        name: 'rowlet',
        height: 3,
        weight: 15,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/722.png',
    },
    725: {
        name: 'litten',
        height: 4,
        weight: 43,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/725.png',
    },
    728: {
        name: 'popplio',
        height: 4,
        weight: 75,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/728.png',
    },
    // Gen 8
    810: {
        name: 'grookey',
        height: 3,
        weight: 50,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/810.png',
    },
    813: {
        name: 'scorbunny',
        height: 3,
        weight: 45,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/813.png',
    },
    816: {
        name: 'sobble',
        height: 3,
        weight: 40,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/816.png',
    },
    // Gen 9
    906: {
        name: 'sprigatito',
        height: 4,
        weight: 41,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/906.png',
    },
    909: {
        name: 'fuecoco',
        height: 4,
        weight: 98,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/909.png',
    },
    912: {
        name: 'quaxly',
        height: 5,
        weight: 61,
        spriteUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/912.png',
    },
};
