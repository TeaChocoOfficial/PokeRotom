//-Path: "PokeRotom/server/src/user/schemas/user.schema.ts"
import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

export type UserJWTPayload = UserDocument & { iat: number; exp: number };

@Schema({ _id: false })
export class UserInventory {
    @Prop({ required: true })
    itemId: number;

    @Prop({ default: 1 })
    quantity: number;
}

@Schema({ _id: false })
export class PartyPokemonStatus {
    @Prop({ default: 0 })
    hp: number;

    @Prop({ default: 'none' })
    status: string;

    @Prop({ required: true })
    pokemonDocId: string;
}

@Schema({ collection: 'users', timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    uid: number;

    @Prop({ required: true })
    name: string;

    @Prop({ default: 1000 })
    coins: number;

    @Prop({ default: 0 })
    online: number;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [UserInventory], default: [] })
    inventory: UserInventory[];

    @Prop({ type: [PartyPokemonStatus], default: [] })
    partyData: PartyPokemonStatus[];

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ createdAt: 1 });
