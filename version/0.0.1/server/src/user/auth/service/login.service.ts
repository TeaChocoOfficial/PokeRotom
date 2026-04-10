//-Path: "motiva/server/src/user/auth/service/login.service.ts"
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { nameDB } from 'src/hooks/mongodb';
import { AuthService } from '../auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterService } from './register.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class LoginService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
        private readonly registerService: RegisterService,
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async login(user: User) {
        if (user.username) return { accessToken: this.jwtService.sign(user) };
        throw new BadRequestException({ user });
    }

    async validateUser(
        username: string,
        password: string,
    ): Promise<User | undefined> {
        const validateUser = await this.registerService.validateUser(
            username,
            password,
        );
        if (!validateUser) return;
        const createHash = this.authService.createHash();
        const user = await this.userModel.findOne({ username }).exec();

        if (user && createHash(password) === user.password) {
            const result = user.toObject();
            return result;
        }
        throw new BadRequestException('Invalid username or password');
    }
}
