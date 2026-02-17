// - Path: "PokeRotom/client/src/pages/game/stores/pokedex/components/ItemsList.tsx"
import { useNavigate } from 'react-router-dom';
import { Filter, SortAsc } from 'lucide-react';
import { ItemImg } from '../../../../../components/Image';
import type { Item } from '../../../../../types/inventory';

interface ItemsListProps {
    data: Item[];
    lastElementRef: (node: HTMLDivElement | null) => void;
    sortBy: 'id' | 'name';
    onSortChange: (sort: 'id' | 'name') => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    categories: string[];
}

export default function ItemsList({
    data,
    lastElementRef,
    sortBy,
    onSortChange,
    selectedCategory,
    onCategoryChange,
    categories,
}: ItemsListProps) {
    const navigate = useNavigate();

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter className="text-slate-400 w-4 h-4" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg block w-full sm:w-64 p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none capitalize"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.replace(/-/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-slate-400 text-sm font-medium">
                        Sort by:
                    </span>
                    <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-700">
                        <button
                            onClick={() => onSortChange('id')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                                sortBy === 'id'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <SortAsc size={14} /> ID
                        </button>
                        <button
                            onClick={() => onSortChange('name')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                                sortBy === 'name'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <SortAsc size={14} /> Name
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.map((item, index) => {
                    const isLast = index === data.length - 1;
                    return (
                        <div
                            key={item.id}
                            ref={isLast ? lastElementRef : null}
                            onClick={() =>
                                navigate(`/game/pokedex/item/${item.id}`)
                            }
                            className="po-section p-6 flex gap-4 group hover:border-blue-500/30 transition-all cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shrink-0">
                                <ItemImg
                                    item={item}
                                    className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-lg font-bold capitalize text-white">
                                        {item.name.replace(/-/g, ' ')}
                                    </h3>
                                    <span className="text-cyan-400 font-mono text-sm">
                                        {item.price === 0
                                            ? 'Not for Sale'
                                            : `₽${item.price}`}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {item.category && (
                                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-slate-700">
                                            {item.category.replace(/-/g, ' ')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 line-clamp-2">
                                    {item.desc || 'No description available.'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
