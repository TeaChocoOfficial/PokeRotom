//-Path: "PokeRotom/client/src/pages/game/stores/PokedexPkmDetailPage.tsx"
import {
    Zap,
    Scale,
    Ruler,
    Heart,
    Shield,
    Swords,
    ChevronLeft,
    BrainCircuit,
} from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import PokeApi from '../../../../../types/pokeApi';
import PkmStat from '../../../../../hooks/pokemonStat';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_POKEMON_DETAIL } from '../../../../../graphQL/pokeApi';

export default function PokedexPkmDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery<PokeApi.PokemonDetailData>(
        GET_POKEMON_DETAIL,
        {
            variables: { id: Number(id) },
        },
    );

    if (loading)
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-600 rounded-full animate-spin" />
            </div>
        );

    if (error || !data?.pokemon_v2_pokemon_by_pk)
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold mb-2">
                        เค้าไม่พบโปเกมอนตัวนี้...
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

    const pokemon = PokeApi.toPokemonDetail(data.pokemon_v2_pokemon_by_pk);
    const imageUrl =
        pokemon.sprites?.other?.['official-artwork']?.front_default ?? '';

    const getStatIcon = (name: PkmStat.STATS_KEYS) => {
        switch (name) {
            case PkmStat.STATS_KEYS.HP:
                return <Heart size={16} />;
            case PkmStat.STATS_KEYS.ATTACK:
                return <Swords size={16} />;
            case PkmStat.STATS_KEYS.DEFENSE:
                return <Shield size={16} />;
            case PkmStat.STATS_KEYS.SP_ATTACK:
                return <Zap size={16} />;
            case PkmStat.STATS_KEYS.SP_DEFENSE:
                return <BrainCircuit size={16} />;
            case PkmStat.STATS_KEYS.SPEED:
                return <Zap size={16} />;
            default:
                return null;
        }
    };

    const getStatColor = (name: PkmStat.STATS_KEYS) => {
        switch (name) {
            case PkmStat.STATS_KEYS.HP:
                return 'bg-rose-500';
            case PkmStat.STATS_KEYS.ATTACK:
                return 'bg-orange-500';
            case PkmStat.STATS_KEYS.DEFENSE:
                return 'bg-yellow-500';
            case PkmStat.STATS_KEYS.SP_ATTACK:
                return 'bg-sky-500';
            case PkmStat.STATS_KEYS.SP_DEFENSE:
                return 'bg-emerald-500';
            case PkmStat.STATS_KEYS.SPEED:
                return 'bg-pink-500';
            default:
                return 'bg-slate-500';
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
            >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-red-500/50 transition-all">
                    <ChevronLeft size={20} />
                </div>
                <span className="font-bold uppercase tracking-widest text-xs">
                    Back to Pokedex
                </span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left: Visuals */}
                <div className="relative group">
                    <div className="absolute inset-x-0 bottom-0 top-1/4 bg-linear-to-b from-red-500/20 to-transparent blur-3xl opacity-50 rounded-full" />
                    <div className="relative po-card p-12 flex items-center justify-center overflow-hidden border-red-500/20">
                        <div className="absolute top-4 right-4 text-6xl font-black text-slate-900/50 dark:text-white/5 tracking-tighter select-none">
                            #{String(pokemon.id).padStart(3, '0')}
                        </div>
                        <img
                            src={imageUrl}
                            alt={pokemon.name}
                            className="w-full max-w-[400px] h-auto object-contain relative z-10 drop-shadow-2xl animate-float"
                        />
                    </div>

                    {/* Types */}
                    <div className="flex gap-3 justify-center mt-6">
                        {pokemon.types?.map((type) => (
                            <span
                                key={type}
                                className={`px-6 py-2 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-lg border-b-4 border-black/20 text-white ${type}`}
                                style={{
                                    backgroundColor: `var(--type-${type})`,
                                }}
                            >
                                {type}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="space-y-8">
                    <div>
                        <span className="text-red-500 font-mono text-sm tracking-widest uppercase">
                            Generation {pokemon.species}
                        </span>
                        <h1 className="text-6xl font-black capitalize text-slate-900 dark:text-white mt-1">
                            {pokemon.name}
                        </h1>
                        <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                            {pokemon.species?.replace(/\f/g, ' ')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="po-card p-6 flex flex-col items-center gap-2">
                            <Scale className="text-slate-400" size={20} />
                            <span className="text-2xl font-black">
                                {pokemon.weight / 10} kg
                            </span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Weight
                            </p>
                        </div>
                        <div className="po-card p-6 flex flex-col items-center gap-2">
                            <Ruler className="text-slate-400" size={20} />
                            <span className="text-2xl font-black">
                                {pokemon.height / 10} m
                            </span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Height
                            </p>
                        </div>
                    </div>

                    <div className="po-card p-8 space-y-6">
                        <h3 className="font-black uppercase tracking-widest text-xs text-slate-500 border-b border-slate-800 pb-4">
                            Base Stats
                        </h3>
                        <div className="space-y-4">
                            {Object.keys(pokemon.stats ?? {}).map((stat) => {
                                const key = stat as PkmStat.STATS_KEYS;
                                const statValue = pokemon.stats?.[key] ?? 0;
                                return (
                                    <div key={key} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                {getStatIcon(key)}
                                                {key.replace('-', ' ')}
                                            </div>
                                            <span className="text-slate-900 dark:text-white">
                                                {statValue}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${getStatColor(key)}`}
                                                style={{
                                                    width: `${Math.min(100, (statValue / 255) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
