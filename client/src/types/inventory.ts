//-Path: "PokeRotom/client/src/types/inventory.ts"

export type ItemCategory = 'ball' | 'medicine' | 'key' | 'berry';

export interface Item {
    id: number;
    name: string;
    category: ItemCategory;
    price: number;
    icon?: string;
    img?: string;
    desc: string;
}

export interface InventoryItem extends Item {
    quantity: number;
}

export interface InventoryData {
    coins: number;
    inventory: InventoryItem[];
}
