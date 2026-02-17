// - Path: "PokeRotom/client/src/pages/game/stores/pokedex/PokedexItemDetailPage.tsx"
import { useQuery } from '@apollo/client/react';
import PokeApi from '../../../../../types/pokeApi';
import { ItemImg } from '../../../../../components/Image';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_ITEM_DETAIL } from '../../../../../graphQL/pokeApi';
import { Zap, Info, ChevronLeft, CircleDollarSign, Box } from 'lucide-react';

export default function PokedexItemDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery<PokeApi.ItemDetailData>(
        GET_ITEM_DETAIL,
        {
            variables: { id: Number(id) },
        },
    );

    if (loading)
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );

    if (error || !data?.pokemon_v2_item_by_pk)
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold mb-2">
                        ไม่พบไอเทมชิ้นนี้...
                    </h2>
                    <p className="mb-4 text-sm opacity-70">
                        Error: {error?.message || 'Data not found'}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold"
                    >
                        กลับไปหน้าเดิม
                    </button>
                </div>
            </div>
        );

    const item = PokeApi.toItem(data.pokemon_v2_item_by_pk);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
            >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-blue-500/50 transition-all">
                    <ChevronLeft size={20} />
                </div>
                <span className="font-bold uppercase tracking-widest text-xs">
                    Back to Pokedex
                </span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left side */}
                <div className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500/10 blur-3xl opacity-50 rounded-full" />
                        <div className="relative po-card p-12 flex flex-col items-center justify-center border-blue-500/20">
                            <div className="p-10 bg-slate-950 rounded-full border border-slate-800 shadow-2xl relative z-10">
                                <ItemImg
                                    item={item}
                                    className="w-32 h-32 object-contain animate-pulse drop-shadow-lg"
                                />
                            </div>
                            <div className="mt-8 text-center">
                                <div className="text-blue-500 font-mono text-sm tracking-widest uppercase mb-1">
                                    {item.name.replace(/-/g, ' ')}
                                </div>
                                <h1 className="text-4xl font-black capitalize text-white">
                                    {item.name.replace(/-/g, ' ')}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="po-card p-6 flex flex-col items-center gap-3">
                        <CircleDollarSign size={32} className="text-cyan-400" />
                        <div className="text-3xl font-black text-white">
                            {item.price === 0
                                ? 'Not for Sale'
                                : `₽${item.price}`}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Market Value
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="space-y-8">
                    <div className="po-card p-8 bg-linear-to-br from-slate-900/80 to-slate-900/40">
                        <div className="flex items-center gap-3 mb-6 text-blue-400">
                            <Info size={20} />
                            <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                                Description
                            </h3>
                        </div>
                        <p className="text-lg text-slate-300 leading-relaxed italic">
                            "{item.desc || 'No flavor text available.'}"
                        </p>
                    </div>

                    <div className="po-card p-8">
                        <div className="flex items-center gap-3 mb-6 text-cyan-400">
                            <Zap size={20} />
                            <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                                Effects
                            </h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
                                    Summary
                                </h4>
                                <p className="text-slate-400 leading-relaxed">
                                    {item.shortEffect ||
                                        'No summary available.'}
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-800">
                                <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
                                    Detailed Mechanism
                                </h4>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {item.effect ||
                                        'No detailed effect information available.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="po-card p-6 border-dashed border-slate-800 bg-transparent flex items-center gap-4">
                        <Box size={24} className="text-slate-600" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                            Official PokéData Item Entry #{item.id}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
