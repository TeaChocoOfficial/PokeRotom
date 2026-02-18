//-Path: "PokeRotom/server/src/pokemon/pokemon.service.ts"
import {
    Inject,
    Injectable,
    forwardRef,
    BadRequestException,
} from '@nestjs/common';
import {
    PokemonDto,
    UpdatePartyDto,
    CatchPokemonDto,
    UpdateNicknameDto,
} from './dto/pokemon.dto';
import { Model } from 'mongoose';
import { nameDB } from 'src/hooks/mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { Pokemon, PokemonDocument } from './schemas/pokemon.schema';

@Injectable()
export class PokemonService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @InjectModel(Pokemon.name, nameDB)
        private readonly pokemonModel: Model<PokemonDocument>,
    ) {}

    /** จับโปเกมอนแล้วบันทึกลง DB */
    async catchPokemon(pokemonDto: CatchPokemonDto): Promise<PokemonDocument> {
        const user = await this.userService.findByUid(pokemonDto.ownerUid);
        if (!user) throw new BadRequestException('User not found');

        const currentParty = await this.findParty(user.uid);
        const isInParty = currentParty.length < 6;
        const index = isInParty ? currentParty.length : -1;

        const ivHp = Math.floor(Math.random() * 32);
        const ivAtk = Math.floor(Math.random() * 32);
        const ivDef = Math.floor(Math.random() * 32);
        const ivSpAtk = Math.floor(Math.random() * 32);
        const ivSpDef = Math.floor(Math.random() * 32);
        const ivSpd = Math.floor(Math.random() * 32);

        const newPokemon: PokemonDto = {
            pkmId: pokemonDto.pkmId,
            ownerUid: pokemonDto.ownerUid,
            name: pokemonDto.name,
            img: pokemonDto.img,
            isInParty: isInParty,
            nickname: '',
            index: index,
            lv: pokemonDto.lv,
            exp: 0,
            ivs: {
                hp: ivHp,
                atk: ivAtk,
                def: ivDef,
                spAtk: ivSpAtk,
                spDef: ivSpDef,
                spd: ivSpd,
            },
        };
        const createdPokemon = new this.pokemonModel(newPokemon);
        return createdPokemon.save();
    }

    /** ดึงโปเกมอนทั้งหมดที่จับได้ (PC) */
    async findAll(ownerUid: number): Promise<PokemonDocument[]> {
        return this.pokemonModel
            .find({ ownerUid })
            .sort({ createdAt: -1 })
            .exec();
    }

    /** ดึงโปเกมอนในทีม (Party - สูงสุด 6 ตัว) */
    async findParty(ownerUid: number): Promise<PokemonDocument[]> {
        return this.pokemonModel
            .find({ ownerUid, isInParty: true })
            .sort({ partyPosition: 1 })
            .exec();
    }

    /** เพิ่ม EXP */
    /** คำนวณ max exp ตาม lv */
    getMaxExp(lv: number): number {
        return lv * lv * 10;
    }

    /** เพิ่ม EXP พร้อม level up อัตโนมัติ */
    async addExp(
        pokemonDocId: string,
        amount: number,
    ): Promise<PokemonDocument | null> {
        const pokemon = await this.pokemonModel.findById(pokemonDocId).exec();
        if (!pokemon) return null;

        let currentLv = pokemon.lv;
        let currentExp = pokemon.exp + amount;

        while (currentLv < 100) {
            const limit = this.getMaxExp(currentLv);
            if (currentExp < limit) break;
            currentExp -= limit;
            currentLv++;
        }

        if (currentLv >= 100) {
            currentLv = 100;
            currentExp = 0;
        }

        return this.pokemonModel
            .findByIdAndUpdate(
                pokemonDocId,
                { lv: currentLv, exp: currentExp },
                { new: true },
            )
            .exec();
    }

    /** ดึงโปเกมอนใน PC (ไม่อยู่ในทีม) */
    async findInPC(ownerUid: number): Promise<PokemonDocument[]> {
        return this.pokemonModel
            .find({ ownerUid, isInParty: false })
            .sort({ createdAt: -1 })
            .exec();
    }

    /** ดึงโปเกมอนตาม ID */
    async findById(
        pokemonDocId: string,
        ownerUid: number,
    ): Promise<PokemonDocument | null> {
        return this.pokemonModel
            .findOne({ _id: pokemonDocId, ownerUid })
            .exec();
    }

    /** อัปเดตสถานะ Party */
    async updatePartyStatus(
        pokemonDocId: string,
        updatePartyDto: UpdatePartyDto,
        ownerUid: number,
    ): Promise<PokemonDocument | null> {
        const currentParty = await this.findParty(ownerUid);

        if (updatePartyDto.isInParty) {
            if (currentParty.length >= 6) return null;
        } else {
            if (currentParty.length <= 1)
                throw new BadRequestException(
                    'ต้องมีโปเกมอนในทีมอย่างน้อย 1 ตัว',
                );
        }

        return this.pokemonModel
            .findOneAndUpdate({ _id: pokemonDocId, ownerUid }, updatePartyDto, {
                new: true,
            })
            .exec();
    }

    /** อัปเดตชื่อเล่น */
    async updateNickname(
        pokemonDocId: string,
        updateNicknameDto: UpdateNicknameDto,
        ownerUid: number,
    ): Promise<PokemonDocument | null> {
        return this.pokemonModel
            .findOneAndUpdate(
                { _id: pokemonDocId, ownerUid },
                updateNicknameDto,
                { new: true },
            )
            .exec();
    }

    /** ปล่อยโปเกมอน */
    async releasePokemon(
        pokemonDocId: string,
        ownerUid: number,
    ): Promise<PokemonDocument | null> {
        const pokemon = await this.findById(pokemonDocId, ownerUid);
        if (!pokemon) return null;

        if (pokemon.isInParty) {
            const currentParty = await this.findParty(ownerUid);
            if (currentParty.length <= 1)
                throw new BadRequestException(
                    'ไม่สามารถปล่อยโปเกมอนตัวสุดท้ายในทีมได้',
                );
        }

        return this.pokemonModel
            .findOneAndDelete({ _id: pokemonDocId, ownerUid })
            .exec();
    }

    /** นับจำนวนโปเกมอนทั้งหมด */
    async countAll(ownerUid: number): Promise<number> {
        return this.pokemonModel.countDocuments({ ownerUid }).exec();
    }
}
