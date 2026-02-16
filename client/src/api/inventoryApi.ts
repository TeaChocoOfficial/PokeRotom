//-Path: "PokeRotom/client/src/api/inventoryApi.ts"
import serverRest from './api';
import type { Item, InventoryData } from '../types/inventory';

export const inventoryAPI = {
    getInventory: () => serverRest.get<InventoryData>('/inventory'),
    getItems: () => serverRest.get<Item[]>('/inventory/items'),
    buyItem: (itemId: number, quantity: number) =>
        serverRest.post<InventoryData>('/inventory/buy', { itemId, quantity }),
    useItem: (itemId: number, quantity: number) =>
        serverRest.post<InventoryData>('/inventory/use', { itemId, quantity }),
};
