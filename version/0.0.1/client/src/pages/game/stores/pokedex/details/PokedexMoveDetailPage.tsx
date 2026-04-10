// - Path: "PokeRotom/client/src/pages/game/stores/pokedex/PokedexMoveDetailPage.tsx"
import {
    Info,
    ChevronLeft,
    Swords,
    Target,
    Activity,
    BookOpen,
    Layers,
} from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import PokeApi from '../../../../../types/pokeApi';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_MOVE_DETAIL } from '../../../../../graphQL/pokeApi';

export default function PokedexMoveDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery<PokeApi.MoveDetailData>(
        GET_MOVE_DETAIL,
        {
            variables: { id: Number(id) },
        },
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !data?.pokemon_v2_move_by_pk) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold mb-2">
                        ไม่พบลิสต์รายชื่อท่านี้...
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
    }

    const move = data.pokemon_v2_move_by_pk;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
            >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-yellow-500/50 transition-all">
                    <ChevronLeft size={20} />
                </div>
                <span className="font-bold uppercase tracking-widest text-xs">
                    Back to Pokedex
                </span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left side: Visual & Core Stats */}
                <div className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-yellow-500/10 blur-3xl opacity-50 rounded-full" />
                        <div className="relative po-card p-12 flex flex-col items-center justify-center border-yellow-500/20 shadow-2xl">
                            <div className="p-10 bg-slate-950 rounded-full border border-slate-800 relative z-10">
                                <Activity
                                    size={100}
                                    className="text-yellow-500 animate-pulse"
                                />
                            </div>
                            <div className="mt-8 text-center">
                                <div className="flex justify-center gap-2 mb-2">
                                    <span
                                        className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white ${move.pokemon_v2_type.name}`}
                                        style={{
                                            backgroundColor: `var(--type-${move.pokemon_v2_type.name})`,
                                        }}
                                    >
                                        {move.pokemon_v2_type.name}
                                    </span>
                                    <span className="px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-700">
                                        {move.pokemon_v2_movedamageclass?.name}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-black capitalize text-white">
                                    {move.name.replace(/-/g, ' ')}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="po-card p-5 flex flex-col items-center gap-2 bg-linear-to-b from-slate-900 to-slate-950">
                            <Swords size={20} className="text-orange-500" />
                            <span className="text-2xl font-black text-white">
                                {move.power || '—'}
                            </span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Power
                            </p>
                        </div>
                        <div className="po-card p-5 flex flex-col items-center gap-2 bg-linear-to-b from-slate-900 to-slate-950">
                            <Target size={20} className="text-blue-400" />
                            <span className="text-2xl font-black text-white">
                                {move.accuracy || '—'}%
                            </span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Accuracy
                            </p>
                        </div>
                        <div className="po-card p-5 flex flex-col items-center gap-2 bg-linear-to-b from-slate-900 to-slate-950">
                            <Activity size={20} className="text-purple-400" />
                            <span className="text-2xl font-black text-white">
                                {move.pp}
                            </span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                PP
                            </p>
                        </div>
                    </div>

                    <div className="po-card p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Layers size={18} className="text-green-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Priority
                            </span>
                        </div>
                        <span
                            className={`font-mono font-black ${move.priority > 0 ? 'text-green-500' : move.priority < 0 ? 'text-red-500' : 'text-slate-500'}`}
                        >
                            {move.priority > 0
                                ? `+${move.priority}`
                                : move.priority}
                        </span>
                    </div>
                </div>

                {/* Right side: Lore & Methods */}
                <div className="space-y-8">
                    <div className="po-card p-8 bg-linear-to-br from-slate-900 to-slate-950 border-yellow-500/10">
                        <div className="flex items-center gap-3 mb-6 text-yellow-500">
                            <BookOpen size={20} />
                            <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                                Pokedex Entry
                            </h3>
                        </div>
                        <p className="text-lg text-slate-300 leading-relaxed italic">
                            "
                            {move.pokemon_v2_moveflavortexts[0]?.flavor_text ||
                                'No description available in current records.'}
                            "
                        </p>
                    </div>

                    <div className="po-card p-8">
                        <div className="flex items-center gap-3 mb-6 text-slate-400">
                            <Activity size={20} />
                            <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                                Learn Methods
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {move.pokemon_v2_movelearnmethods
                                ?.slice(0, 10)
                                .map((m: any, idx: number) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 capitalize hover:border-yellow-500/30 transition-colors"
                                    >
                                        {m.pokemon_v2_movelearnmethod.name.replace(
                                            /-/g,
                                            ' ',
                                        )}
                                    </span>
                                ))}
                        </div>
                    </div>

                    <div className="po-card p-6 border-dashed border-slate-800 bg-transparent flex items-center gap-4">
                        <Info size={24} className="text-slate-600" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                            Official Archive Move Entry #{move.id}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
