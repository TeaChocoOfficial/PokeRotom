// - Path: "PokeRotom/server/src/inventory/dto/item.dto.ts"
import { IsNumber, IsString } from 'class-validator';

export class ItemDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    category: 'ball' | 'medicine' | 'key' | 'berry';

    @IsNumber()
    price: number;

    @IsString()
    img: string;

    @IsString()
    desc: string;
}
