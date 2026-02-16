//-Path: "PokeRotom/client/src/types/pokemon.ts"

export interface Pokemon {
    _id: string;
    pkmId: number;
    name: string;
    nickname: string;
    spriteUrl: string;
    isInParty: boolean;
    lv: number;
    exp: number;
    index: number;
    ivs: {
        hp: number;
        atk: number;
        def: number;
        spAtk: number;
        spDef: number;
        spd: number;
    };
    createdAt: string;
    updatedAt: string;
}
