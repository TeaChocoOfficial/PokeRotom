// - Path: "PokeRotom/client/src/pages/game/stores/PokemonPage.tsx"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonStore } from '../../../../stores/pokemonStore';

/** คำนวณ max exp ตาม lv */
const getMaxExp = (lv: number): number => lv * lv * 10;

export default function PokemonPage() {
    const navigate = useNavigate();
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const { party, partyFetched, fetchPokemons, reorderParty } =
        usePokemonStore();

    useEffect(() => {
        if (!partyFetched) {
            fetchPokemons();
        }
    }, [partyFetched, fetchPokemons]);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;
        reorderParty(draggedIndex, index);
        setDraggedIndex(null);
    };

    const emptySlots = 6 - party.length;

    if (!partyFetched) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-500" />
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400 mb-2">
                    ⚔️ Pokémon Party
                </h1>
                <p className="text-slate-400 font-medium">
                    โปเกมอนในทีมของคุณ ({party.length}/6) - ลากเพื่อสลับตำแหน่ง
                    หรือคลิกเพื่อดูรายละเอียด
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {party.map((pokemon, index) => (
                    <div
                        key={pokemon._id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        onClick={() => navigate(`/game/pokemon/${pokemon._id}`)}
                        className={`
                            relative bg-slate-900/50 backdrop-blur-md rounded-3xl p-4 border transition-all cursor-pointer group
                            ${draggedIndex === index ? 'opacity-50 scale-95 border-yellow-500' : 'border-slate-800 hover:border-yellow-500/50 hover:bg-slate-800'}
                        `}
                    >
                        <div className="absolute top-3 left-3 bg-yellow-500/20 text-yellow-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter z-20">
                            Slot {index + 1}
                        </div>

                        <div className="relative aspect-square flex justify-center items-center mb-4">
                            <div className="absolute inset-0 bg-yellow-400/5 rounded-full blur-2xl group-hover:bg-yellow-400/10 transition-colors" />
                            <img
                                src={pokemon.img}
                                alt={pokemon.name}
                                className="w-24 h-24 relative z-10 drop-shadow-xl group-hover:scale-110 transition-transform pointer-events-none"
                            />
                        </div>

                        <div className="text-center pointer-events-none">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <span className="text-[10px] font-black text-yellow-500/50 font-mono">
                                    lv
                                </span>
                                <span className="text-sm font-black text-white">
                                    {pokemon.lv || 1}
                                </span>
                            </div>
                            <h3 className="text-xs font-bold capitalize text-slate-200 truncate px-2">
                                {pokemon.nickname || pokemon.name}
                            </h3>
                            <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden w-full">
                                <div
                                    className="h-full bg-cyan-500 transition-all duration-500"
                                    style={{
                                        width: `${Math.min(((pokemon.exp || 0) / getMaxExp(pokemon.lv || 1)) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {Array.from({ length: emptySlots }).map((_, index) => (
                    <div
                        key={`empty-${index}`}
                        className="bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-800/50 flex flex-col items-center justify-center aspect-square opacity-30"
                    >
                        <div className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center">
                            <span className="text-xs font-black text-slate-800">
                                ?
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {party.length === 0 && (
                <div className="text-center mt-12 py-12 bg-slate-900/30 rounded-[3rem] border border-slate-800">
                    <p className="text-slate-400 text-lg mb-2">
                        ทีมยังว่างอยู่!
                    </p>
                    <p className="text-sm text-slate-500">
                        ไปจับโปเกมอนจากหน้า Wild หรือเพิ่มจาก PC ได้เลย
                    </p>
                </div>
            )}
        </div>
    );
}
