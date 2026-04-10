//-Path: "PokeRotom/client/src/pages/AuthPage.tsx"
import { useState } from 'react';
import { authAPI } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { generations, spriteBase, typeColors } from './data';
import {
    User,
    Lock,
    UserPlus,
    LogIn,
    Mail,
    XCircle,
    Eye,
    EyeOff,
} from 'lucide-react';

export default function AuthPage() {
    const navigate = useNavigate();
    const { setUser } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeGen, setActiveGen] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedStarter, setSelectedStarter] = useState<number>(1);

    const [form, setForm] = useState({
        name: '',
        username: '',
        password: '',
    });

    const currentGen = generations.find((gen) => gen.gen === activeGen)!;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { data } = await authAPI.login({
                    username: form.username,
                    password: form.password,
                });
                setUser(data.user);
                navigate('/');
            } else {
                await authAPI.register({
                    name: form.name || form.username,
                    username: form.username,
                    password: form.password,
                    starterId: selectedStarter,
                });
                const { data } = await authAPI.login({
                    username: form.username,
                    password: form.password,
                });
                setUser(data.user);
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
            <div
                className={`w-full ${!isLogin ? 'max-w-2xl' : 'max-w-md'} bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group transition-all duration-500 shadow-black/5 dark:shadow-none`}
            >
                <div className="absolute top-4 left-4 z-50">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 flex items-center gap-2"
                    >
                        <XCircle size={18} />
                        Close
                    </button>
                </div>
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-700" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <div className="flex justify-center animate-bounce">
                            <img
                                src="/rotom ball.svg"
                                alt="rotom ball"
                                className="w-32 h-24"
                            />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                            PokeRotom
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            {isLogin
                                ? 'ยินดีต้อนรับกลับมา เทรนเนอร์!'
                                : 'เริ่มการเดินทางของคุณวันนี้!'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Name
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-red-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                name: event.target.value,
                                            })
                                        }
                                        placeholder="Your Name"
                                        className="po-input w-full pl-11 pr-4 py-3 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                Username
                            </label>
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-red-400 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={form.username}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            username: event.target.value,
                                        })
                                    }
                                    placeholder="trainer_id"
                                    className="po-input w-full pl-11 pr-4 py-3 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                Password
                            </label>
                            <div className="relative group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-red-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    required
                                    value={form.password}
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            password: event.target.value,
                                        })
                                    }
                                    placeholder="••••••••"
                                    className="po-input w-full pl-11 pr-12 py-3 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {!isLogin && (
                                <p className="text-[10px] text-slate-500 mt-1 ml-1">
                                    รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร
                                </p>
                            )}
                        </div>

                        {/* Starter Pokémon Selection — All Gens */}
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">
                                    🎮 เลือกโปเกมอนเริ่มต้น
                                </label>

                                {/* Gen Tabs */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {generations.map((gen) => (
                                        <button
                                            key={gen.gen}
                                            type="button"
                                            onClick={() =>
                                                setActiveGen(gen.gen)
                                            }
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                activeGen === gen.gen
                                                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                                                    : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            {gen.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Region Label */}
                                <p className="text-[11px] text-slate-500 mb-3 ml-1 uppercase font-bold tracking-wider">
                                    ภูมิภาค{' '}
                                    <span className="text-red-500 dark:text-white font-black">
                                        {currentGen.region}
                                    </span>
                                </p>

                                {/* Starter Cards */}
                                <div className="grid grid-cols-3 gap-3">
                                    {currentGen.starters.map((starter) => {
                                        const isSelected =
                                            selectedStarter === starter.id;
                                        const colors = typeColors[starter.type];
                                        return (
                                            <button
                                                key={starter.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedStarter(
                                                        starter.id,
                                                    )
                                                }
                                                className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                                                    isSelected
                                                        ? `${colors.border} bg-white dark:bg-slate-800/50 shadow-lg ${colors.glow} scale-105`
                                                        : `border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-600`
                                                }`}
                                            >
                                                {isSelected && (
                                                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md z-10">
                                                        <span className="text-[10px] text-black font-black">
                                                            ✓
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="relative">
                                                    <div
                                                        className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${isSelected ? 'opacity-40' : 'opacity-0'}`}
                                                        style={{
                                                            background:
                                                                colors.accent,
                                                        }}
                                                    />
                                                    <img
                                                        src={`${spriteBase}/${starter.id}.png`}
                                                        alt={starter.name}
                                                        className={`w-16 h-16 object-contain relative z-10 drop-shadow-lg transition-transform duration-300 ${isSelected ? 'animate-float' : ''}`}
                                                    />
                                                </div>
                                                <span
                                                    className={`text-xs font-bold mt-1 transition-colors ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                                                >
                                                    {starter.name}
                                                </span>
                                                <span
                                                    className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}
                                                >
                                                    {starter.type}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/40 active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : isLogin ? (
                                <>
                                    <LogIn size={20} />
                                    <span>เข้าสู่ระบบ</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    <span>สมัครสมาชิก</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-white transition-colors text-sm font-medium"
                        >
                            {isLogin
                                ? 'ไม่มีบัญชี? สมัครที่นี่'
                                : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
