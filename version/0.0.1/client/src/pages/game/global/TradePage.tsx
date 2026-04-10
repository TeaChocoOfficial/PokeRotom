//-Path: "PokeRotom/client/src/pages/game/global/TradePage.tsx"
import { useState } from 'react';
import { useRoomStore } from '../../../stores/roomStore';
import { ArrowLeftRight, Search, Package, Sparkles } from 'lucide-react';

export default function TradePage() {
    const { room } = useRoomStore();
    const [searchUser, setSearchUser] = useState('');

    if (!room)
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in transition-colors">
                <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                    <ArrowLeftRight
                        className="text-purple-600 dark:text-purple-400"
                        size={36}
                    />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    ต้องเข้าห้องก่อน
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    คุณต้องเข้าร่วมห้องเพื่อแลกเปลี่ยนโปเกมอนหรือไอเทมกับเทรนเนอร์คนอื่น
                </p>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 mb-2">
                    🔄 Trade Center
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    แลกเปลี่ยนโปเกมอนหรือไอเทมกับเทรนเนอร์คนอื่นในห้อง{' '}
                    <span className="text-slate-900 dark:text-white font-bold">
                        {room.name}
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Offer Side */}
                <div className="po-section p-6 shadow-xl shadow-black/5 dark:shadow-none">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Package
                                className="text-blue-500 dark:text-blue-400"
                                size={20}
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                ของที่คุณเสนอ
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                เลือกโปเกมอนหรือไอเทมที่ต้องการแลก
                            </p>
                        </div>
                    </div>

                    <div className="min-h-[200px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-2">
                        <Package size={40} className="opacity-30" />
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-600">
                            ลากไอเทมมาวางที่นี่
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-700">
                            หรือกดเลือกจากรายการด้านล่าง
                        </p>
                    </div>
                </div>

                {/* Their Offer Side */}
                <div className="po-section p-6 shadow-xl shadow-black/5 dark:shadow-none">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Sparkles
                                className="text-purple-600 dark:text-purple-400"
                                size={20}
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                ของที่อีกฝ่ายเสนอ
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                รอให้อีกฝ่ายเลือกสิ่งที่จะแลก
                            </p>
                        </div>
                    </div>

                    <div className="min-h-[200px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-2">
                        <Sparkles size={40} className="opacity-30" />
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-600">
                            รอของจากอีกฝ่าย...
                        </p>
                    </div>
                </div>
            </div>

            {/* Search & Invite */}
            <div className="mt-8 po-section p-6 shadow-xl shadow-black/5 dark:shadow-none">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Search
                            className="text-emerald-600 dark:text-emerald-400"
                            size={20}
                        />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        ค้นหาเทรนเนอร์
                    </h2>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={searchUser}
                        onChange={(event) => setSearchUser(event.target.value)}
                        placeholder="พิมพ์ชื่อเทรนเนอร์ที่ต้องการแลก..."
                        className="flex-1 po-input px-5 py-3 text-sm"
                    />
                    <button
                        disabled={!searchUser}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl transition-all active:scale-95 text-sm flex items-center gap-2"
                    >
                        <ArrowLeftRight size={18} />
                        เชิญแลก
                    </button>
                </div>
            </div>
        </div>
    );
}
