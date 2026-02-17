//-Path: "PokeRotom/client/src/pages/game/stores/PCPage.tsx"
import 'allotment/dist/style.css';
import { Allotment } from 'allotment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pokemonAPI } from '../../../../api/pokemonApi';
import type { PokemonDB } from '../../../../types/pokemon';
import { usePokemonStore } from '../../../../stores/pokemonStore';
import { Info, Swords, Trash2, Monitor, ArrowLeftRight } from 'lucide-react';

/** คำนวณ max exp ตาม level (สูตรเดียวกับ server) */
const getMaxExp = (level: number): number => level * level * 10;

export default function PCPage() {
    const {
        pc,
        party,
        pcFetched,
        partyFetched,
        fetchPokemons,
        updatePokemonStatus,
    } = usePokemonStore();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPokemons();
    }, []);

    const handleToggleParty = async (pokemon: PokemonDB, toParty: boolean) => {
        setError('');
        if (toParty && party.length >= 6)
            return setError('ทีมของคุณเต็มแล้ว! (สูงสุด 6 ตัว)');

        // Optimistic Update
        const originalPc = [...pc];
        const originalParty = [...party];
        updatePokemonStatus(pokemon._id, toParty);

        try {
            await pokemonAPI.updatePokemonsStatus(pokemon._id, toParty);
        } catch (catchError: any) {
            setError(catchError.response?.data?.message || 'การย้ายล้มเหลว');
            // Rollback
            usePokemonStore.setState({ pc: originalPc, party: originalParty });
        }
    };

    const handleRelease = async (pokemon: PokemonDB) => {
        setError('');
        if (
            !confirm(
                `ต้องการปล่อย ${pokemon.nickname || pokemon.name} คืนสู่ธรรมชาติหรือไม่?`,
            )
        )
            return;

        try {
            await pokemonAPI.release(pokemon._id);
            fetchPokemons();
        } catch (catchError: any) {
            setError(catchError.response?.data?.message || 'ไม่สามารถปล่อยได้');
        }
    };

    const handleDragStart = (event: React.DragEvent, pokemon: PokemonDB) => {
        event.dataTransfer.setData('pokemonId', pokemon._id);
        event.dataTransfer.setData('isInParty', pokemon.isInParty.toString());
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (event: React.DragEvent, targetIsParty: boolean) => {
        event.preventDefault();
        const all = [...pc, ...party];
        const pokemonId = event.dataTransfer.getData('pokemonId');
        const pokemon = all.find(
            (pokemonItem) => pokemonItem._id === pokemonId,
        );
        const sourceIsParty =
            event.dataTransfer.getData('isInParty') === 'true';

        if (sourceIsParty === targetIsParty) return;

        if (pokemon) handleToggleParty(pokemon, targetIsParty);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    if (!pcFetched || !partyFetched) {
        return (
            <div className="max-w-[1600px] mx-auto px-4 py-8 h-[calc(100vh-100px)] flex items-center justify-center">
                <div className="po-card p-10 flex flex-col items-center gap-4 animate-scale-up">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-500">
                        Accessing PC...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-600 flex items-center gap-3">
                        <Monitor className="text-cyan-500" size={32} />
                        PC Storage
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        จัดการทีมและคลังโปเกมอนของคุณ (ลากวางเพื่อย้ายได้!)
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="po-card px-6 py-3 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                            Storage:
                        </span>
                        <span className="text-xl font-black text-slate-900 dark:text-white">
                            {pc.length}
                        </span>
                    </div>
                    <div className="po-card px-6 py-3 flex items-center gap-3">
                        <div
                            className={`w-2 h-2 rounded-full ${party.length >= 6 ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`}
                        />
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                            Team:
                        </span>
                        <span
                            className={`text-xl font-black ${party.length >= 6 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}
                        >
                            {party.length}/6
                        </span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-2xl flex items-center gap-3 animate-bounce-in shrink-0">
                    <Info size={18} />
                    <span className="font-bold text-sm">{error}</span>
                </div>
            )}

            <div className="flex-1 min-h-0 bg-slate-900/30 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl overflow-hidden shadow-2xl">
                <Allotment>
                    <Allotment.Pane preferredSize="300px">
                        <div
                            className="h-full flex flex-col p-6 bg-slate-900/40"
                            onDrop={(event) => handleDrop(event, true)}
                            onDragOver={handleDragOver}
                        >
                            <div className="flex items-center gap-2 mb-6 px-2">
                                <Swords className="text-yellow-500" size={20} />
                                <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xl">
                                    Your Team
                                </h2>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                                {party.map((pokemon) => (
                                    <div
                                        key={pokemon._id}
                                        draggable
                                        onDragStart={(event) =>
                                            handleDragStart(event, pokemon)
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/game/pokemon/${pokemon._id}`,
                                            )
                                        }
                                        className="po-card p-4 group hover:border-yellow-500/50 transition-all flex items-center gap-4 relative overflow-hidden bg-slate-800/40 backdrop-blur-md cursor-grab active:cursor-grabbing"
                                    >
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center border border-slate-700 shrink-0">
                                            <img
                                                src={pokemon.img}
                                                alt={pokemon.name}
                                                className="w-14 h-14 object-contain drop-shadow-md group-hover:scale-110 transition-transform pointer-events-none"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 pointer-events-none">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 dark:text-white truncate capitalize">
                                                    {pokemon.nickname ||
                                                        pokemon.name}
                                                </h3>
                                                <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-md shrink-0">
                                                    lv{pokemon.lv}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-mono text-slate-500 tracking-tighter">
                                                #
                                                {String(pokemon.pkmId).padStart(
                                                    3,
                                                    '0',
                                                )}
                                            </p>
                                            <div className="mt-1 flex items-center gap-1.5">
                                                <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-linear-to-r from-cyan-400 to-blue-500 rounded-full transition-all"
                                                        style={{
                                                            width: `${Math.min((pokemon.exp / getMaxExp(pokemon.lv)) * 100, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-[8px] font-mono text-slate-500 shrink-0">
                                                    {pokemon.exp}/
                                                    {getMaxExp(pokemon.lv)}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleToggleParty(
                                                    pokemon,
                                                    false,
                                                );
                                            }}
                                            className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all active:scale-95 z-10"
                                            title="Move to PC"
                                        >
                                            <ArrowLeftRight size={18} />
                                        </button>
                                    </div>
                                ))}
                                {[...Array(6 - party.length)].map(
                                    (_, index) => (
                                        <div
                                            key={`empty-${index}`}
                                            className="po-card p-4 border-dashed border-slate-800 bg-transparent opacity-20 flex items-center justify-center h-[96px] rounded-3xl"
                                        >
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                                Empty Slot
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </Allotment.Pane>

                    <Allotment.Pane>
                        <div
                            className="h-full flex flex-col p-6"
                            onDrop={(event) => handleDrop(event, false)}
                            onDragOver={handleDragOver}
                        >
                            <div className="flex items-center gap-2 mb-6 px-2">
                                <Monitor className="text-cyan-500" size={20} />
                                <h2 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xl">
                                    PC Storage
                                </h2>
                            </div>
                            <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4">
                                    {pc.map((pokemon) => (
                                        <div
                                            key={`list-${pokemon._id}`}
                                            draggable
                                            onDragStart={(event) =>
                                                handleDragStart(event, pokemon)
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/game/pokemon/${pokemon._id}`,
                                                )
                                            }
                                            className="po-card p-4 group hover:border-cyan-500/50 transition-all flex flex-col items-center gap-3 relative overflow-hidden bg-slate-800/20 backdrop-blur-sm cursor-grab active:cursor-grabbing"
                                        >
                                            <div className="absolute top-0 right-0 w-full h-1 bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="w-20 h-20 rounded-2xl bg-slate-700/30 flex items-center justify-center border border-slate-700/50 group-hover:bg-cyan-500/10 transition-colors pointer-events-none">
                                                <img
                                                    src={pokemon.img}
                                                    alt={pokemon.name}
                                                    className="w-16 h-16 object-contain drop-shadow-xl group-hover:scale-110 transition-transform"
                                                />
                                            </div>
                                            <div className="text-center w-full min-w-0 px-2 pointer-events-none">
                                                <p className="text-[9px] font-mono text-cyan-500 font-black mb-0.5">
                                                    #
                                                    {String(
                                                        pokemon.pkmId,
                                                    ).padStart(3, '0')}
                                                </p>
                                                <h4 className="font-black text-slate-900 dark:text-white text-xs truncate capitalize">
                                                    {pokemon.nickname ||
                                                        pokemon.name}
                                                </h4>
                                                <span className="inline-block text-[9px] font-black text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded-md mt-1">
                                                    lv{pokemon.lv}
                                                </span>
                                                <div className="mt-1.5 mb-2 flex items-center gap-1 px-1">
                                                    <div className="flex-1 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-linear-to-r from-cyan-400 to-blue-500 rounded-full transition-all"
                                                            style={{
                                                                width: `${Math.min((pokemon.exp / getMaxExp(pokemon.lv)) * 100, 100)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-[7px] font-mono text-slate-500 shrink-0">
                                                        {pokemon.exp}/
                                                        {getMaxExp(pokemon.lv)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-slate-800 w-full z-10">
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleToggleParty(
                                                            pokemon,
                                                            true,
                                                        );
                                                    }}
                                                    disabled={party.length >= 6}
                                                    className="flex-1 p-2 text-slate-400 hover:text-yellow-500 hover:bg-yellow-500/10 disabled:opacity-0 rounded-lg transition-all active:scale-95"
                                                    title="Add to Team"
                                                >
                                                    <Swords
                                                        size={16}
                                                        className="mx-auto"
                                                    />
                                                </button>
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleRelease(pokemon);
                                                    }}
                                                    className="flex-1 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all active:scale-95"
                                                    title="Release"
                                                >
                                                    <Trash2
                                                        size={16}
                                                        className="mx-auto"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {pc.length === 0 && (
                                        <div className="col-span-full text-center py-24 px-4 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800 opacity-40">
                                            <Monitor
                                                size={48}
                                                className="mx-auto mb-4 text-slate-700"
                                            />
                                            <p className="text-sm font-black uppercase tracking-widest">
                                                Empty PC Storage
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
}
