//-Path: "PokeRotom/server/src/pokemon/pokemon.module.ts"
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PokemonService } from './pokemon.service';
import { ImportsMongoose } from 'src/hooks/mongodb';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './schemas/pokemon.schema';

@Module({
    imports: [
        UserModule,
        ...new ImportsMongoose({ name: Pokemon.name, schema: PokemonSchema })
            .imports,
    ],
    providers: [PokemonService],
    controllers: [PokemonController],
    exports: [PokemonService],
})
export class PokemonModule {}
