// -Path: "PokeRotom/client/src/pages/game/layouts/MenuCard.tsx"
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { freeMenuItems } from './menu.data';

export default function MenuCard({
    item,
    locked,
}: {
    item: (typeof freeMenuItems)[0];
    locked?: boolean;
}) {
    return (
        <Link
            to={item.path}
            className={`group relative overflow-hidden rounded-2xl po-card p-8 flex flex-col justify-between ${locked ? 'opacity-60 hover:opacity-100 hover:border-yellow-500/50' : ''}`}
        >
            <div
                className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div
                        className={`w-14 h-14 rounded-2xl bg-linear-to-br ${item.color} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}
                    >
                        <item.icon className="text-white" size={32} />
                    </div>
                    {locked && (
                        <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg">
                            <Lock size={10} className="text-yellow-400" />
                            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
                                Room
                            </span>
                        </div>
                    )}
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-yellow-400 transition-colors">
                    {item.label}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                </p>
            </div>
            <div
                className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-linear-to-r ${item.color} transition-all duration-500`}
            />
        </Link>
    );
}
