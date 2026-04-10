//-Path: "PokeRotom/server/src/user/user.module.ts"
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user.controller';
import { ImportsMongoose } from 'src/hooks/mongodb';
import { forwardRef, Module } from '@nestjs/common';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        ...new ImportsMongoose({ name: User.name, schema: UserSchema }).imports,
    ],
    exports: [UserService],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
