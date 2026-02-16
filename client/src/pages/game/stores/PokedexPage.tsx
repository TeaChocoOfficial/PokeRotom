//-Path: "PokeRotom/client/src/pages/PokedexPage.tsx"
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_POKEMON_LIST } from '../../../graphQL/pokeApi';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { useRef, useCallback, useState, useEffect } from 'react';
import type { PokemonListData, Pokemon } from '../../../types/pokeApi';

export default function PokedexPage() {
    const limit = 20;
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [generation, setGeneration] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset hasMore when filters change
    useEffect(() => {
        setHasMore(true);
    }, [debouncedSearch, generation]);

    const where: any = {};
    if (debouncedSearch) {
        if (!isNaN(Number(debouncedSearch)))
            where.id = { _eq: Number(debouncedSearch) };
        else where.name = { _ilike: `%${debouncedSearch.toLowerCase()}%` };
    }
    if (generation)
        where.pokemon_v2_pokemonspecy = { generation_id: { _eq: generation } };

    const { data, loading, error, fetchMore } = useQuery<PokemonListData>(
        GET_POKEMON_LIST,
        {
            variables: { limit, offset: 0, where },
            notifyOnNetworkStatusChange: true,
        },
    );

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading || !hasMore) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchMore({
                        variables: {
                            offset: data?.pokemon_v2_pokemon.length || 0,
                        },
                        updateQuery: (
                            prevResult: PokemonListData,
                            {
                                fetchMoreResult,
                            }: { fetchMoreResult?: PokemonListData },
                        ) => {
                            if (!fetchMoreResult) return prevResult;
                            return {
                                ...prevResult,
                                pokemon_v2_pokemon: [
                                    ...prevResult.pokemon_v2_pokemon,
                                    ...fetchMoreResult.pokemon_v2_pokemon,
                                ],
                            };
                        },
                    }).then((res) => {
                        if (
                            res.data &&
                            res.data.pokemon_v2_pokemon.length < limit
                        ) {
                            setHasMore(false);
                        }
                    });
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, data, fetchMore, hasMore],
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-400 to-orange-400 mb-2">
                    📖 Pokédex
                </h1>
                <p className="text-slate-400">สมุดข้อมูลโปเกมอนทั้งหมด</p>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl text-center mb-8">
                    Error: {error.message}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search Pokémon by name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <select
                            value={generation || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setGeneration(val ? Number(val) : null);
                            }}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-10 py-3 text-white focus:border-red-500 focus:outline-none appearance-none cursor-pointer transition-colors"
                        >
                            <option value="">All Generations</option>
                            {Array.from({ length: 9 }, (_, i) => i + 1).map(
                                (gen) => (
                                    <option key={gen} value={gen}>
                                        Generation {gen}
                                    </option>
                                ),
                            )}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 pointer-events-none" />
                    </div>

                    <div className="flex gap-1 p-1 bg-slate-900/50 border border-slate-700 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
                        : 'space-y-3'
                }
            >
                {data?.pokemon_v2_pokemon.map(
                    (pokemon: Pokemon, index: number) => {
                        const rawSprites =
                            pokemon.pokemon_v2_pokemonsprites[0]?.sprites;
                        const sprites =
                            typeof rawSprites === 'string'
                                ? JSON.parse(rawSprites)
                                : rawSprites;
                        const imageUrl = sprites?.front_default || '';

                        // Attach ref to the last element
                        const isLastElement =
                            index === data.pokemon_v2_pokemon.length - 1;

                        return (
                            <div
                                key={pokemon.id}
                                ref={isLastElement ? lastElementRef : null}
                                onClick={() =>
                                    navigate(`/game/pokedex/${pokemon.id}`)
                                }
                                className={
                                    viewMode === 'grid'
                                        ? 'po-card p-4 flex flex-col items-center group cursor-pointer hover:border-red-500/50 scale-in-center shadow-black/20'
                                        : 'flex items-center gap-6 bg-slate-900/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-800 hover:border-red-500/30 transition-all group cursor-pointer'
                                }
                            >
                                <div
                                    className={`relative ${viewMode === 'grid' ? 'w-24 h-24 mb-4' : 'w-20 h-20 shrink-0'}`}
                                >
                                    <div className="absolute inset-0 bg-red-400/10 rounded-full blur-xl group-hover:bg-red-400/20 transition-all" />
                                    <img
                                        src={imageUrl}
                                        alt={pokemon.name}
                                        className={`${viewMode === 'grid' ? 'w-24 h-24' : 'w-20 h-20'} relative z-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-110`}
                                        loading="lazy"
                                    />
                                </div>
                                <div
                                    className={
                                        viewMode === 'grid'
                                            ? 'text-center w-full'
                                            : 'flex-1'
                                    }
                                >
                                    <span className="text-slate-600 text-xs font-mono">
                                        #{String(pokemon.id).padStart(3, '0')}
                                    </span>
                                    <h3
                                        className={`font-bold capitalize group-hover:text-red-400 transition-colors ${viewMode === 'grid' ? 'text-sm' : 'text-lg'}`}
                                    >
                                        {pokemon.name}
                                    </h3>
                                    {viewMode === 'list' && (
                                        <div className="flex gap-4 mt-1 text-xs text-slate-500">
                                            <span>
                                                Height: {pokemon.height / 10}m
                                            </span>
                                            <span>
                                                Weight: {pokemon.weight / 10}kg
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {viewMode === 'list' && (
                                    <div className="text-slate-700 dark:text-slate-800 text-3xl font-black shrink-0">
                                        {String(pokemon.id).padStart(3, '0')}
                                    </div>
                                )}
                            </div>
                        );
                    },
                )}
            </div>

            {loading && hasMore && (
                <div className="flex justify-center items-center h-32 mt-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-red-500" />
                </div>
            )}
        </div>
    );
}
