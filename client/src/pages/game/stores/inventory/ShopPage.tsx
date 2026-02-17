//-Path: "PokeRotom/client/src/pages/game/stores/ShopPage.tsx"
import {
    Tag,
    Info,
    Plus,
    Minus,
    Coins,
    Package,
    ShoppingCart,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { inventoryAPI } from '../../../../api/inventoryApi';
import { useInventoryStore } from '../../../../stores/inventoryStore';

export default function ShopPage() {
    const {
        coins,
        fetched,
        allItems,
        inventory,
        setCoins,
        setAllItems,
        itemsFetched,
        setInventory,
        updateFromData,
        optimisticUpdate,
    } = useInventoryStore();
    const [error, setError] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    const fetchShopData = async () => {
        try {
            if (!itemsFetched) {
                const { data } = await inventoryAPI.getItems();
                setAllItems(data);

                const initialQuantities = data.reduce(
                    (acc: any, item: any) => ({ ...acc, [item.id]: 1 }),
                    {},
                );
                setQuantities(initialQuantities);
            } else if (
                allItems.length > 0 &&
                Object.keys(quantities).length === 0
            ) {
                const initialQuantities = allItems.reduce(
                    (acc: any, item: any) => ({ ...acc, [item.id]: 1 }),
                    {},
                );
                setQuantities(initialQuantities);
            }

            if (!fetched) {
                const { data } = await inventoryAPI.getInventory();
                updateFromData(data);
            }
        } catch (error) {
            console.error('Failed to fetch shop data:', error);
        }
    };

    useEffect(() => {
        fetchShopData();
    }, []);

    const handleQuantityBlur = (itemId: number) => {
        setQuantities((prev) => ({
            ...prev,
            [itemId]: Math.max(1, prev[itemId] || 1),
        }));
    };

    const updateQuantity = (itemId: number, delta: number) => {
        setQuantities((prev) => ({
            ...prev,
            [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
        }));
    };

    const handleQuantityChange = (itemId: number, value: string) => {
        const val = value.replace(/\D/g, '');
        const num = val === '' ? 0 : parseInt(val);
        setQuantities((prev) => ({ ...prev, [itemId]: num }));
    };

    const handleBuy = async (itemId: number) => {
        const item = allItems.find((i) => i.id === itemId);
        if (!item) return;

        const quantity = Math.max(1, quantities[itemId] || 1);
        const totalPrice = item.price * quantity;

        if (coins < totalPrice) {
            setError('ยอดเงินคงเหลือไม่เพียงพอครับ!');
            setTimeout(() => setError(null), 3000);
            return;
        }

        setError(null);
        // Optimistic Update
        const oldCoins = coins;
        const oldInventory = [...inventory];
        optimisticUpdate(coins - totalPrice, itemId, quantity);
        setQuantities((prev) => ({ ...prev, [itemId]: 1 }));

        try {
            const { data } = await inventoryAPI.buyItem(itemId, quantity);
            updateFromData(data);
        } catch (error: any) {
            console.error('Failed to buy item:', error);
            // Rollback
            setCoins(oldCoins);
            setInventory(oldInventory);

            const message =
                error.response?.data?.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ';
            setError(message);
            setTimeout(() => setError(null), 3000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <div className="flex items-center gap-3 text-green-500 mb-2">
                        <ShoppingCart size={24} />
                        <span className="font-bold uppercase tracking-[0.2em] text-sm">
                            Official Poké Mart
                        </span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white">
                        🛍️ ร้านค้า
                    </h1>
                </div>

                <div className="group relative">
                    <div className="absolute inset-0 bg-yellow-400/20 blur-2xl group-hover:bg-yellow-400/30 transition-all rounded-full" />
                    <div className="relative flex items-center gap-4 bg-slate-900 border-2 border-yellow-500/50 rounded-4xl px-8 py-4 shadow-2xl">
                        <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-900/40">
                            <Coins size={28} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                Your Balance
                            </p>
                            <p className="text-3xl font-black text-yellow-500 leading-none mt-1">
                                ₽{coins.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 animate-in fade-in slide-in-from-top-4 duration-300">
                    <Info size={20} />
                    <p className="font-bold text-sm">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allItems.map((item) => {
                    const quantity = quantities[item.id] || 1;
                    const totalPrice = item.price * quantity;
                    const canAfford = coins >= totalPrice;
                    const ownedQuantity =
                        inventory.find((i) => i.id === item.id)?.quantity || 0;

                    return (
                        <div
                            key={item.id}
                            className="group relative flex flex-col bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 hover:border-green-500/50 transition-all overflow-hidden shadow-xl"
                        >
                            <div className="p-8 pb-4 flex items-start justify-between">
                                <div className="relative w-24 h-24 flex items-center justify-center bg-slate-800 rounded-3xl group-hover:bg-green-500/10 transition-colors">
                                    <span className="text-5xl relative z-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-16 h-16 object-contain"
                                        />
                                    </span>
                                    <div className="absolute inset-0 bg-green-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-green-400">
                                        <Tag size={12} />
                                        {item.category}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-yellow-500/80 transition-colors">
                                        <Package size={12} />
                                        In Bag: {ownedQuantity}
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 flex-1">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-green-400 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 min-h-10">
                                    {item.desc}
                                </p>

                                <div className="mt-6 flex flex-col gap-4">
                                    <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, -1)
                                            }
                                            className="w-10 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors active:scale-95 text-white"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity || ''}
                                            onChange={(event) =>
                                                handleQuantityChange(
                                                    item.id,
                                                    event.target.value,
                                                )
                                            }
                                            onBlur={() =>
                                                handleQuantityBlur(item.id)
                                            }
                                            className="bg-transparent font-black text-xl text-white w-12 text-center focus:outline-none"
                                        />
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, 1)
                                            }
                                            className="w-10 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors active:scale-95 text-white"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            Total Price:
                                        </span>
                                        <span
                                            className={`font-black text-xl ${canAfford ? 'text-yellow-500' : 'text-red-500 animate-pulse'}`}
                                        >
                                            ₽{totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 mt-6 border-t border-slate-800/50 bg-slate-900/40">
                                <button
                                    onClick={() => handleBuy(item.id)}
                                    disabled={!canAfford || item.price === 0}
                                    className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                                        canAfford && item.price > 0
                                            ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/40 active:scale-95'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }`}
                                >
                                    {item.price === 0
                                        ? 'Unavailable'
                                        : 'Complete Purchase'}
                                </button>
                            </div>

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="p-2 bg-slate-800/50 rounded-full text-slate-500 hover:text-white cursor-help">
                                    <Info size={16} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
