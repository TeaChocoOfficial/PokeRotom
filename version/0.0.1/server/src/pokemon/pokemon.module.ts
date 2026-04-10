//-Path: "PokeRotom/server/src/pokemon/pokemon.module.ts"
import { UserModule } from 'src/user/user.module';
import { PokemonService } from './pokemon.service';
import { ImportsMongoose } from 'src/hooks/mongodb';
import { forwardRef, Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './schemas/pokemon.schema';

@Module({
    imports: [
        forwardRef(() => UserModule),
        ...new ImportsMongoose({ name: Pokemon.name, schema: PokemonSchema })
            .imports,
    ],
    exports: [PokemonService],
    providers: [PokemonService],
    controllers: [PokemonController],
})
export class PokemonModule {}
