//-Path: "motiva/server/src/user/dto/create-user.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
    @IsNumber()
    @ApiProperty({
        type: Number,
        required: true,
        example: 12345678,
        description: 'User ID',
    })
    readonly uid: number;

    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'name',
        description: 'Name',
    })
    readonly name: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: 'username',
        description: 'Username',
    })
    readonly username: string;

    @IsString()
    @ApiProperty({
        type: String,
        required: true,
        example: '12345678',
        description: 'Password',
    })
    readonly password: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
