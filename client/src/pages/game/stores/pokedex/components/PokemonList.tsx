// - Path: "PokeRotom/client/src/pages/game/stores/pokedex/components/PokemonList.tsx"
import { useNavigate } from 'react-router-dom';
import type { Pokemon } from '../../../../../types/pokemon';
import { PokemonImg } from '../../../../../components/Image';

interface PokemonListProps {
    data: Pokemon[];
    viewMode: 'grid' | 'list';
    lastElementRef: (node: HTMLDivElement | null) => void;
}

export default function PokemonList({
    data,
    viewMode,
    lastElementRef,
}: PokemonListProps) {
    const navigate = useNavigate();

    return (
        <div
            className={
                viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
                    : 'space-y-3'
            }
        >
            {data.map((pokemon, index) => {
                const isLast = index === data.length - 1;

                return (
                    <div
                        key={pokemon.id}
                        ref={isLast ? lastElementRef : null}
                        onClick={() =>
                            navigate(`/game/pokedex/pokemon/${pokemon.id}`)
                        }
                        className={
                            viewMode === 'grid'
                                ? 'po-card p-4 flex flex-col items-center group cursor-pointer hover:border-red-500/50 scale-in-center shadow-black/20'
                                : 'flex items-center gap-6 bg-slate-900/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-800 hover:border-red-500/30 transition-all group cursor-pointer'
                        }
                    >
                        <div
                            className={`relative ${
                                viewMode === 'grid'
                                    ? 'w-24 h-24 mb-4'
                                    : 'w-20 h-20 shrink-0'
                            }`}
                        >
                            <div className="absolute inset-0 bg-red-400/10 rounded-full blur-xl group-hover:bg-red-400/20 transition-all" />
                            <PokemonImg
                                pokemon={pokemon}
                                className={`${
                                    viewMode === 'grid'
                                        ? 'w-24 h-24'
                                        : 'w-20 h-20'
                                } relative z-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-110`}
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
                                className={`font-bold capitalize group-hover:text-red-400 transition-colors ${
                                    viewMode === 'grid' ? 'text-sm' : 'text-lg'
                                }`}
                            >
                                {pokemon.name}
                            </h3>
                        </div>
                        {viewMode === 'list' && (
                            <div className="text-slate-700 dark:text-slate-800 text-3xl font-black shrink-0">
                                {String(pokemon.id).padStart(3, '0')}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
