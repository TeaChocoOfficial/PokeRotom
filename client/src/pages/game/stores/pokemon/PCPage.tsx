// -
import 'allotment/dist/style.css';
import { Allotment } from 'allotment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Swords, Monitor } from 'lucide-react';
import { pokemonAPI } from '../../../../api/pokemonApi';
import type { PokemonDB } from '../../../../types/pokemon';
import { BoxHeader, BoxSlot, PartyMember } from './PCComponents';
import { usePokemonStore } from '../../../../stores/pokemonStore';

const BOX_COLS = 6;
const BOX_ROWS = 5;
const BOX_COUNT = 12;
const SLOT_COUNT = BOX_ROWS * BOX_COLS;

export default function PCPage() {
    const {
        pc,
        party,
        pcFetched,
        partyFetched,
        fetchPokemons,
        updatePokemonStatus,
        movePokemonPC: updateStorePCIndex,
    } = usePokemonStore();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [currentBox, setCurrentBox] = useState(0);

    useEffect(() => {
        fetchPokemons();
    }, []);

    const handleToggleParty = async (
        pokemon: PokemonDB,
        toParty: boolean,
        index?: number,
    ) => {
        setError('');
        if (toParty && party.length >= 6)
            return setError('ทีมของคุณเต็มแล้ว! (สูงสุด 6 ตัว)');

        const originalPc = [...pc];
        const originalParty = [...party];
        updatePokemonStatus(pokemon._id, toParty, index);

        try {
            await pokemonAPI.updatePokemonsStatus(pokemon._id, toParty, index);
        } catch (catchError: any) {
            setError(catchError.response?.data?.message || 'การย้ายล้มเหลว');
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

    const handleMovePC = async (pokemon: PokemonDB, newIndex: number) => {
        const originalPc = [...pc];
        const targetPokemon = pc.find((p) => p.index === newIndex);

        // Optimistic Swap
        if (targetPokemon && targetPokemon._id !== pokemon._id) {
            updateStorePCIndex(targetPokemon._id, pokemon.index);
        }
        updateStorePCIndex(pokemon._id, newIndex);

        try {
            await pokemonAPI.movePokemonPC(pokemon._id, newIndex);
        } catch (err) {
            console.error('Failed to move pokemon in PC:', err);
            usePokemonStore.setState({ pc: originalPc });
        }
    };

    const handleDragStart = (event: React.DragEvent, pokemon: PokemonDB) => {
        event.dataTransfer.setData('pokemonId', pokemon._id);
        event.dataTransfer.setData(
            'sourceInParty',
            pokemon.isInParty.toString(),
        );
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleDropOnParty = (event: React.DragEvent) => {
        event.preventDefault();
        const pokemonId = event.dataTransfer.getData('pokemonId');
        const sourceInParty =
            event.dataTransfer.getData('sourceInParty') === 'true';
        if (sourceInParty) return;

        const pokemon = pc.find((p) => p._id === pokemonId);
        if (pokemon) handleToggleParty(pokemon, true);
    };

    const handleDropOnSlot = (event: React.DragEvent, slotIndex: number) => {
        event.preventDefault();
        const pokemonId = event.dataTransfer.getData('pokemonId');
        const sourceInParty =
            event.dataTransfer.getData('sourceInParty') === 'true';
        const absoluteIndex = currentBox * SLOT_COUNT + slotIndex;

        if (sourceInParty) {
            const pokemon = party.find((p) => p._id === pokemonId);
            if (pokemon) {
                const targetPokemon = pc.find((p) => p.index === absoluteIndex);
                if (targetPokemon) {
                    // Optimized Swap logic
                    const originalPc = [...pc];
                    const originalParty = [...party];
                    const { swapPokemonTeamPC } = usePokemonStore.getState();
                    swapPokemonTeamPC(pokemon._id, targetPokemon._id);

                    pokemonAPI
                        .updatePokemonsStatus(pokemon._id, false, absoluteIndex)
                        .catch((err) => {
                            console.error('Swap failed:', err);
                            usePokemonStore.setState({
                                pc: originalPc,
                                party: originalParty,
                            });
                        });
                } else {
                    handleToggleParty(pokemon, false, absoluteIndex);
                }
            }
        } else {
            const pokemon = pc.find((p) => p._id === pokemonId);
            if (pokemon) handleMovePC(pokemon, absoluteIndex);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const nextBox = () => setCurrentBox((prev) => (prev + 1) % BOX_COUNT);
    const prevBox = () =>
        setCurrentBox((prev) => (prev - 1 + BOX_COUNT) % BOX_COUNT);

    const boxSlots = Array(SLOT_COUNT).fill(null);
    pc.forEach((p) => {
        if (!p.isInParty && p.index !== -1) {
            const boxIndex = Math.floor(p.index / SLOT_COUNT);
            const slotIndex = p.index % SLOT_COUNT;
            if (boxIndex === currentBox) boxSlots[slotIndex] = p;
        }
    });

    if (!pcFetched || !partyFetched)
        return (
            <div className="max-w-[1600px] mx-auto px-4 py-8 h-[calc(100vh-100px)] flex items-center justify-center">
                <div className="po-card p-10 flex flex-col items-center gap-4 animate-scale-up border border-cyan-500/20 bg-slate-900/40">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-500">
                        Accessing PC...
                    </span>
                </div>
            </div>
        );

    return (
        <div className="w-full max-w-[1700px] mx-auto px-4 py-4 md:py-8 h-screen md:h-[calc(100vh-100px)] flex flex-col overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 shrink-0">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center md:justify-start gap-3">
                        <Monitor className="text-cyan-500" size={32} />
                        PC Storage
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm">
                        จัดการทีมและคลังโปเกมอน
                        (ลากวางเพื่อย้ายและวางตำแหน่งได้อย่างอิสระ)
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="po-card px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2 md:gap-3 bg-slate-950/40">
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Storage:
                        </span>
                        <span className="text-base md:text-lg font-black text-slate-900 dark:text-white">
                            {pc.length}
                        </span>
                    </div>
                    <div className="po-card px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2 md:gap-3 bg-slate-950/40">
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Team:
                        </span>
                        <span
                            className={`text-base md:text-lg font-black ${party.length >= 6 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}
                        >
                            {party.length}/6
                        </span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-2 rounded-xl flex items-center gap-3 animate-bounce-in shrink-0">
                    <Info size={16} />
                    <span className="font-bold text-xs">{error}</span>
                </div>
            )}

            <div className="flex-1 min-h-0 bg-slate-900/30 rounded-3xl md:rounded-[2.5rem] border border-slate-800 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col md:block">
                <div className="block md:hidden h-full overflow-y-auto">
                    {/* Mobile: Party Section */}
                    <div
                        className="p-4 bg-slate-900/60 border-b border-slate-800"
                        onDrop={handleDropOnParty}
                        onDragOver={handleDragOver}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Swords className="text-yellow-500" size={18} />
                            <h2 className="font-black text-white uppercase tracking-wider text-sm">
                                Your Team
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {party.map((p) => (
                                <PartyMember
                                    key={p._id}
                                    pokemon={p}
                                    handleDragStart={handleDragStart}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Mobile: PC Section */}
                    <div className="p-4" onDragOver={handleDragOver}>
                        <BoxHeader
                            total={SLOT_COUNT}
                            prevBox={prevBox}
                            nextBox={nextBox}
                            currentBox={currentBox}
                            boxOccupancy={boxSlots.filter((p) => p).length}
                        />
                        <div className="grid grid-cols-3 gap-2 mt-4 justify-items-center">
                            {boxSlots.map((p, i) => (
                                <BoxSlot
                                    key={i}
                                    index={i}
                                    pokemon={p}
                                    navigate={navigate}
                                    handleRelease={handleRelease}
                                    handleDragOver={handleDragOver}
                                    handleDragStart={handleDragStart}
                                    handleDropOnSlot={handleDropOnSlot}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hidden md:block h-full">
                    <Allotment>
                        <Allotment.Pane preferredSize="320px" minSize={280}>
                            <div
                                className="h-full flex flex-col p-6 bg-slate-900/40"
                                onDrop={handleDropOnParty}
                                onDragOver={handleDragOver}
                            >
                                <div className="flex items-center gap-2 mb-6 px-2">
                                    <Swords
                                        className="text-yellow-500"
                                        size={20}
                                    />
                                    <h2 className="font-black text-white uppercase tracking-wider text-xl">
                                        Your Team
                                    </h2>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                                    {party.map((p) => (
                                        <PartyMember
                                            key={p._id}
                                            pokemon={p}
                                            handleDragStart={handleDragStart}
                                        />
                                    ))}
                                    {[...Array(6 - party.length)].map(
                                        (_, i) => (
                                            <div
                                                key={`empty-t-${i}`}
                                                className="po-card border-dashed border-slate-800 bg-transparent opacity-20 flex items-center justify-center h-[72px] rounded-2xl"
                                            >
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
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
                                className="h-full flex flex-col p-6 md:p-10 bg-slate-900/20"
                                onDragOver={handleDragOver}
                            >
                                <div className="w-full max-w-lg mx-auto mb-8">
                                    <BoxHeader
                                        currentBox={currentBox}
                                        prevBox={prevBox}
                                        nextBox={nextBox}
                                        boxOccupancy={
                                            boxSlots.filter((p) => p).length
                                        }
                                        total={SLOT_COUNT}
                                    />
                                </div>

                                <div className="flex-1 flex items-center justify-center overflow-auto scrollbar-hide">
                                    <div className="grid grid-cols-6 gap-3 md:gap-4 p-6 md:p-8 bg-slate-800/20 rounded-[3rem] border border-slate-700/30 backdrop-blur-sm shadow-inner shrink-0 scale-90 lg:scale-100">
                                        {boxSlots.map((p, i) => (
                                            <BoxSlot
                                                key={i}
                                                index={i}
                                                pokemon={p}
                                                navigate={navigate}
                                                handleDragStart={
                                                    handleDragStart
                                                }
                                                handleDropOnSlot={
                                                    handleDropOnSlot
                                                }
                                                handleRelease={handleRelease}
                                                handleDragOver={handleDragOver}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Allotment.Pane>
                    </Allotment>
                </div>
            </div>
        </div>
    );
}
