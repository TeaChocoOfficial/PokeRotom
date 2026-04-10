//-Path: "PokeRotom/client/src/pages/game/global/BattlePage.tsx"
import { useState } from 'react';
import { useRoomStore } from '../../../stores/roomStore';
import { Swords, Shield, Zap, Search, Trophy } from 'lucide-react';

export default function BattlePage() {
    const { room } = useRoomStore();
    const [searchOpponent, setSearchOpponent] = useState('');

    if (!room)
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in transition-colors">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                    <Swords
                        className="text-red-500 dark:text-red-400"
                        size={36}
                    />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    ต้องเข้าห้องก่อน
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    คุณต้องเข้าร่วมห้องเพื่อท้าสู้กับเทรนเนอร์คนอื่น
                </p>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-500 to-yellow-500 dark:from-red-400 dark:to-yellow-400 mb-2">
                    ⚔️ Battle Arena
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    ท้าสู้กับเทรนเนอร์คนอื่นในห้อง{' '}
                    <span className="text-slate-900 dark:text-white font-bold">
                        {room.name}
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Team Preview */}
                <div className="po-section p-6 shadow-xl shadow-black/5 dark:shadow-none">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Shield
                                className="text-blue-500 dark:text-blue-400"
                                size={20}
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                ทีมของคุณ
                            </h2>
                            <p className="text-xs text-slate-500">
                                โปเกมอนที่จะใช้ต่อสู้
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={`slot-${index}`}
                                className="flex items-center gap-3 bg-slate-950/50 border border-slate-800/50 rounded-xl p-3"
                            >
                                <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                                    <span className="text-sm text-slate-700">
                                        {index + 1}
                                    </span>
                                </div>
                                <span className="text-sm text-slate-400 dark:text-slate-600">
                                    Empty Slot
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Battle Zone */}
                <div className="po-section p-6 shadow-xl shadow-black/5 dark:shadow-none flex flex-col items-center justify-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
                        <div className="relative w-32 h-32 rounded-full bg-white dark:bg-slate-800/50 border-4 border-slate-100 dark:border-red-500/30 flex items-center justify-center shadow-lg">
                            <Zap
                                className="text-yellow-500 dark:text-yellow-400"
                                size={48}
                            />
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                        VS
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6">
                        ค้นหาคู่ต่อสู้หรือรอการท้าทาย
                    </p>

                    {/* Search Opponent */}
                    <div className="w-full">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchOpponent}
                                onChange={(event) =>
                                    setSearchOpponent(event.target.value)
                                }
                                placeholder="ชื่อเทรนเนอร์..."
                                className="flex-1 po-input px-4 py-2.5 text-sm"
                            />
                            <button
                                disabled={!searchOpponent}
                                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 text-sm"
                            >
                                <Search size={18} />
                            </button>
                        </div>
                    </div>

                    <button className="mt-4 w-full bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-red-900/30 active:scale-95 flex items-center justify-center gap-2">
                        <Swords size={20} />
                        หาคู่แบบสุ่ม
                    </button>
                </div>

                {/* Leaderboard */}
                <div className="po-section p-6 shadow-xl shadow-black/5 dark:shadow-none">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                            <Trophy
                                className="text-yellow-500 dark:text-yellow-400"
                                size={20}
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                อันดับ
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                เทรนเนอร์ที่แข็งแกร่งที่สุด
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={`rank-${index}`}
                                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50 rounded-xl p-3"
                            >
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                                        index === 0
                                            ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                            : index === 1
                                              ? 'bg-slate-200 dark:bg-slate-400/20 text-slate-500 dark:text-slate-300'
                                              : index === 2
                                                ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                                                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600'
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                <span className="text-sm text-slate-400 dark:text-slate-600">
                                    ---
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
