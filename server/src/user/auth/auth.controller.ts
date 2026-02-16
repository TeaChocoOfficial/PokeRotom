//-Path: "motiva/server/src/user/auth/auth.controller.ts"
import {
    Res,
    Get,
    Body,
    Post,
    Request,
    UseGuards,
    Controller,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { UserLoginDto } from '../dto/user.dto';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from '../schemas/user.schema';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LoginService } from './service/login.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { ResponseUserDto } from '../dto/response-user.dto';
import { RegisterService } from './service/register.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User Auth')
@Controller('user/auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly loginService: LoginService,
        private readonly registerService: RegisterService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAuth(@Request() req): Promise<ResponseUserDto | null> {
        return req.user ?? null;
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiResponse({
        status: 200,
        description: 'Login successful',
    })
    @ApiOperation({ summary: 'Login' })
    @ApiBody({
        required: true,
        type: UserLoginDto,
    })
    async login(
        @Request() req,
        @Res({ passthrough: true }) res,
    ): Promise<{ message: string; user: ResponseUserDto | null } | undefined> {
        const { accessToken } = await this.loginService.login(req.user);
        if (accessToken) {
            res.cookie('access_token', accessToken, {
                secure: true,
                httpOnly: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return {
                message: 'Login successful',
                user: await this.userService.responseUser(
                    { auth: true },
                    req.user,
                ),
            };
        }
    }

    @Post('logout')
    async logout(
        @Res({ passthrough: true }) res,
    ): Promise<{ message: string } | undefined> {
        res.clearCookie('access_token', {
            secure: true,
            httpOnly: true,
            sameSite: 'none',
        });
        return { message: 'Logout successful' };
    }

    @Post('register')
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @ApiOperation({ summary: 'Create a new user' })
    async register(@Body() body: RegisterDto): Promise<UserDocument | null> {
        return this.registerService.register(body);
    }
}
