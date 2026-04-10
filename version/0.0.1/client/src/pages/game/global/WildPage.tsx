//-Path: "PokeRotom/client/src/pages/game/global/WildPage.tsx"
import {
    Send,
    Trophy,
    Package,
    HelpCircle,
    AlertCircle,
    MousePointer2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useRoomStore } from '../../../stores/roomStore';
import { useSocketStore } from '../../../stores/socketStore';
import { useInventoryStore } from '../../../stores/inventoryStore';

interface WildPokemonState {
    id: number;
    attempts: number;
}

interface Message {
    id: string;
    text: string;
    sender: string;
    isSystem: boolean;
}

export default function WildPage() {
    const { room } = useRoomStore();
    const { user } = useAuthStore();
    const { socket } = useSocketStore();
    const [guess, setGuess] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [selectedBallId, setSelectedBallId] = useState<number>(0);
    const { inventory, fetched, fetchInventory, updateFromData } =
        useInventoryStore();
    const [wildPokemon, setWildPokemon] = useState<WildPokemonState | null>(
        null,
    );
    const [caughtPokemonName, setCaughtPokemonName] = useState<string | null>(
        null,
    );
    const [isThrowing, setIsThrowing] = useState(false);
    const [thrownBallImg, setThrownBallImg] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'caught' | 'escaped'>('idle');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchInventory();
    }, [fetched, updateFromData]);

    useEffect(() => {
        if (!socket || !room) return;

        // Reset state on mount or rejoin
        setStatus('idle');
        setWinner(null);
        setCaughtPokemonName(null);

        // Fetch initial state
        socket.emit('getWildPokemon', room.id);

        // Listeners
        socket.on('updateWildPokemon', (data: WildPokemonState) => {
            setWildPokemon(data);
            setStatus('idle');
            setWinner(null);
            setCaughtPokemonName(null);
            setGuess('');
            inputRef.current?.focus();
        });

        socket.on('updateAttempts', (data: { attempts: number }) => {
            setWildPokemon((prev) =>
                prev ? { ...prev, attempts: data.attempts } : null,
            );
        });

        socket.on(
            'pokemonCaught',
            (data: { winner: string; pokemon: { name: string } }) => {
                setStatus('caught');
                setWinner(data.winner);
                setCaughtPokemonName(data.pokemon.name);
            },
        );

        socket.on('pokemonEscaped', () => {
            setStatus('escaped');
        });

        socket.on(
            'messageWild',
            (data: { message: string; sender: string; system?: boolean }) => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Math.random().toString(36).substring(7),
                        text: data.message,
                        sender: data.sender,
                        isSystem: !!data.system,
                    },
                ]);
            },
        );

        socket.on('inventoryUpdate', (data: any) => {
            updateFromData(data);
        });

        socket.on('error', (msg: string) => {
            alert(msg);
        });

        return () => {
            socket.off('updateWildPokemon');
            socket.off('updateAttempts');
            socket.off('pokemonCaught');
            socket.off('pokemonEscaped');
            socket.off('messageWild');
            socket.off('inventoryUpdate');
            socket.off('error');
        };
    }, [socket, room]);

    const handleGuess = () => {
        if (!socket || !room || !guess.trim() || !user) return;

        // Animate for Rotom Ball
        if (selectedBallId === 0 && selectedBall?.quantity > 0) {
            setThrownBallImg(selectedBall.img || '');
            setIsThrowing(true);
            setTimeout(() => setIsThrowing(false), 800);
        }

        socket.emit('submitGuess', {
            roomId: room.id,
            guess: guess.trim(),
            username: user.username,
            ballId: selectedBallId,
        });

        setGuess('');
    };

    const handleThrowBall = () => {
        if (
            !socket ||
            !room ||
            !user ||
            !selectedBall ||
            selectedBall.quantity <= 0
        )
            return;

        setThrownBallImg(selectedBall.img || '');
        setIsThrowing(true);
        setTimeout(() => setIsThrowing(false), 800);

        socket.emit('throwBall', {
            roomId: room.id,
            ballId: selectedBallId,
            username: user.username,
        });
    };

    const ballItems = inventory.filter((item) => item.category === 'ball');
    const selectedBall =
        ballItems.find((b) => b.id === selectedBallId) || ballItems[0];
    const isRotomBall = selectedBallId === 0;

    if (!room)
        return (
            <div className="text-center text-slate-400 mt-20">
                Please join a room first.
            </div>
        );

    const imageUrl = wildPokemon
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${wildPokemon.id}.png`
        : '';

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-64px)] overflow-hidden flex flex-col md:flex-row gap-6">
            {/* Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-400 mb-2">
                        🌿 Wild Encounter!
                    </h1>
                    <p className="text-slate-400">
                        แข่งกันทายชื่อโปเกมอนตัวนี้ให้ถูกต้อง!
                    </p>
                </div>

                <div className="flex flex-col items-center gap-8 w-full">
                    {/* Pokemon Display */}
                    <div className="relative group shrink-0">
                        <div
                            className={`absolute inset-0 bg-green-500/20 blur-3xl rounded-full transition-all duration-500 ${status === 'caught' ? 'bg-yellow-500/40 scale-125' : status === 'escaped' ? 'bg-red-500/20 opacity-0' : ''}`}
                        />

                        <div
                            className={`relative z-10 p-8 pt-4 po-section transition-all duration-500 ${status === 'caught' ? 'border-yellow-500/50 shadow-2xl shadow-yellow-500/20 scale-110' : ''}`}
                        >
                            <img
                                src={imageUrl}
                                alt="Wild Pokemon"
                                className={`w-64 h-64 object-contain transition-all duration-500 drop-shadow-2xl 
                                    ${status === 'escaped' ? 'opacity-0 scale-50 translate-x-20' : 'animate-float'}
                                `}
                            />

                            {/* Throwing Animation */}
                            {isThrowing && thrownBallImg && (
                                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="animate-throw-ball">
                                            {thrownBallImg.startsWith(
                                                'http',
                                            ) ? (
                                                <img
                                                    src={thrownBallImg}
                                                    alt="Thrown Ball"
                                                    className="w-16 h-16 object-contain drop-shadow-xl"
                                                />
                                            ) : (
                                                <span className="text-5xl drop-shadow-xl">
                                                    {thrownBallImg}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {status === 'idle' && wildPokemon && (
                                <div className="absolute top-4 right-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                    <HelpCircle
                                        size={14}
                                        className="text-slate-400"
                                    />
                                    <span className="text-xs font-mono text-slate-300">
                                        Attempt {wildPokemon.attempts}/20
                                    </span>
                                </div>
                            )}
                        </div>

                        {status === 'caught' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap animate-bounce-in">
                                <div className="bg-yellow-500 text-yellow-950 px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2">
                                    <Trophy size={18} />
                                    <span>Caught by {winner}!</span>
                                </div>
                                <div className="mt-2 text-center">
                                    <span className="inline-block bg-white dark:bg-slate-900/80 text-slate-900 dark:text-white px-3 py-1 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 capitalize">
                                        It's {caughtPokemonName}!
                                    </span>
                                </div>
                            </div>
                        )}

                        {status === 'escaped' && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 whitespace-nowrap animate-fade-in">
                                <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-3 rounded-2xl font-bold backdrop-blur-md flex items-center gap-2">
                                    <AlertCircle size={20} />
                                    <span>It ran away!</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Guess Input or Throw Button */}
                    <div className="w-full max-w-md shrink-0 space-y-4">
                        <div className="relative group">
                            {isRotomBall ? (
                                <>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={guess}
                                        onChange={(e) =>
                                            setGuess(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' && handleGuess()
                                        }
                                        disabled={
                                            status !== 'idle' ||
                                            (selectedBall?.quantity || 0) <= 0
                                        }
                                        placeholder={
                                            status === 'idle'
                                                ? 'ทายชื่อเพื่อใช้ Rotom Ball...'
                                                : 'Waiting for next Pokémon...'
                                        }
                                        className="w-full po-input px-6 py-4 text-center text-lg font-black disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-green-500/50 transition-colors"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleGuess}
                                        disabled={
                                            !guess.trim() ||
                                            status !== 'idle' ||
                                            (selectedBall?.quantity || 0) <= 0
                                        }
                                        className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-800 hover:bg-green-600 disabled:opacity-0 disabled:pointer-events-none text-white rounded-xl transition-all flex items-center justify-center shadow-lg"
                                    >
                                        <Send size={20} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleThrowBall}
                                    disabled={
                                        status !== 'idle' ||
                                        (selectedBall?.quantity || 0) <= 0
                                    }
                                    className="w-full h-14 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-900 disabled:opacity-50 text-white rounded-2xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-95 border-b-4 border-blue-800 active:border-b-0"
                                >
                                    <MousePointer2 size={24} />
                                    Throw {selectedBall?.name || 'Ball'}
                                </button>
                            )}
                        </div>

                        {isRotomBall && (
                            <p className="text-center text-slate-500 text-xs font-medium uppercase tracking-widest animate-pulse">
                                ต้องทายถูกเท่านั้นถึงจะจับติด 100%!
                            </p>
                        )}
                    </div>

                    {/* Ball Selector Bar */}
                    <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-3 rounded-4xl shadow-2xl flex items-center justify-center gap-3 mt-4">
                        {ballItems.length > 0 ? (
                            ballItems.map((ball) => (
                                <button
                                    key={ball.id}
                                    onClick={() => setSelectedBallId(ball.id)}
                                    className={`relative group flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                                        selectedBallId === ball.id
                                            ? 'bg-white/10 border border-white/20 scale-105 shadow-lg'
                                            : 'hover:bg-white/5 border border-transparent'
                                    }`}
                                >
                                    <div className="relative w-12 h-12 flex items-center justify-center">
                                        <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform">
                                            <img
                                                src={ball.img}
                                                alt={ball.name}
                                                className="w-10 h-10 object-contain"
                                            />
                                        </span>
                                        {selectedBallId === ball.id && (
                                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full animate-pulse" />
                                        )}
                                    </div>
                                    <span
                                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${ball.quantity > 0 ? 'bg-slate-800 text-slate-300' : 'bg-red-500/20 text-red-400'}`}
                                    >
                                        x{ball.quantity}
                                    </span>
                                    {selectedBallId === ball.id && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="flex items-center gap-3 py-2 px-6 text-slate-500 italic">
                                <Package size={18} />
                                <span className="text-sm font-medium">
                                    คุณยังไม่มีลูกบอลสำหรับจับโปเกมอน...
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
