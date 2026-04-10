//-Path: "PokeRotom/server/src/inventory/inventory.controller.ts"
import {
    Get,
    Post,
    Body,
    Request,
    UseGuards,
    Controller,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../user/auth/guard/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Get()
    getInventory(@Request() req) {
        return this.inventoryService.getInventory(req.user.username);
    }

    @Get('items')
    getAllItems() {
        return this.inventoryService.getAllItems();
    }

    @Post('buy')
    buyItem(
        @Request() req,
        @Body() body: { itemId: number; quantity: number },
    ) {
        return this.inventoryService.buyItem(
            req.user.username,
            body.itemId,
            body.quantity,
        );
    }

    @Post('use')
    useItem(
        @Request() req,
        @Body() body: { itemId: number; quantity: number },
    ) {
        return this.inventoryService.useItem(
            req.user.username,
            body.itemId,
            body.quantity,
        );
    }
}
