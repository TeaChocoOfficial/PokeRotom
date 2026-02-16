//-Path: "motiva/server/src/user/dto/response-user.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ResponseUserDto {
    id: string;
    uid?: number;
    name?: string;
    username?: string;
    online?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class QueryOptions {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    auth?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    uid?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    online?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    createdAt?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    updatedAt?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    show_hidden?: string;
}

export class ResponseOptions {
    auth?: boolean;
    uid?: boolean;
    name?: boolean;
    username?: boolean;
    online?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}
