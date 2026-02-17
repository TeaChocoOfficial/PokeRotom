//-Path: "motiva/server/src/user/user.service.ts"
import {
    QueryOptions,
    ResponseOptions,
    ResponseUserDto,
} from './dto/response-user.dto';
import { Model, Types } from 'mongoose';
import { nameDB } from 'src/hooks/mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async responseUser(
        options: ResponseOptions = {},
        user?: UserDocument | null,
    ): Promise<ResponseUserDto | null> {
        if (user) {
            const { username } = user;
            const responseUser: ResponseUserDto = {
                id: user._id.toString(),
            };
            if (options.auth) {
                options = {
                    ...options,
                    uid: true,
                    name: true,
                    username: true,
                    online: true,
                    createdAt: true,
                    updatedAt: true,
                };
            }
            const { uid, name, online, createdAt, updatedAt } = user;

            if (options.uid) responseUser.uid = uid;
            if (options.name) responseUser.name = name;
            if (options.username) responseUser.username = username;
            if (options.online) responseUser.online = online;
            if (options.createdAt) responseUser.createdAt = createdAt;
            if (options.updatedAt) responseUser.updatedAt = updatedAt;
            return responseUser;
        }
        return null;
    }

    options(querys: QueryOptions): ResponseOptions | undefined {
        const { auth, uid, name, username, online, createdAt, updatedAt } =
            querys;
        if (Object.keys(querys).length === 0) return undefined;
        return {
            auth: auth !== undefined,
            uid: uid !== undefined,
            name: name !== undefined,
            username: username !== undefined,
            online: online !== undefined,
            createdAt: createdAt !== undefined,
            updatedAt: updatedAt !== undefined,
        };
    }

    async findAll(
        options?: ResponseOptions,
    ): Promise<(ResponseUserDto | null)[]> {
        const users = await this.userModel.find().exec();
        return Promise.all(
            users.map((user) => this.responseUser(options, user)),
        );
    }

    async findUser(
        user_id: string,
        options?: ResponseOptions,
    ): Promise<ResponseUserDto | null> {
        try {
            const id = new Types.ObjectId(user_id);
            const user = await this.userModel.findById(id).exec();
            return this.responseUser(options, user);
        } catch {
            return null;
        }
    }

    async findByUid(uid: number): Promise<UserDocument | null> {
        return this.userModel.findOne({ uid }).exec();
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async create(user: CreateUserDto): Promise<User> {
        const result = new this.userModel(user);
        return result.save();
    }

    async update(user_id: string, updateUserDto: UpdateUserDto) {
        return this.userModel.updateOne({ _id: user_id }, updateUserDto).exec();
    }

    async remove(user_id: string) {
        return this.userModel.findByIdAndDelete(user_id).exec();
    }

    async ban(user_id: string) {
        return this.userModel
            .updateOne({ _id: user_id }, { is_active: false })
            .exec();
    }

    async addCoins(user_id: string, amount: number) {
        return this.userModel
            .findByIdAndUpdate(
                user_id,
                { $inc: { coins: amount } },
                { new: true },
            )
            .exec();
    }
}
