//-Path: "motiva/server/src/user/auth/strategies/local.strategies.ts"
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { LoginService } from '../service/login.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private loginService: LoginService) {
        super({
            usernameField: 'username',
            passwordField: 'password',
        });
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.loginService.validateUser(username, password);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
