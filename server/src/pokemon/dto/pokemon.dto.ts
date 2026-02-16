//-Path: "PokeRotom/server/src/pokemon/dto/catch-pokemon.dto.ts"

import { Type } from 'class-transformer';
import {
    IsNumber,
    IsString,
    IsBoolean,
    IsOptional,
    ValidateNested,
} from 'class-validator';

export class IVsDto {
    @IsNumber()
    hp: number;

    @IsNumber()
    atk: number;

    @IsNumber()
    def: number;

    @IsNumber()
    spAtk: number;

    @IsNumber()
    spDef: number;

    @IsNumber()
    spd: number;
}

export class PokemonDto {
    @IsNumber()
    pkmId: number;

    @IsNumber()
    @IsOptional()
    ownerUid?: number;

    @IsBoolean()
    @IsOptional()
    isInParty?: boolean;

    @IsString()
    name: string;

    @IsString()
    spriteUrl: string;

    @IsString()
    @IsOptional()
    nickname?: string;

    @IsNumber()
    @IsOptional()
    lv?: number;

    @IsNumber()
    @IsOptional()
    exp?: number;

    @IsNumber()
    @IsOptional()
    index?: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => IVsDto)
    ivs?: IVsDto;
}

export class UpdatePartyDto {
    @IsBoolean()
    isInParty: boolean;
}

export class UpdateNicknameDto {
    @IsString()
    nickname: string;
}
