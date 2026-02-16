//-Path: "PokeRotom/server/src/room/room.module.ts"
import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';
import { UserModule } from '../user/user.module';
import { PokemonModule } from '../pokemon/pokemon.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
    imports: [UserModule, PokemonModule, InventoryModule],
    providers: [RoomGateway, RoomService],
})
export class RoomModule {}
