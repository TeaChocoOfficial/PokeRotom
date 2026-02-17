// - Path: "PokeRotom/client/src/pages/game/stores/pokedex/components/AbilitiesList.tsx"
import { useNavigate } from 'react-router-dom';
import type { Ability } from '../../../../../types/pokemon';

interface AbilitiesListProps {
    data: Ability[];
    lastElementRef: (node: HTMLDivElement | null) => void;
}

export default function AbilitiesList({
    data,
    lastElementRef,
}: AbilitiesListProps) {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((ability, index) => {
                const isLast = index === data.length - 1;
                return (
                    <div
                        key={ability.id}
                        ref={isLast ? lastElementRef : null}
                        onClick={() =>
                            navigate(`/game/pokedex/ability/${ability.id}`)
                        }
                        className="po-section p-5 group hover:border-purple-500/30 cursor-pointer"
                    >
                        <h3 className="text-lg font-bold capitalize text-white mb-2">
                            {ability.name.replace(/-/g, ' ')}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                            {ability.desc ||
                                'This ability has no detailed information.'}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
