//-Path: "motiva/server/src/user/auth/strategies/jwt.strategies.ts"
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SecureService } from 'src/secure/secure.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        readonly secureService: SecureService,
        private readonly userService: UserService,
    ) {
        const { JWT_SECRET } = secureService.getEnvConfig();
        if (!JWT_SECRET) {
            throw new Error('JWT secret is not defined');
        }
        super({
            secretOrKey: JWT_SECRET,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => request?.cookies?.access_token,
            ]),
        });
    }

    async validate(payload: UserDocument): Promise<ResponseUserDto | null> {
        return this.userService.responseUser({ auth: true }, payload);
    }
}
