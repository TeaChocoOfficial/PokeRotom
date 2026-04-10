//-Path: "motiva/server/src/user/dto/user.dto.ts"
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
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

export class ReqUserDto {
    readonly user_id: number;
    readonly username: string;
    readonly online: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export type Auth = ReqUserDto | null;
