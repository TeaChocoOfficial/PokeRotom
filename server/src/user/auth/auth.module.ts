//-Path: "motiva/server/src/user/auth/auth.module.ts"
import { importJwt } from 'src/hooks/jwt';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ImportsMongoose } from 'src/hooks/mongodb';
import { forwardRef, Module } from '@nestjs/common';
import { LoginService } from './service/login.service';
import { JwtStrategy } from './strategies/jwt.strategies';
import { LocalStrategy } from './strategies/local.strategies';
import { RegisterService } from './service/register.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
    imports: [
        PassportModule,
        importJwt(),
        forwardRef(() => UserModule),
        ...new ImportsMongoose({ name: User.name, schema: UserSchema }).imports,
        PokemonModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        LoginService,
        LocalStrategy,
        RegisterService,
    ],
})
export class AuthModule {}
