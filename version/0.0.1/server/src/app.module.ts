//-Path: "PokeRotom/server/src/app.module.ts"
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { SecureModule } from './secure/secure.module';
import { SecureService } from './secure/secure.service';
import { PokemonModule } from './pokemon/pokemon.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
    imports: [
        UserModule,
        RoomModule,
        SecureModule,
        PokemonModule,
        InventoryModule,
    ],
    controllers: [AppController],
    providers: [AppService, SecureService],
})
export class AppModule {}
