//-Path: "PokeRotom/client/src/stores/inventoryStore.ts"
import { create } from 'zustand';
import type { Item, InventoryItem } from '../types/inventory';
import { inventoryAPI } from '../api/inventoryApi';

interface InventoryState {
    coins: number;
    allItems: Item[];
    fetched: boolean;
    itemsFetched: boolean;
    inventory: InventoryItem[];
    setCoins: (coins: number) => void;
    setAllItems: (items: Item[]) => void;
    setInventory: (inventory: InventoryItem[]) => void;
    updateFromData: (data: {
        coins: number;
        inventory: InventoryItem[];
    }) => void;
    fetchInventory: () => Promise<void>;
    optimisticUpdate: (coins: number, itemId: number, quantity: number) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
    coins: 0,
    inventory: [],
    allItems: [],
    fetched: false,
    itemsFetched: false,
    setCoins: (coins) => set({ coins }),
    setAllItems: (allItems) => set({ allItems, itemsFetched: true }),
    setInventory: (inventory) => set({ inventory, fetched: true }),
    updateFromData: (data) =>
        set({ coins: data.coins, inventory: data.inventory, fetched: true }),
    optimisticUpdate: (newCoins, itemId, quantity) => {
        const currentInventory = [...get().inventory];
        const itemIndex = currentInventory.findIndex((i) => i.id === itemId);

        if (itemIndex > -1) {
            currentInventory[itemIndex] = {
                ...currentInventory[itemIndex],
                quantity: currentInventory[itemIndex].quantity + quantity,
            };
        } else {
            const itemBase = get().allItems.find((i) => i.id === itemId);
            if (itemBase) {
                currentInventory.push({
                    ...itemBase,
                    quantity: quantity,
                });
            }
        }

        set({ coins: newCoins, inventory: currentInventory });
    },
    fetchInventory: async () => {
        if (get().fetched) return;
        try {
            const { data } = await inventoryAPI.getInventory();
            get().updateFromData(data);
        } catch (error) {
            console.error('Failed to fetch bag:', error);
        } finally {
            set({ fetched: true });
        }
    },
}));
