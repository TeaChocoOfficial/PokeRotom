//-Path: "PokeRotom/client/src/pages/LobbyPage.tsx"
import {
    Lock,
    Users,
    Globe,
    Search,
    XCircle,
    PlusCircle,
    RefreshCcw,
    ArrowRight,
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Room } from '../../../stores/roomStore';
import { useRoomStore } from '../../../stores/roomStore';
import { useSocketStore } from '../../../stores/socketStore';

export default function LobbyPage() {
    const { socket } = useSocketStore();
    const { room, setRoom } = useRoomStore();
    const [newName, setNewName] = useState('');
    const [searchId, setSearchId] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [publicRooms, setPublicRooms] = useState<Room[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('getRooms');

        socket.on('roomList', (rooms: Room[]) => {
            setPublicRooms(rooms);
        });

        socket.on('joinedRoom', (room: Room) => {
            setRoom(room);
            setError(null);
        });

        socket.on('error', (msg: string) => {
            setError(msg);
            setTimeout(() => setError(null), 5000);
        });

        return () => {
            socket.off('roomList');
            socket.off('joinedRoom');
            socket.off('messageRoom');
            socket.off('error');
        };
    }, [socket, setRoom]);

    const handleCreateRoom = () => {
        if (socket && newName) {
            socket.emit('createRoom', { name: newName, isPublic });
            setNewName('');
        }
    };

    const handleJoinById = (id?: string) => {
        const targetId = id || searchId;
        if (socket && targetId) {
            socket.emit('joinRoom', targetId);
            setSearchId('');
        }
    };

    const handleRefresh = () => socket?.emit('getRooms');

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {error && (
                <div className="fixed top-20 right-4 z-100 animate-slide-in">
                    <div className="bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
                        <XCircle size={20} />
                        <span className="font-bold">{error}</span>
                    </div>
                </div>
            )}

            {!room ? (
                <div className="space-y-8 animate-fade-in">
                    <div className="text-center mb-12">
                        <div className="inline-block p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 mb-6 backdrop-blur-sm">
                            <Users
                                className="text-blue-500 dark:text-blue-400"
                                size={40}
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                            Battle Lobby
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            สร้างห้องหรือเข้าร่วมห้องเพื่อพูดคุยและผจญภัยไปกับเทรนเนอร์คนอื่น
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Control Section */}
                        <div className="space-y-6">
                            {/* Create Room */}
                            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/5 dark:shadow-none">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <PlusCircle
                                            className="text-emerald-500 dark:text-emerald-400"
                                            size={20}
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Create Room
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) =>
                                            setNewName(e.target.value)
                                        }
                                        placeholder="Room Name..."
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all text-sm"
                                    />

                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                        <div className="flex items-center gap-2">
                                            {isPublic ? (
                                                <Globe
                                                    size={16}
                                                    className="text-blue-500 dark:text-blue-400"
                                                />
                                            ) : (
                                                <Lock
                                                    size={16}
                                                    className="text-yellow-600 dark:text-yellow-400"
                                                />
                                            )}
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                {isPublic
                                                    ? 'Public'
                                                    : 'Private'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setIsPublic(!isPublic)
                                            }
                                            className={`w-12 h-6 rounded-full transition-all relative ${isPublic ? 'bg-blue-600' : 'bg-slate-700'}`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPublic ? 'left-7' : 'left-1'}`}
                                            />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleCreateRoom}
                                        disabled={!newName}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95 text-sm"
                                    >
                                        Create New Room
                                    </button>
                                </div>
                            </div>

                            {/* Join by ID */}
                            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/5 dark:shadow-none">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <Search
                                            className="text-blue-500 dark:text-blue-400"
                                            size={20}
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Search ID
                                    </h2>
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={searchId}
                                        onChange={(e) =>
                                            setSearchId(
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        placeholder="ID (e.g. AB123)"
                                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-slate-900 dark:text-white outline-none focus:border-blue-500/50 transition-all text-sm font-mono"
                                    />
                                    <button
                                        onClick={() => handleJoinById()}
                                        disabled={!searchId}
                                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-3 rounded-2xl transition-all active:scale-95"
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Public Rooms Section */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between mb-2 px-2">
                                <div className="flex items-center gap-2">
                                    <Globe
                                        className="text-blue-500 dark:text-blue-400"
                                        size={18}
                                    />
                                    <h2 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm">
                                        Public Rooms
                                    </h2>
                                    <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        {publicRooms.length}/50
                                    </span>
                                </div>
                                <button
                                    onClick={handleRefresh}
                                    className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all active:rotate-180 duration-500"
                                >
                                    <RefreshCcw size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {publicRooms.length > 0 ? (
                                    publicRooms.map((room) => (
                                        <div
                                            key={room.id}
                                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 hover:border-blue-500/30 transition-all group relative overflow-hidden shadow-xl shadow-black/5 dark:shadow-none"
                                        >
                                            <div className="absolute top-0 right-0 p-3 flex gap-2">
                                                <div className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-800/50">
                                                    <Users
                                                        size={10}
                                                        className="text-slate-500"
                                                    />
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {room.playerCount}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative z-10 space-y-3">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate pr-12">
                                                        {room.name}
                                                    </h3>
                                                    <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/50">
                                                        #{room.id}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleJoinById(room.id)
                                                    }
                                                    className="w-full py-2.5 bg-slate-800 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-all active:scale-95"
                                                >
                                                    Join Room
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500">
                                        <Globe
                                            size={40}
                                            className="mb-4 opacity-20"
                                        />
                                        <p className="font-bold">
                                            No public rooms available
                                        </p>
                                        <p className="text-xs">
                                            Create one to start the adventure!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Navigate to="/game" />
            )}
        </div>
    );
}
