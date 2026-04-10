//-Path: "PokeRotom/client/src/pages/game/layouts/MenuPage.tsx"
import MenuCard from './MenuCard';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Globe, Users, LogOut } from 'lucide-react';
import { freeMenuItems, roomMenuItems } from './menu.data';
import { useSocketStore } from '../../../stores/socketStore';
import { useRoomStore, type Room } from '../../../stores/roomStore';

export default function MenuPage() {
    const { socket } = useSocketStore();
    const { room, setRoom } = useRoomStore();

    useEffect(() => {
        if (!socket) return;

        socket.on('updateRoom', (updatedRoom: Room) => {
            if (room && updatedRoom.id === room.id) {
                setRoom(updatedRoom);
            }
        });

        return () => {
            socket.off('updateRoom');
        };
    }, [socket, room, setRoom]);

    const handleLeaveRoom = () => {
        if (socket && room) {
            socket.emit('leaveRoom', room.id);
            setRoom(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <div className="relative inline-block">
                    <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-red-500 to-purple-600 mb-4 drop-shadow-2xl">
                        PokéRotom
                    </h1>
                    <div className="absolute -inset-4 bg-yellow-500/10 blur-3xl rounded-full -z-10" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-lg mt-4 max-w-md mx-auto">
                    ยินดีต้อนรับเทรนเนอร์! เลือกเมนูเพื่อเริ่มต้นการผจญภัย
                </p>

                {!room && (
                    <Link
                        to="/game/lobby"
                        className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-900/30 active:scale-95"
                    >
                        <Users size={20} />
                        เข้าห้อง / Lobby
                    </Link>
                )}

                {room && (
                    <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in">
                        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-700/50">
                                {room.isPublic ? (
                                    <Globe
                                        className="text-blue-400"
                                        size={20}
                                    />
                                ) : (
                                    <Lock
                                        className="text-yellow-400"
                                        size={20}
                                    />
                                )}
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">
                                    Current Room
                                </p>
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-none">
                                    {room.name}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-700/50">
                                <Users
                                    className="text-emerald-500 dark:text-emerald-400"
                                    size={20}
                                />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">
                                    Players
                                </p>
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-none">
                                    {room.playerCount}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                            <div className="text-left">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-2">
                                    Room ID
                                </p>
                                <code className="text-purple-300 font-mono font-bold bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20 text-sm">
                                    {room.id}
                                </code>
                            </div>
                        </div>

                        <button
                            onClick={handleLeaveRoom}
                            className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-red-200 dark:border-red-900/50 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group/leave text-red-500 active:scale-95"
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center border border-red-100 dark:border-red-800/50 group-hover/leave:scale-110 transition-transform">
                                <LogOut size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest leading-none mb-1">
                                    Action
                                </p>
                                <h3 className="font-bold text-lg leading-none">
                                    Leave Room
                                </h3>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Free Access Menu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {freeMenuItems.map((item) => (
                    <MenuCard key={item.path} item={item} />
                ))}
            </div>

            {/* Room Required Menu */}
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-6 px-1">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Lock size={12} />
                        ต้องเข้าห้องก่อน
                    </span>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roomMenuItems.map((item) => (
                        <MenuCard key={item.path} item={item} locked={!room} />
                    ))}
                </div>
            </div>
        </div>
    );
}
