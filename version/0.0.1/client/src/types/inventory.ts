//-Path: "PokeRotom/client/src/types/inventory.ts"

export type ItemCategory = 'ball' | 'medicine' | 'key' | 'berry';

export interface Item {
    id: number;
    name: string;
    price: number;
    category?: string;
    desc: string;
    img?: string;
    effect?: string;
    shortEffect?: string;
}

export interface InventoryItem extends Item {
    quantity: number;
}

export interface InventoryData {
    coins: number;
    inventory: InventoryItem[];
}
