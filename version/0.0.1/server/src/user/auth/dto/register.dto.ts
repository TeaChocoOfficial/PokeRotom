//-Path: "motiva/server/src/user/auth/dto/register.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RegisterDto {
    @IsNumber()
    @ApiProperty({
        description:
            'Starter Pokemon ID (e.g. Gen1: 1,4,7 / Gen2: 152,155,158 / ... / Gen9: 906,909,912)',
        example: 1,
        default: 1,
    })
    readonly starterId: number;
    @IsString()
    @ApiProperty({
        description: 'Name',
        example: 'name',
        default: 'name',
    })
    readonly name: string;

    @IsString()
    @ApiProperty({
        description: 'Username',
        example: 'username',
        default: 'username',
    })
    readonly username: string;

    @IsString()
    @ApiProperty({
        description: 'Password',
        example: 'password',
        default: 'password',
    })
    readonly password: string;
}
