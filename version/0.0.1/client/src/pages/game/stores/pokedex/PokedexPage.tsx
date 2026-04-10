// - Path: "PokeRotom/src/pages/game/stores/pokedex/PokedexPage.tsx"
import {
    Zap,
    Leaf,
    Star,
    List,
    Table,
    Search,
    Filter,
    Package,
    LayoutGrid,
} from 'lucide-react';
import {
    GET_ITEM_LIST,
    GET_TYPE_LIST,
    GET_MOVE_LIST,
    GET_NATURE_LIST,
    GET_ABILITY_LIST,
    GET_POKEMON_LIST,
    GET_ITEM_CATEGORIES,
} from '../../../../graphQL/pokeApi';
import ItemsList from './components/ItemsList';
import MovesList from './components/MovesList';
import PokeApi from '../../../../types/pokeApi';
import { useQuery } from '@apollo/client/react';
import NatureList from './components/NatureList';
import PokemonList from './components/PokemonList';
import AbilitiesList from './components/AbilitiesList';
import TypeChartList from './components/TypeChartList';
import { useRef, useCallback, useState, useEffect } from 'react';

enum TabType {
    Pokemon = 'Pokemon',
    Items = 'Items',
    Moves = 'Moves',
    Abilities = 'Abilities',
    Typechart = 'Typechart',
    Nature = 'Nature',
}

