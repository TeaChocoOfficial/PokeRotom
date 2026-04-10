//-Path: "PokeRotom/client/src/components/Layout.tsx"
import {
    Cpu,
    Home,
    LogIn,
    LogOut,
    Gamepad2,
    Settings,
    Terminal,
    ArrowLeft,
} from 'lucide-react';
import Env from '../secure/env';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { authAPI } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { useSocketStore } from '../stores/socketStore';
import { usePokemonStore } from '../stores/pokemonStore';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/game', label: 'Game', icon: Gamepad2 },
    { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, setUser } = useAuthStore();
    const { fetchPokemons } = usePokemonStore();
    const { setSocket, socketId, setSocketId } = useSocketStore();

    // Hide navbar in game routes
    const isGameRoute = pathname.startsWith('/game');
    const isSubGameRoute =
        isGameRoute && pathname.split('/').filter(Boolean).length > 1;

    useEffect(() => {
        const newSocket = io(Env.API_URL, {
            extraHeaders: {
                Authorization: `Bearer ${Env.API_TOKEN_KEY}`,
            },
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setSocketId(newSocket.id || null);
            if (user) newSocket.emit('registerSocket', { uid: user.uid });
        });

        newSocket.on('pokemonUpdated', () => {
            fetchPokemons();
        });

        newSocket.on('disconnect', () => setSocketId(null));

        return () => {
            newSocket.close();
            setSocket(null);
            setSocketId(null);
        };
    }, [setSocket, setSocketId, fetchPokemons, user]);

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
            {isGameRoute ? (
                <>
                    <div className="fixed top-4 left-4 z-100">
                        <button
                            title="Back to Menu"
                            onClick={() =>
                                navigate(isSubGameRoute ? '/game' : '/')
                            }
                            className="p-3 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-2xl shadow-2xl transition-all group flex items-center gap-2"
                        >
                            <ArrowLeft size={20} />
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {isSubGameRoute ? 'Go Menu' : 'Go Home'}
                            </span>
                        </button>
                    </div>
                </>
            ) : (
                <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center h-16 gap-1 overflow-x-auto scrollbar-hide">
                            <NavLink
                                to="/"
                                title="Home"
                                className="font-black text-xl text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-red-500 mr-8 shrink-0 flex items-center gap-2"
                            >
                                <div className="w-12 h-12">
                                    <img
                                        src="rotom ball.svg"
                                        alt="Rotom Ball"
                                        className="w-full h-full"
                                    />
                                </div>
                                PokéRotom
                            </NavLink>
                            <div className="flex items-center gap-2">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === '/'}
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                                                isActive
                                                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`
                                        }
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="ml-auto px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 flex items-center gap-2"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="ml-auto px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 flex items-center gap-2"
                                >
                                    <LogIn size={18} />
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            )}

            <main className="flex-1">
                <Outlet />
            </main>

            {/* Debug Info Overlay */}
            <div className="fixed bottom-4 right-4 z-50 flex items-end gap-1.5 pointer-events-none">
                {socketId && (
                    <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-2xl animate-fade-in shadow-black/5 dark:shadow-black/20">
                        <Terminal
                            size={12}
                            className="text-blue-500 dark:text-blue-400"
                        />
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                            SID:
                        </span>
                        <span className="text-[10px] font-mono text-slate-900 dark:text-white font-bold">
                            {socketId}
                        </span>
                    </div>
                )}
                {user && (
                    <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-2xl animate-fade-in shadow-black/5 dark:shadow-black/20">
                        <Cpu
                            size={12}
                            className="text-emerald-500 dark:text-emerald-400"
                        />
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                            UID:
                        </span>
                        <span className="text-[10px] font-mono text-slate-900 dark:text-white font-bold">
                            {(user as any).uid || 'N/A'}
                        </span>
                    </div>
                )}
            </div>

            {!isGameRoute && (
                <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-slate-500 text-sm">
                    <p>2026 PokéRotom • Fan Game • AI Powered</p>
                </footer>
            )}
        </div>
    );
}
