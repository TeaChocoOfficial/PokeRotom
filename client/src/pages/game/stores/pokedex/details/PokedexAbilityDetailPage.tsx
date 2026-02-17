// - Path: "PokeRotom/client/src/pages/game/stores/pokedex/PokedexAbilityDetailPage.tsx"
import { useQuery } from '@apollo/client/react';
import PokeApi from '../../../../../types/pokeApi';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_ABILITY_DETAIL } from '../../../../../graphQL/pokeApi';
import { Star, Info, ChevronLeft, Zap, BookOpen, Search } from 'lucide-react';

export default function PokedexAbilityDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery<PokeApi.AbilityDetailData>(
        GET_ABILITY_DETAIL,
        {
            variables: { id: Number(id) },
        },
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !data?.pokemon_v2_ability_by_pk) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold mb-2">
                        ไม่พบความสามารถนี้...
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

    const ability = data.pokemon_v2_ability_by_pk;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
            >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-purple-500/50 transition-all">
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
                        <div className="absolute inset-0 bg-purple-500/10 blur-3xl opacity-50 rounded-full" />
                        <div className="relative po-card p-12 flex flex-col items-center justify-center border-purple-500/20 shadow-2xl">
                            <div className="p-12 bg-slate-950 rounded-full border border-slate-800 relative z-10">
                                <Star
                                    size={100}
                                    className="text-purple-500 animate-pulse"
                                />
                            </div>
                            <div className="mt-8 text-center">
                                <div className="text-purple-500 font-mono text-sm tracking-widest uppercase mb-1">
                                    Special Passive Ability
                                </div>
                                <h1 className="text-5xl font-black capitalize text-white tracking-tight">
                                    {ability.name.replace(/-/g, ' ')}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="po-card p-8 bg-linear-to-br from-purple-500/10 to-transparent">
                        <div className="flex items-center gap-3 mb-4 text-purple-400">
                            <BookOpen size={20} />
                            <h3 className="font-black uppercase tracking-[0.2em] text-[10px]">
                                Short Summary
                            </h3>
                        </div>
                        <p className="text-lg text-slate-300 font-medium leading-relaxed italic">
                            "
                            {ability.pokemon_v2_abilityflavortexts[0]
                                ?.flavor_text ||
                                'An unusual power with undocumented properties.'}
                            "
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="space-y-8">
                    <div className="po-card p-8 bg-slate-900/50 border-slate-800">
                        <div className="flex items-center gap-3 mb-6 text-purple-500">
                            <Zap size={20} />
                            <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                                Core Mechanics
                            </h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <Info
                                        size={14}
                                        className="text-slate-500"
                                    />
                                    Brief Induction
                                </h4>
                                <p className="text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    {ability.pokemon_v2_abilityeffecttexts[0]
                                        ?.short_effect ||
                                        'No brief summary available.'}
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-800">
                                <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <Search
                                        size={14}
                                        className="text-slate-500"
                                    />
                                    Complex Analysis
                                </h4>
                                <p className="text-slate-500 leading-relaxed text-sm">
                                    {ability.pokemon_v2_abilityeffecttexts[0]
                                        ?.effect ||
                                        'This ability has no detailed mechanism analysis recorded in the PokéData archives.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="po-card p-6 border-dashed border-slate-800 bg-transparent flex items-center gap-4">
                        <Star size={24} className="text-slate-600" />
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                            Official Archive Ability Index #{ability.id}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
