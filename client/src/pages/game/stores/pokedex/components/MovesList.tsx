// - Path: "PokeRotom/client/src/pages/game/stores/pokedex/components/MovesList.tsx"
import { useNavigate } from 'react-router-dom';
import type { Move } from '../../../../../types/pokemon';

interface MovesListProps {
    data: Move[];
    lastElementRef: (node: HTMLDivElement | null) => void;
}

export default function MovesList({ data, lastElementRef }: MovesListProps) {
    const navigate = useNavigate();

    return (
        <div className="space-y-3">
            {data.map((move, index) => {
                const isLast = index === data.length - 1;
                return (
                    <div
                        key={move.id}
                        ref={isLast ? lastElementRef : null}
                        onClick={() =>
                            navigate(`/game/pokedex/move/${move.id}`)
                        }
                        className="po-section p-4 flex flex-col md:flex-row md:items-center gap-4 group hover:border-yellow-500/30 cursor-pointer"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold capitalize text-white">
                                    {move.name.replace(/-/g, ' ')}
                                </h3>
                                <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-slate-800 text-slate-300`}
                                >
                                    {move.type}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">
                                {move.desc}
                            </p>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-mono shrink-0">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-600 uppercase">
                                    Power
                                </span>
                                <span className="text-yellow-500 font-bold">
                                    {move.power || '—'}
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-600 uppercase">
                                    Acc
                                </span>
                                <span className="text-blue-400 font-bold">
                                    {move.accuracy || '—'}%
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-600 uppercase">
                                    PP
                                </span>
                                <span className="text-purple-400 font-bold">
                                    {move.pp}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
