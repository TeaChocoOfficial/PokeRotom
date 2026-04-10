//-Path: "PokeRotom/server/src/pokemon/schemas/caught-pokemon.schema.ts"
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PokemonDocument = Pokemon & Document;

@Schema({ collection: 'pokemon', timestamps: true })
export class Pokemon {
    @Prop({ required: true })
    pkmId: number;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    img: string;

    @Prop({ required: true, index: true })
    ownerUid: number;

    @Prop({ default: false })
    isInParty: boolean;

    @Prop({ default: '' })
    nickname: string;

    @Prop({ default: 1, alias: 'level' })
    lv: number;

    @Prop({ default: 0, alias: 'experience' })
    exp: number;

    @Prop({ default: -1 })
    index: number;

    @Prop({
        type: {
            hp: Number,
            atk: Number,
            def: Number,
            spAtk: Number,
            spDef: Number,
            spd: Number,
        },
        default: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0 },
    })
    ivs: {
        hp: number;
        atk: number;
        def: number;
        spAtk: number;
        spDef: number;
        spd: number;
    };
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