export default function PokedexPage() {
    const limit = 20;
    const [search, setSearch] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [generation, setGeneration] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Item Filters
    const [itemSort, setItemSort] = useState<'id' | 'name'>('id');
    const [itemCategory, setItemCategory] = useState<string>('');

    const [activeTab, setActiveTab] = useState<TabType>(() => {
        const tab = localStorage.getItem('pokedexActiveTab');
        return TabType[tab as keyof typeof TabType] ?? TabType.Pokemon;
    });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setHasMore(true);
        setSearch(''); // Clear search when switching tabs for better UX
    }, [activeTab]);

    // Reset hasMore when filters change
    useEffect(() => {
        setHasMore(true);
    }, [debouncedSearch, generation, itemSort, itemCategory]);

    const where: any = {};
    if (debouncedSearch) {
        if (!isNaN(Number(debouncedSearch)) && activeTab === TabType.Pokemon)
            where.id = { _eq: Number(debouncedSearch) };
        else where.name = { _ilike: `%${debouncedSearch.toLowerCase()}%` };
    }
    if (generation && activeTab === TabType.Pokemon)
        where.pokemon_v2_pokemonspecy = { generation_id: { _eq: generation } };

    // Item specific where clause
    const itemWhere = { ...where };
    if (itemCategory && activeTab === TabType.Items) {
        itemWhere.pokemon_v2_itemcategory = { name: { _eq: itemCategory } };
    }

    const itemOrderBy =
        activeTab === TabType.Items
            ? itemSort === 'name'
                ? { name: 'asc' }
                : { id: 'asc' }
            : { id: 'asc' };

    // Queries
    const pokemonQuery = useQuery<PokeApi.PokemonListData>(GET_POKEMON_LIST, {
        variables: { limit, offset: 0, where },
        skip: activeTab !== TabType.Pokemon,
        notifyOnNetworkStatusChange: true,
    });

    const itemsQuery = useQuery<PokeApi.ItemListData>(GET_ITEM_LIST, {
        variables: {
            limit,
            offset: 0,
            where: itemWhere,
            order_by: itemOrderBy,
        },
        skip: activeTab !== TabType.Items,
        notifyOnNetworkStatusChange: true,
    });

    const itemCategoriesQuery = useQuery<{
        pokemon_v2_itemcategory: { name: string; id: number }[];
    }>(GET_ITEM_CATEGORIES, {
        skip: activeTab !== TabType.Items,
    });

    const movesQuery = useQuery<PokeApi.MoveListData>(GET_MOVE_LIST, {
        variables: { limit, offset: 0, where },
        skip: activeTab !== TabType.Moves,
        notifyOnNetworkStatusChange: true,
    });

    const abilitiesQuery = useQuery<PokeApi.AbilityListData>(GET_ABILITY_LIST, {
        variables: { limit, offset: 0, where },
        skip: activeTab !== TabType.Abilities,
        notifyOnNetworkStatusChange: true,
    });

    const typesQuery = useQuery<PokeApi.TypeListData>(GET_TYPE_LIST, {
        skip: activeTab !== TabType.Typechart,
    });

    const naturesQuery = useQuery<PokeApi.NatureListData>(GET_NATURE_LIST, {
        skip: activeTab !== TabType.Nature,
    });

    const activeQuery =
        activeTab === TabType.Pokemon
            ? pokemonQuery
            : activeTab === TabType.Items
              ? itemsQuery
              : activeTab === TabType.Moves
                ? movesQuery
                : activeTab === TabType.Abilities
                  ? abilitiesQuery
                  : activeTab === TabType.Typechart
                    ? typesQuery
                    : activeTab === TabType.Nature
                      ? naturesQuery
                      : null;

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (!activeQuery || activeQuery.loading || !hasMore) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    const currentData = activeQuery.data as any;
                    const key = Object.keys(currentData || {})[0];
                    const offset = currentData?.[key]?.length || 0;

                    activeQuery
                        .fetchMore({
                            variables: {
                                offset,
                                where:
                                    activeTab === TabType.Items
                                        ? itemWhere
                                        : where,
                                order_by:
                                    activeTab === TabType.Items
                                        ? itemOrderBy
                                        : undefined,
                            },
                            updateQuery: (
                                prev: any,
                                { fetchMoreResult }: any,
                            ) => {
                                if (!fetchMoreResult) return prev;
                                return {
                                    ...prev,
                                    [key]: [
                                        ...prev[key],
                                        ...fetchMoreResult[key],
                                    ],
                                };
                            },
                        })
                        .then((res: any) => {
                            const newKey = Object.keys(res.data || {})[0];
                            if (res.data?.[newKey]?.length < limit)
                                setHasMore(false);
                        });
                }
            });
            if (node) observer.current.observe(node);
        },
        [activeQuery, hasMore, itemWhere, itemOrderBy],
    );

    const tabs: {
        id: TabType;
        label: string;
        icon: any;
        color: string;
        desc: string;
    }[] = [
        {
            id: TabType.Pokemon,
            label: 'Pokémon',
            icon: LayoutGrid,
            color: 'from-red-500 to-orange-500',
            desc: 'รายชื่อโปเกมอนทั้งหมด',
        },
        {
            id: TabType.Items,
            label: 'Items',
            icon: Package,
            color: 'from-blue-500 to-cyan-500',
            desc: 'ข้อมูลไอเทมและอุปกรณ์',
        },
        {
            id: TabType.Moves,
            label: 'Moves',
            icon: Zap,
            color: 'from-yellow-500 to-amber-500',
            desc: 'ท่าต่อสู้และสกิลต่างๆ',
        },
        {
            id: TabType.Abilities,
            label: 'Abilities',
            icon: Star,
            color: 'from-purple-500 to-pink-500',
            desc: 'ความสามารถพิเศษ',
        },
        {
            id: TabType.Typechart,
            label: 'Type Chart',
            icon: Table,
            color: 'from-emerald-500 to-teal-500',
            desc: 'ตารางแพ้ชนะธาตุ',
        },
        {
            id: TabType.Nature,
            label: 'Natures',
            icon: Leaf,
            color: 'from-green-500 to-lime-500',
            desc: 'นิสัยและการปรับค่าพลัง',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-400 to-orange-400 mb-2">
                    📖 PokéData
                </h1>
                <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">
                    {tabs.find((t) => t.id === activeTab)?.desc}
                </p>
            </div>

            {/* Navigation Menu */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            localStorage.setItem('pokedexActiveTab', tab.id);
                        }}
                        className={`group relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                            activeTab === tab.id
                                ? `bg-linear-to-r ${tab.color} text-white shadow-xl shadow-slate-950/20 scale-105`
                                : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                    >
                        <tab.icon
                            size={20}
                            className={
                                activeTab === tab.id
                                    ? 'animate-pulse'
                                    : 'group-hover:scale-110 transition-transform'
                            }
                        />
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute -inset-0.5 bg-linear-to-r from-white/20 to-transparent blur opacity-50 rounded-2xl" />
                        )}
                    </button>
                ))}
            </div>

            {/* Search/Filter Bar for Paginated Tabs */}
            {[
                TabType.Pokemon,
                TabType.Items,
                TabType.Moves,
                TabType.Abilities,
            ].includes(activeTab) && (
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full po-input px-12 py-3 text-white focus:border-red-500"
                        />
                    </div>
                    {activeTab === TabType.Pokemon && (
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
                                    {Array.from(
                                        { length: 9 },
                                        (_, i) => i + 1,
                                    ).map((gen) => (
                                        <option key={gen} value={gen}>
                                            Generation {gen}
                                        </option>
                                    ))}
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
                    )}
                </div>
            )}

            {activeQuery?.error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-2xl text-center mb-8">
                    {activeQuery.error.message}
                </div>
            )}

            {/* Pokemon Tab */}
            {activeTab === TabType.Pokemon && pokemonQuery.data && (
                <PokemonList
                    viewMode={viewMode}
                    lastElementRef={lastElementRef}
                    data={pokemonQuery.data.pokemon_v2_pokemon.map((pokemon) =>
                        PokeApi.toPokemon(pokemon),
                    )}
                />
            )}

            {/* Items Tab */}
            {activeTab === TabType.Items && itemsQuery.data && (
                <ItemsList
                    lastElementRef={lastElementRef}
                    sortBy={itemSort}
                    onSortChange={setItemSort}
                    selectedCategory={itemCategory}
                    onCategoryChange={setItemCategory}
                    data={itemsQuery.data.pokemon_v2_item.map((item) =>
                        PokeApi.toItem(item),
                    )}
                    categories={
                        itemCategoriesQuery?.data?.pokemon_v2_itemcategory?.map(
                            (c) => c.name,
                        ) || []
                    }
                />
            )}

            {/* Moves Tab */}
            {activeTab === TabType.Moves && movesQuery.data && (
                <MovesList
                    lastElementRef={lastElementRef}
                    data={movesQuery.data.pokemon_v2_move.map((move) =>
                        PokeApi.toMove(move),
                    )}
                />
            )}

            {/* Abilities Tab */}
            {activeTab === TabType.Abilities && abilitiesQuery.data && (
                <AbilitiesList
                    lastElementRef={lastElementRef}
                    data={abilitiesQuery.data.pokemon_v2_ability.map(
                        (ability) => PokeApi.toAbility(ability),
                    )}
                />
            )}

            {/* Type Chart Tab */}
            {activeTab === TabType.Typechart && typesQuery.data && (
                <TypeChartList
                    data={typesQuery.data.pokemon_v2_type.map((type) =>
                        PokeApi.toTypeElement(type),
                    )}
                />
            )}

            {/* Nature Tab */}
            {activeTab === TabType.Nature && naturesQuery.data && (
                <NatureList
                    data={naturesQuery.data.pokemon_v2_nature.map((nature) =>
                        PokeApi.toNature(nature),
                    )}
                />
            )}

            {(activeQuery?.loading || pokemonQuery.loading) && hasMore && (
                <div className="flex justify-center items-center h-32 mt-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-red-500" />
                </div>
            )}
        </div>
    );
}
