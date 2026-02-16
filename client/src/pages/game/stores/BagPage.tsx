//-Path: "PokeRotom/client/src/pages/game/stores/BagPage.tsx"
import { useEffect, useState } from 'react';
import { ShoppingBag, Loader2, PackageOpen } from 'lucide-react';
import { useInventoryStore } from '../../../stores/inventoryStore';

const CATEGORY_MAP = [
    { key: 'ball', label: 'Poké Balls', icon: '🔴' },
    { key: 'medicine', label: 'Medicine', icon: '💊' },
    { key: 'berry', label: 'Berries', icon: '🫐' },
    { key: 'key', label: 'Key Items', icon: '🔑' },
];

export default function BagPage() {
    const [activeTab, setActiveTab] = useState('ball');
    const { inventory, fetched, fetchInventory } = useInventoryStore();

    useEffect(() => {
        fetchInventory();
    }, []);

    if (!fetched) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">
                    กำลังจัดระเบียบกระเป๋า...
                </p>
            </div>
        );
    }

    const filteredItems = inventory.filter(
        (item) => item.category === activeTab,
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 text-purple-500 mb-2">
                        <ShoppingBag size={24} />
                        <span className="font-bold uppercase tracking-[0.2em] text-sm">
                            Trainer Inventory
                        </span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white">
                        🎒 กระเป๋า
                    </h1>
                </div>
                <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl">
                    {CATEGORY_MAP.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveTab(cat.key)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === cat.key ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                            <span>{cat.icon}</span>
                            <span className="hidden sm:inline">
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="group relative flex items-center gap-5 bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 hover:border-purple-500/50 transition-all cursor-default"
                            >
                                <div className="relative w-16 h-16 flex items-center justify-center bg-slate-800 rounded-2xl group-hover:bg-purple-500/10 transition-colors">
                                    <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform">
                                        {item.img ? (
                                            <img
                                                src={item.img}
                                                alt={item.name}
                                            />
                                        ) : (
                                            item.icon
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-black text-lg group-hover:text-purple-400 transition-colors">
                                            {item.name}
                                        </h3>
                                        <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-mono font-bold">
                                            x{item.quantity}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm line-clamp-1">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-10 bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-800">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                            <PackageOpen size={40} className="text-slate-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-400 mb-2">
                            ไม่มีไอเทมในหมวดนี้
                        </h2>
                        <p className="text-slate-500 text-center max-w-sm">
                            คุณยังไม่มีไอเทมประเภท{' '}
                            {
                                CATEGORY_MAP.find((c) => c.key === activeTab)
                                    ?.label
                            }{' '}
                            ลองไปแวะชมได้ที่ Poké Mart นะ!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
