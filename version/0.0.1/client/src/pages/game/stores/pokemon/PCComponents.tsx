// -
import { useNavigate } from 'react-router-dom';
import { PokemonDB } from '../../../../types/pokemon';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export function PartyMember({
    pokemon,
    handleDragStart,
}: {
    pokemon: PokemonDB;
    handleDragStart: (event: React.DragEvent, pokemon: PokemonDB) => void;
}) {
    const navigate = useNavigate();

    return (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, pokemon)}
            onClick={() => navigate(`/game/pokemon/${pokemon._id}`)}
            className="po-card p-3 group hover:border-yellow-500/50 transition-all flex items-center gap-4 relative overflow-hidden bg-slate-800/40 backdrop-blur-md cursor-grab active:cursor-grabbing border-slate-700/50"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center border border-slate-700 shrink-0">
                <img
                    src={pokemon.img}
                    alt={pokemon.name}
                    className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform pointer-events-none"
                />
            </div>
            <div className="flex-1 min-w-0 pointer-events-none">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white truncate capitalize text-sm">
                        {pokemon.nickname || pokemon.name}
                    </h3>
                    <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-md">
                        lv{pokemon.lv}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function BoxHeader({
    currentBox,
    prevBox,
    nextBox,
    boxOccupancy,
    total,
}: {
    total: number;
    prevBox: () => void;
    nextBox: () => void;
    currentBox: number;
    boxOccupancy: number;
}) {
    return (
        <div className="flex items-center justify-between bg-slate-800/60 p-2 md:p-3 rounded-2xl border border-slate-700/50 w-full shadow-lg">
            <button
                onClick={prevBox}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-cyan-400"
            >
                <ChevronLeft size={24} />
            </button>
            <div className="text-center">
                <h2 className="font-black text-white uppercase tracking-widest text-base md:text-xl">
                    Box {currentBox + 1}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <div className="w-24 h-1 bg-slate-900 rounded-full overflow-hidden hidden md:block">
                        <div
                            className="h-full bg-cyan-500 transition-all duration-500"
                            style={{
                                width: `${(boxOccupancy / total) * 100}%`,
                            }}
                        />
                    </div>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                        {boxOccupancy} / {total} Slots
                    </p>
                </div>
            </div>
            <button
                onClick={nextBox}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-cyan-400"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
}

export function BoxSlot({
    index,
    pokemon,
    navigate,
    handleRelease,
    handleDragOver,
    handleDragStart,
    handleDropOnSlot,
}: {
    index: number;
    pokemon: PokemonDB | null;
    navigate: (path: string) => void;
    handleRelease: (pokemon: PokemonDB) => void;
    handleDragOver: (event: React.DragEvent) => void;
    handleDragStart: (event: React.DragEvent, pokemon: PokemonDB) => void;
    handleDropOnSlot: (event: React.DragEvent, index: number) => void;
}) {
    return (
        <div
            draggable={!!pokemon}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnSlot(e, index)}
            onDragStart={(e) => pokemon && handleDragStart(e, pokemon)}
            onClick={() => pokemon && navigate(`/game/pokemon/${pokemon._id}`)}
            className={`
                w-20 md:w-24 h-20 md:h-24 rounded-2xl border transition-all relative flex items-center justify-center group
                ${
                    pokemon
                        ? 'po-card bg-slate-800/50 border-slate-700/80 cursor-grab active:cursor-grabbing hover:border-cyan-500/50 hover:bg-slate-700/50 shadow-lg'
                        : 'bg-slate-900/40 border-slate-800/40 opacity-40 hover:opacity-60 hover:border-slate-700/40'
                }
            `}
        >
            {pokemon ? (
                <>
                    <img
                        src={pokemon.img}
                        alt={pokemon.name}
                        className="w-14 md:w-16 h-14 md:h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform pointer-events-none"
                    />
                    <div className="absolute top-1 right-1 bg-cyan-500 text-[8px] md:text-[9px] font-black px-1 rounded-md text-white border border-slate-950 shadow-sm">
                        Lv{pokemon.lv}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 rounded-b-2xl pointer-events-none text-center">
                        <p className="text-[8px] font-black truncate capitalize text-cyan-400 px-1">
                            {pokemon.nickname || pokemon.name}
                        </p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRelease(pokemon);
                        }}
                        className="absolute -top-1 -left-1 p-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-red-500/40 z-20 shadow-lg"
                    >
                        <Trash2 size={12} />
                    </button>
                    <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
                </>
            ) : (
                <div className="w-2 h-2 rounded-full bg-slate-800" />
            )}
        </div>
    );
}
