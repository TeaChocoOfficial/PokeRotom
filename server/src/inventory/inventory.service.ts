// -Path: "PokeRotom/server/src/inventory/inventory.service.ts"
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { nameDB } from '../hooks/mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { getAllItems, Item } from '../data/items.data';
import { SecureService } from 'src/secure/secure.service';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class InventoryService {
    constructor(
        @InjectModel(User.name, nameDB)
        private userModel: Model<UserDocument>,
        private secureService: SecureService,
    ) {}

    getAllItems(): Item[] {
        return getAllItems(this.secureService.getEnvConfig());
    }

    async getInventory(username: string) {
        const user = await this.userModel.findOne({ username });
        if (!user) throw new NotFoundException('User not found');

        const inventory = user.inventory.map((invItem) => {
            const item = this.getAllItems().find(
                (i) => i.id === invItem.itemId,
            );
            return {
                ...item,
                quantity: invItem.quantity,
            };
        });

        return {
            coins: user.coins,
            inventory,
        };
    }

    async buyItem(username: string, itemId: number, quantity: number) {
        if (quantity <= 0) throw new BadRequestException('Invalid quantity');

        const item = this.getAllItems().find((i) => i.id === itemId);
        if (!item) throw new NotFoundException('Item not found');

        const user = await this.userModel.findOne({ username });
        if (!user) throw new NotFoundException('User not found');

        const totalCost = item.price * quantity;
        if (user.coins < totalCost)
            throw new BadRequestException('Not enough coins');

        // Deduct coins
        user.coins -= totalCost;

        // Add to inventory
        const existingItem = user.inventory.find((i) => i.itemId === itemId);
        if (existingItem) existingItem.quantity += quantity;
        else user.inventory.push({ itemId, quantity });

        await user.save();
        return this.getInventory(username);
    }

    async useItem(username: string, itemId: number, quantity: number) {
        if (quantity <= 0) throw new BadRequestException('Invalid quantity');
        const user = await this.userModel.findOne({ username });
        if (!user) throw new NotFoundException('User not found');

        const itemIndex = user.inventory.findIndex((i) => i.itemId === itemId);
        if (itemIndex === -1 || user.inventory[itemIndex].quantity <= 0)
            throw new BadRequestException('Item not in inventory');

        // Key items are not consumed (standard Pokemon logic, but can vary)
        const itemDef = this.getAllItems().find((i) => i.id === itemId);
        if (itemDef?.category !== 'key') {
            user.inventory[itemIndex].quantity -= quantity;
            if (user.inventory[itemIndex].quantity <= 0)
                user.inventory.splice(itemIndex, 1);
        }

        await user.save();
        return this.getInventory(username);
    }
}
