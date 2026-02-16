//-Path: "PokeRotom/server/src/pokemon/pokemon.controller.ts"
import {
    Get,
    Req,
    Body,
    Post,
    Param,
    Patch,
    Delete,
    UseGuards,
    Controller,
} from '@nestjs/common';
import {
    UpdatePartyDto,
    PokemonDto,
    UpdateNicknameDto,
} from './dto/pokemon.dto';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../user/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) {}

    /** POST /pokemon/catch - จับโปเกมอน */
    @Post('catch')
    catchPokemon(@Body() pokemonDto: PokemonDto, @Req() req) {
        pokemonDto.ownerUid = req.user.uid;
        return this.pokemonService.catchPokemon(pokemonDto);
    }

    /** GET /pokemon - ดึงโปเกมอนทั้งหมด */
    @Get()
    findAll(@Req() req) {
        return this.pokemonService.findAll(req.user.uid);
    }

    /** GET /pokemon/party - ดึงโปเกมอนในทีม */
    @Get('party')
    findParty(@Req() req) {
        return this.pokemonService.findParty(req.user.uid);
    }

    /** GET /pokemon/pc - ดึงโปเกมอนใน PC */
    @Get('pc')
    findInPC(@Req() req) {
        return this.pokemonService.findInPC(req.user.uid);
    }

    /** GET /pokemon/count - นับจำนวน */
    @Get('count')
    countAll(@Req() req) {
        return this.pokemonService.countAll(req.user.uid);
    }

    /** GET /pokemon/:id - ดึงโปเกมอนตาม ID */
    @Get(':id')
    findById(@Param('id') pokemonDocId: string, @Req() req) {
        return this.pokemonService.findById(pokemonDocId, req.user.uid);
    }

    /** PATCH /pokemon/:id/party - ย้ายเข้า/ออกทีม */
    @Patch(':id/party')
    updatePartyStatus(
        @Param('id') pokemonDocId: string,
        @Body() updatePartyDto: UpdatePartyDto,
        @Req() req,
    ) {
        return this.pokemonService.updatePartyStatus(
            pokemonDocId,
            updatePartyDto,
            req.user.uid,
        );
    }

    /** PATCH /pokemon/:id/nickname - เปลี่ยนชื่อเล่น */
    @Patch(':id/nickname')
    updateNickname(
        @Param('id') pokemonDocId: string,
        @Body() updateNicknameDto: UpdateNicknameDto,
        @Req() req,
    ) {
        return this.pokemonService.updateNickname(
            pokemonDocId,
            updateNicknameDto,
            req.user.uid,
        );
    }

    /** DELETE /pokemon/:id - ปล่อยโปเกมอน */
    @Delete(':id')
    releasePokemon(@Param('id') pokemonDocId: string, @Req() req) {
        return this.pokemonService.releasePokemon(pokemonDocId, req.user.uid);
    }
}
