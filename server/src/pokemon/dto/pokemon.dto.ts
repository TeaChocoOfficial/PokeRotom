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

export class CatchPokemonDto {
    @IsNumber()
    pkmId: number;

    @IsNumber()
    ownerUid: number;

    @IsString()
    name: string;

    @IsString()
    img: string;

    @IsNumber()
    lv: number;
}

export class PokemonDto {
    @IsNumber()
    pkmId: number;

    @IsNumber()
    ownerUid: number;

    @IsBoolean()
    isInParty: boolean;

    @IsString()
    name: string;

    @IsString()
    img: string;

    @IsString()
    @IsOptional()
    nickname: string;

    @IsNumber()
    @IsOptional()
    lv: number;

    @IsNumber()
    @IsOptional()
    exp: number;

    @IsNumber()
    @IsOptional()
    index: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => IVsDto)
    ivs: IVsDto;
}

export class UpdatePartyDto {
    @IsBoolean()
    isInParty: boolean;
}

export class UpdateNicknameDto {
    @IsString()
    nickname: string;
}
