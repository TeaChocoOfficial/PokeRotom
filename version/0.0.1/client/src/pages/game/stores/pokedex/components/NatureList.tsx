// - Path: "PokeRotom/client/src/pages/game/stores/pokedex/components/NatureList.tsx"
import PkmStat from '../../../../../hooks/pokemonStat';
import type { Nature } from '../../../../../types/pokemon';

interface NatureListProps {
    data: Nature[];
}

// Helper to map flavor ID to name manually
const getFlavorName = (id: number | null) => {
    switch (id) {
        case 1:
            return 'Spicy';
        case 2:
            return 'Dry';
        case 3:
            return 'Sweet';
        case 4:
            return 'Bitter';
        case 5:
            return 'Sour';
        default:
            return 'None';
    }
};

export default function NatureList({ data }: NatureListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.map((nature) => {
                const hasStatChange = nature.in_stat_id !== nature.de_stat_id;

                return (
                    <div
                        key={nature.id}
                        className="po-section p-5 group cursor-default bg-linear-to-b from-slate-900/50 to-slate-950/80 border-slate-800 hover:border-green-500/20 transition-all shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-1.5 h-6 bg-green-500/50 rounded-full" />
                            <h3 className="text-xl font-black capitalize text-white tracking-tight">
                                {nature.name}
                            </h3>
                            <div className="w-1.5 h-6 bg-red-500/50 rounded-full" />
                        </div>

                        <div className="space-y-3">
                            {/* Stats Modification */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col items-center justify-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/50">
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-green-500 mb-1">
                                        Incr (+)
                                    </span>
                                    <span className="text-xs font-bold text-slate-200 uppercase text-center">
                                        {PkmStat.getStatNameByID(
                                            nature.in_stat_id,
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/50">
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-red-500 mb-1">
                                        Decr (-)
                                    </span>
                                    <span className="text-xs font-bold text-slate-200 uppercase text-center">
                                        {PkmStat.getStatNameByID(
                                            nature.de_stat_id,
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Flavor Preferences */}
                            {!hasStatChange ? (
                                <div className="py-2 text-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                        — Neutral Nature —
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-1.5 pt-2 border-t border-slate-800/50">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">
                                            Likes
                                        </span>
                                        <span className="text-[11px] font-black text-emerald-400 capitalize">
                                            {getFlavorName(
                                                nature.like_flavor_id,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">
                                            Hates
                                        </span>
                                        <span className="text-[11px] font-black text-rose-400 capitalize">
                                            {getFlavorName(
                                                nature.hate_flavor_id,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
