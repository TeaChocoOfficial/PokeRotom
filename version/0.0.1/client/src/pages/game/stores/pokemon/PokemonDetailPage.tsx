//-Path: "PokeRotom/client/src/pages/game/stores/PokemonDetailPage.tsx"
import { useEffect, useState } from 'react';
import PokeApi from '../../../../types/pokeApi';
import { useQuery } from '@apollo/client/react';
import PkmCalc from '../../../../hooks/pokemonStat';
import PkmStat from '../../../../hooks/pokemonStat';
import { useParams, useNavigate } from 'react-router-dom';
import type { PokemonDB } from '../../../../types/pokemon';
import { GET_POKEMON_DETAIL } from '../../../../graphQL/pokeApi';
import { usePokemonStore } from '../../../../stores/pokemonStore';
import { ArrowLeft, Swords, Activity, Zap, Shield, Heart } from 'lucide-react';

/** คำนวณ max exp ตาม lv */
const getMaxExp = (lv: number): number => lv * lv * 10;

export default function PokemonDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pc, party, pcFetched, fetchPokemons, partyFetched } =
        usePokemonStore();
    const [pokemon, setPokemon] = useState<PokemonDB | null>(null);

    useEffect(() => {
        if (!partyFetched || !pcFetched) fetchPokemons();
    }, []);

    useEffect(() => {
        const all = [...party, ...pc];
        const found = all.find((p) => p._id === id);
        if (found) {
            setPokemon(found);
        }
    }, [id, party, pc]);

    const { data, loading: pokeLoading } = useQuery<PokeApi.PokemonDetailData>(
        GET_POKEMON_DETAIL,
        {
            variables: { id: pokemon?.pkmId },
            skip: !pokemon?.pkmId,
        },
    );

    if (!pokemon || pokeLoading || !data?.pokemon_v2_pokemon_by_pk)
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4" />
                <p className="text-slate-400">Loading Pokemon Details...</p>
            </div>
        );

    const baseStats: PkmStat.STATS_TYPE = (
        data.pokemon_v2_pokemon_by_pk.pokemon_v2_pokemonstats || []
    ).reduce((acc: PkmStat.STATS_TYPE, stat: PokeApi.PokemonStat) => {
        const name = stat.pokemon_v2_stat.name;
        const value = stat.base_stat;
        if (name === PkmStat.STATS_KEYS.HP) acc.hp = value;
        if (name === PkmStat.STATS_KEYS.ATTACK) acc.atk = value;
        if (name === PkmStat.STATS_KEYS.DEFENSE) acc.def = value;
        if (name === PkmStat.STATS_KEYS.SP_ATTACK) acc.spAtk = value;
        if (name === PkmStat.STATS_KEYS.SP_DEFENSE) acc.spDef = value;
        if (name === PkmStat.STATS_KEYS.SPEED) acc.spd = value;
        return acc;
    }, PkmStat.STAT_DEFAULT);

    // Mock stats based on Pokemon (since we don't have stats in schema yet)
    const stats = [
        {
            label: 'HP',
            value: PkmCalc.calculateStat(
                baseStats.hp,
                pokemon.ivs?.hp || 0,
                0,
                pokemon.lv,
                PkmCalc.NATURE_MODIFIERS_KEYS.HARDY,
                PkmCalc.STATS_KEYS.HP,
            ),
            icon: Heart,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
        },
        {
            label: 'Attack',
            value: PkmCalc.calculateStat(
                baseStats.atk,
                pokemon.ivs?.atk,
                0,
                pokemon.lv,
                PkmCalc.NATURE_MODIFIERS_KEYS.HARDY,
                PkmCalc.STATS_KEYS.ATTACK,
            ),
            icon: Swords,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
        },
        {
            label: 'Defense',
            value: PkmCalc.calculateStat(
                baseStats.def,
                pokemon.ivs?.def,
                0,
                pokemon.lv,
                PkmCalc.NATURE_MODIFIERS_KEYS.HARDY,
                PkmCalc.STATS_KEYS.DEFENSE,
            ),
            icon: Shield,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            label: 'Sp. Atk',
            value: PkmCalc.calculateStat(
                baseStats.spAtk,
                pokemon.ivs?.spAtk,
                0,
                pokemon.lv,
                PkmCalc.NATURE_MODIFIERS_KEYS.HARDY,
                PkmCalc.STATS_KEYS.SP_ATTACK,
            ),
            icon: Swords,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
        },
        {
            label: 'Sp. Def',
            value: PkmCalc.calculateStat(
                baseStats.spDef,
                pokemon.ivs?.spDef,
                0,
                pokemon.lv,
                PkmCalc.NATURE_MODIFIERS_KEYS.HARDY,
                PkmCalc.STATS_KEYS.SP_DEFENSE,
            ),
            icon: Shield,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
        {
            label: 'Speed',
            value: PkmCalc.calculateStat(
                baseStats.spd,
                pokemon.ivs?.spd,
                0,
                pokemon.lv,
                PkmCalc.NATURE_MODIFIERS_KEYS.HARDY,
                PkmCalc.STATS_KEYS.SPEED,
            ),
            icon: Zap,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
        },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft
                    size={20}
                    className="group-hover:-translate-x-1 transition-transform"
                />
                <span>Back to Team</span>
            </button>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="relative aspect-square bg-slate-900/50 rounded-[3rem] border border-slate-800 flex items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-b from-yellow-500/10 to-transparent" />
                    <div className="absolute w-[80%] h-[80%] bg-yellow-500/5 rounded-full blur-[80px]" />
                    <img
                        src={pokemon.img}
                        alt={pokemon.name}
                        className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-float"
                    />
                </div>

                <div className="flex flex-col">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-slate-500 font-mono tracking-widest uppercase text-sm">
                                #{String(pokemon.pkmId).padStart(3, '0')}
                            </span>
                            <div className="h-px flex-1 bg-slate-800" />
                        </div>
                        <h1 className="text-5xl font-black text-white capitalize mb-4">
                            {pokemon.nickname || pokemon.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-yellow-500 rounded-2xl flex items-center gap-2 shadow-lg shadow-yellow-500/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-950">
                                    lv
                                </span>
                                <span className="text-xl font-black text-yellow-950">
                                    {pokemon.lv}
                                </span>
                            </div>
                            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        EXP
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">
                                        {pokemon.exp} / {getMaxExp(pokemon.lv)}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-cyan-500 transition-all duration-500"
                                        style={{
                                            width: `${Math.min((pokemon.exp / getMaxExp(pokemon.lv)) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className={`p-4 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}
                                    >
                                        <stat.icon size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-white leading-none">
                                        {stat.value}
                                    </span>
                                    <div className="flex-1 h-1 bg-slate-800 rounded-full mb-1">
                                        <div
                                            className={`h-full ${stat.color.replace('text', 'bg')} rounded-full`}
                                            style={{
                                                width: `${(stat.value / 150) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-slate-900/40 rounded-4xl border border-slate-800">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity size={16} className="text-cyan-500" />
                            Individual Values (IVs)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                            {[
                                {
                                    label: 'HP',
                                    value: pokemon.ivs?.hp || 0,
                                    color: 'from-red-500 to-red-600',
                                },
                                {
                                    label: 'ATK',
                                    value: pokemon.ivs?.atk || 0,
                                    color: 'from-orange-500 to-orange-600',
                                },
                                {
                                    label: 'DEF',
                                    value: pokemon.ivs?.def || 0,
                                    color: 'from-blue-500 to-blue-600',
                                },
                                {
                                    label: 'SPA',
                                    value: pokemon.ivs?.spAtk || 0,
                                    color: 'from-purple-500 to-purple-600',
                                },
                                {
                                    label: 'SPD',
                                    value: pokemon.ivs?.spDef || 0,
                                    color: 'from-green-500 to-green-600',
                                },
                                {
                                    label: 'SPE',
                                    value: pokemon.ivs?.spd || 0,
                                    color: 'from-pink-500 to-pink-600',
                                },
                            ].map((iv) => (
                                <div key={iv.label}>
                                    <div className="flex justify-between items-center mb-1.5 px-1">
                                        <span className="text-[10px] font-black text-slate-500 tracking-tighter">
                                            {iv.label}
                                        </span>
                                        <span
                                            className={`text-sm font-black ${iv.value >= 30 ? 'text-yellow-400 animate-pulse' : 'text-white'}`}
                                        >
                                            {iv.value}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden p-px">
                                        <div
                                            className={`h-full bg-linear-to-r ${iv.color} rounded-full transition-all duration-1000`}
                                            style={{
                                                width: `${(iv.value / 31) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-slate-900/40 rounded-4xl border border-slate-800">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-cyan-500" />
                            General Information
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                                    Caught date
                                </p>
                                <p className="text-sm font-bold text-slate-300">
                                    {new Date(
                                        pokemon.createdAt,
                                    ).toLocaleDateString('th-TH', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
