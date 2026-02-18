//-Path: "PokeRotom/client/src/pages/game/stores/pokedex/details/PokedexPkmDetailPage.tsx"
import {
    Zap,
    Star,
    Scale,
    Ruler,
    Heart,
    Shield,
    Swords,
    Globe2,
    Sparkles,
    ArrowRight,
    ChevronLeft,
    BrainCircuit,
} from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import PokeApi from '../../../../../types/pokeApi';
import PkmStat from '../../../../../hooks/pokemonStat';
import { useParams, useNavigate } from 'react-router-dom';
import TypeComponent from '../../../../../components/TypeCompoent';
import { GET_POKEMON_DETAIL } from '../../../../../graphQL/pokeApi';

/** แปลงชื่อภาษาจาก API เป็นชื่อที่อ่านง่าย */
const LANGUAGE_LABELS: Record<string, string> = {
    ja: '🇯🇵 Japanese',
    ko: '🇰🇷 Korean',
    zh: '🇨🇳 Chinese',
    fr: '🇫🇷 French',
    de: '🇩🇪 German',
    es: '🇪🇸 Spanish',
    it: '🇮🇹 Italian',
    en: '🇺🇸 English',
    'ja-Hrkt': '🇯🇵 Kana',
    roomaji: '🇯🇵 Romaji',
    'zh-Hant': '🇹🇼 Chinese (Trad.)',
    'zh-Hans': '🇨🇳 Chinese (Simp.)',
};

/** แปลง trigger ของ evolution ให้อ่านง่าย */
const getEvolutionTriggerLabel = (
    trigger: string,
    minLevel: number | null,
    item: string | null,
): string => {
    if (trigger === 'level-up' && minLevel) return `Lv. ${minLevel}`;
    if (trigger === 'use-item' && item) return item.replace(/-/g, ' ');
    if (trigger === 'trade') return 'Trade';
    if (trigger === 'level-up') return 'Level Up';
    return trigger.replace(/-/g, ' ');
};

