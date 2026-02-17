//-Path: "PokeRotom/server/src/user/auth/service/register.service.ts"
import { Model } from 'mongoose';
import { nameDB } from 'src/hooks/mongodb';
import { AuthService } from '../auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from '../dto/register.dto';
import { starterMap } from 'src/data/starter.data';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class RegisterService {
    constructor(
        private readonly authService: AuthService,
        @InjectModel(User.name, nameDB)
        private readonly userModel: Model<UserDocument>,
        private readonly pokemonService: PokemonService,
    ) {}

    async register(register: RegisterDto): Promise<UserDocument | null> {
        const validateUser = await this.validateUser(
            register.username,
            register.password,
        );
        if (!validateUser) return null;

        const starter = starterMap[register.starterId];
        if (!starter)
            throw new BadRequestException(
                'Invalid starter ID. Choose a valid starter Pokémon.',
            );

        const existingUser = await this.userModel
            .findOne({ username: register.username })
            .exec();
        if (existingUser)
            throw new BadRequestException('Username already exists');

        const createHash = this.authService.createHash();
        const hashedPassword = createHash(register.password);

        const lastUser = await this.userModel
            .findOne()
            .sort({ uid: -1 })
            .exec();
        const uid = lastUser ? lastUser.uid + 1 : 1;

        const newUser = new this.userModel({
            ...register,
            password: hashedPassword,
            inventory: [{ itemId: 0, quantity: 20 }],
            uid,
        });
        const savedUser = await newUser.save();

        await this.pokemonService.catchPokemon({
            pkmId: register.starterId,
            ownerUid: savedUser.uid,
            name: starter.name,
            img: starter.img,
            lv: 5,
        });

        return savedUser;
    }

    async validateUser(username: string, password: string): Promise<boolean> {
        if (username === '')
            throw new BadRequestException("Username can't be empty");
        else if (password === '')
            throw new BadRequestException("Password can't be empty");
        else if (password.length < 8)
            throw new BadRequestException('Password must be 8 characters');
        else return true;
    }
}
