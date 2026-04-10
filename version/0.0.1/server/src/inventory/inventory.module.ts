//-Path: "PokeRotom/server/src/inventory/inventory.module.ts"
import { Module } from '@nestjs/common';
import { ImportsMongoose } from 'src/hooks/mongodb';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
    imports: [
        ...new ImportsMongoose({ name: User.name, schema: UserSchema }).imports,
    ],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [InventoryService],
})
export class InventoryModule {}