export default function PokedexPkmDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [moveFilter, setMoveFilter] = useState<
        'all' | 'level-up' | 'machine' | 'egg' | 'tutor'
    >('all');

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

    const filteredMoves = (
        moveFilter === 'all'
            ? pokemon.moves
            : pokemon.moves.filter((move) => move.method === moveFilter)
    ).sort((a, b) => a.level - b.level);

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
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
            >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-red-500/50 transition-all">
                    <ChevronLeft size={20} />
                </div>
                <span className="font-bold uppercase tracking-widest text-xs">
                    Back to Pokedex
                </span>
            </button>

            {/* ===== Header Section ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left: Image */}
                <div className="relative group">
                    <div className="absolute inset-x-0 bottom-0 top-1/4 bg-linear-to-b from-red-500/20 to-transparent blur-3xl opacity-50 rounded-full" />
                    <div className="relative po-card p-12 flex items-center justify-center overflow-hidden border-red-500/20">
                        <div className="absolute top-4 right-4 text-6xl font-black text-slate-900/50 dark:text-white/5 tracking-tighter select-none">
                            #{String(pokemon.id).padStart(3, '0')}
                        </div>
                        <img
                            src={pokemon.img || ''}
                            alt={pokemon.name}
                            className="w-full max-w-[400px] h-auto object-contain relative z-10 drop-shadow-2xl animate-float"
                        />
                    </div>

                    {/* Types */}
                    <div className="flex gap-3 justify-center mt-6">
                        {pokemon.types?.map((type) => (
                            <TypeComponent key={type} type={type} />
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="space-y-8">
                    <div>
                        <span className="text-red-500 font-mono text-sm tracking-widest uppercase">
                            Generation {pokemon.generationId}
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

                    {/* Base Stats */}
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

            {/* ===== Multi-Language Names ===== */}
            {pokemon.speciesNames.length > 0 && (
                <div className="po-card p-8 space-y-6">
                    <div className="flex items-center gap-3 text-amber-500 border-b border-slate-800 pb-4">
                        <Globe2 size={20} />
                        <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                            ชื่อในภาษาต่างๆ
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {pokemon.speciesNames
                            .filter(
                                (entry) =>
                                    LANGUAGE_LABELS[entry.language] !==
                                    undefined,
                            )
                            .map((entry) => (
                                <div
                                    key={entry.language}
                                    className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all group"
                                >
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-amber-500 transition-colors mb-1">
                                        {LANGUAGE_LABELS[entry.language] ??
                                            entry.language}
                                    </p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">
                                        {entry.name}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* ===== Abilities ===== */}
            <div className="po-card p-8 space-y-6">
                <div className="flex items-center gap-3 text-purple-500 border-b border-slate-800 pb-4">
                    <Sparkles size={20} />
                    <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                        ความสามารถ (Abilities)
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pokemon.abilities.map((ability) => (
                        <div
                            key={ability.name}
                            className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${
                                ability.isHidden
                                    ? 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500/50'
                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-600'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Star
                                    size={14}
                                    className={
                                        ability.isHidden
                                            ? 'text-purple-500'
                                            : 'text-slate-400'
                                    }
                                />
                                <span className="font-black capitalize text-slate-900 dark:text-white">
                                    {ability.name.replace(/-/g, ' ')}
                                </span>
                                {ability.isHidden && (
                                    <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-400 rounded-lg">
                                        Hidden
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {ability.desc || 'No description available.'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== Type Weaknesses ===== */}
            {pokemon.weaknesses.length > 0 && (
                <div className="po-card p-8 space-y-6">
                    <div className="flex items-center gap-3 text-red-500 border-b border-slate-800 pb-4">
                        <Shield size={20} />
                        <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                            จุดอ่อน (Weak Against)
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {pokemon.weaknesses.map((weakness) => (
                            <TypeComponent key={weakness} type={weakness} />
                        ))}
                    </div>
                </div>
            )}

            {/* ===== Evolution Chain ===== */}
            {pokemon.evolutionChain.length > 1 && (
                <div className="po-card p-8 space-y-6">
                    <div className="flex items-center gap-3 text-emerald-500 border-b border-slate-800 pb-4">
                        <ArrowRight size={20} />
                        <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                            สายพัฒนาร่าง (Evolution Chain)
                        </h3>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {pokemon.evolutionChain.map((evo, index) => (
                            <div
                                key={evo.id}
                                className="flex items-center gap-4"
                            >
                                {index > 0 && (
                                    <div className="flex flex-col items-center gap-1 px-2">
                                        <ArrowRight
                                            size={24}
                                            className="text-emerald-500"
                                        />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center max-w-[80px]">
                                            {getEvolutionTriggerLabel(
                                                evo.trigger,
                                                evo.minLevel,
                                                evo.item,
                                            )}
                                        </span>
                                    </div>
                                )}
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/game/pokedex/pokemon/${evo.id}`,
                                        )
                                    }
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105 cursor-pointer ${
                                        evo.id === pokemon.id
                                            ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-500/30'
                                    }`}
                                >
                                    {evo.img && (
                                        <img
                                            src={evo.img}
                                            alt={evo.name}
                                            className="w-20 h-20 object-contain drop-shadow-lg"
                                        />
                                    )}
                                    <span className="text-xs font-black capitalize text-slate-900 dark:text-white">
                                        {evo.name}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-500">
                                        #{String(evo.id).padStart(3, '0')}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== Moves ===== */}
            <div className="po-card p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3 text-sky-500">
                        <Swords size={20} />
                        <h3 className="font-black uppercase tracking-[0.2em] text-xs">
                            ท่าต่อสู้ (Moves) — {filteredMoves.length} ท่า
                        </h3>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {(
                            [
                                { key: 'all', label: 'ทั้งหมด' },
                                { key: 'level-up', label: 'Level Up' },
                                { key: 'machine', label: 'TM/HM' },
                                { key: 'egg', label: 'Egg' },
                                { key: 'tutor', label: 'Tutor' },
                            ] as const
                        ).map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setMoveFilter(filter.key)}
                                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                                    moveFilter === filter.key
                                        ? 'bg-sky-500 text-white border-sky-500'
                                        : 'bg-transparent text-slate-500 border-slate-700 hover:border-sky-500/30'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">
                                <th className="text-left py-3 px-2">Lv.</th>
                                <th className="text-left py-3 px-2">Move</th>
                                <th className="text-left py-3 px-2">Type</th>
                                <th className="text-center py-3 px-2">Class</th>
                                <th className="text-right py-3 px-2">Pwr</th>
                                <th className="text-right py-3 px-2">Acc</th>
                                <th className="text-right py-3 px-2">PP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMoves.map((entry, index) => (
                                <tr
                                    key={`${entry.move.id}-${index}`}
                                    onClick={() =>
                                        navigate(
                                            `/game/pokedex/move/${entry.move.id}`,
                                        )
                                    }
                                    className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                                >
                                    <td className="py-3 px-2 font-mono text-slate-500">
                                        {entry.level > 0 ? entry.level : '—'}
                                    </td>
                                    <td className="py-3 px-2 font-bold capitalize text-slate-900 dark:text-white">
                                        {entry.move.name.replace(/-/g, ' ')}
                                    </td>
                                    <td className="py-3 px-2">
                                        <span
                                            className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white"
                                            style={{
                                                backgroundColor: `var(--type-${entry.move.type})`,
                                            }}
                                        >
                                            {entry.move.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        {entry.move.damageClass}
                                    </td>
                                    <td className="py-3 px-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                                        {entry.move.power || '—'}
                                    </td>
                                    <td className="py-3 px-2 text-right font-mono text-slate-500">
                                        {entry.move.accuracy
                                            ? `${entry.move.accuracy}%`
                                            : '—'}
                                    </td>
                                    <td className="py-3 px-2 text-right font-mono text-slate-500">
                                        {entry.move.pp}
                                    </td>
                                </tr>
                            ))}
                            {filteredMoves.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center text-slate-500 text-sm"
                                    >
                                        ไม่พบท่าต่อสู้ในหมวดนี้
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
