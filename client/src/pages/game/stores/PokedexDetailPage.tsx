//-Path: "PokeRotom/client/src/pages/game/stores/PokedexDetailPage.tsx"
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
import { useParams, useNavigate } from 'react-router-dom';
import { GET_POKEMON_DETAIL } from '../../../graphQL/pokeApi';
import type { PokemonDetailData } from '../../../types/pokeApi';

export default function PokedexDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery<PokemonDetailData>(
        GET_POKEMON_DETAIL,
        {
            variables: { id: Number(id) },
        },
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !data?.pokemon_v2_pokemon_by_pk) {
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
    }

    const pokemon = data.pokemon_v2_pokemon_by_pk;
    const rawSprites = pokemon.pokemon_v2_pokemonsprites[0]?.sprites;
    const sprites =
        typeof rawSprites === 'string' ? JSON.parse(rawSprites) : rawSprites;
    const imageUrl =
        sprites?.other?.['official-artwork']?.front_default ||
        sprites?.front_default ||
        '';

    const getStatIcon = (name: string) => {
        switch (name) {
            case 'hp':
                return <Heart size={16} />;
            case 'attack':
                return <Swords size={16} />;
            case 'defense':
                return <Shield size={16} />;
            case 'special-attack':
                return <Zap size={16} />;
            case 'special-defense':
                return <BrainCircuit size={16} />;
            case 'speed':
                return <Zap size={16} />;
            default:
                return null;
        }
    };

    const getStatColor = (name: string) => {
        switch (name) {
            case 'hp':
                return 'bg-rose-500';
            case 'attack':
                return 'bg-orange-500';
            case 'defense':
                return 'bg-yellow-500';
            case 'special-attack':
                return 'bg-sky-500';
            case 'special-defense':
                return 'bg-emerald-500';
            case 'speed':
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
                        {pokemon.pokemon_v2_pokemontypes?.map((t: any) => (
                            <span
                                key={t.pokemon_v2_type.name}
                                className={`px-6 py-2 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-lg border-b-4 border-black/20 text-white ${t.pokemon_v2_type.name}`}
                                style={{
                                    backgroundColor: `var(--type-${t.pokemon_v2_type.name})`,
                                }}
                            >
                                {t.pokemon_v2_type.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="space-y-8">
                    <div>
                        <span className="text-red-500 font-mono text-sm tracking-widest uppercase">
                            Generation{' '}
                            {pokemon.pokemon_v2_pokemonspecy?.generation_id}
                        </span>
                        <h1 className="text-6xl font-black capitalize text-slate-900 dark:text-white mt-1">
                            {pokemon.name}
                        </h1>
                        <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                            {pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesflavortexts[0]?.flavor_text.replace(
                                /\f/g,
                                ' ',
                            )}
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
                            {pokemon.pokemon_v2_pokemonstats?.map((s: any) => (
                                <div
                                    key={s.pokemon_v2_stat.name}
                                    className="space-y-1.5"
                                >
                                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            {getStatIcon(
                                                s.pokemon_v2_stat.name,
                                            )}
                                            {s.pokemon_v2_stat.name.replace(
                                                '-',
                                                ' ',
                                            )}
                                        </div>
                                        <span className="text-slate-900 dark:text-white">
                                            {s.base_stat}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${getStatColor(s.pokemon_v2_stat.name)}`}
                                            style={{
                                                width: `${Math.min(100, (s.base_stat / 255) * 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
