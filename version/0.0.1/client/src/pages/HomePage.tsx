//-Path: "PokeRotom/client/src/pages/HomePage.tsx"
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { TreePine, Layout, Monitor, ArrowRight } from 'lucide-react';

export default function HomePage() {
    const { user } = useAuthStore();

    return (
        <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-red-400/20 dark:bg-red-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700" />

            <div className="relative z-10 max-w-4xl w-full text-center">
                <div className="inline-block p-1 px-3 mb-6 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-sm transition-colors">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Welcome to PokeRotom v0.0.1
                    </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
                    <span className="text-slate-900 dark:text-white">
                        จับ. สะสม.{' '}
                    </span>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-yellow-500 dark:via-yellow-400 to-red-600 animate-gradient">
                        แบทเทิล.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    ร่วมเป็นส่วนหนึ่งของโลกโปเกมอนในรูปแบบเว็บบราวเซอร์
                    สร้างห้องเพื่อพบปะเทรนเนอร์คนอื่น แลกเปลี่ยนประสบการณ์
                    และสนุกไปกับการผจญภัยที่ไม่มีที่สิ้นสิ้นสุด
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/game"
                        className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/10 flex items-center gap-2"
                    >
                        เข้าสู่หน้าเกม
                        <ArrowRight
                            size={20}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                    <Link
                        to="/settings"
                        className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-black/5"
                    >
                        ตั้งค่าผู้ใช้
                    </Link>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 backdrop-blur-sm hover:border-green-500/30 transition-all group shadow-xl shadow-black/5 dark:shadow-none">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <TreePine
                                className="text-green-600 dark:text-green-400"
                                size={24}
                            />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Wild Exploration
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            ค้นหาโปเกมอนป่าในพื้นที่ต่างๆ และใช้ Poke Ball
                            เพื่อจับมาเป็นพวก
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 backdrop-blur-sm hover:border-blue-500/30 transition-all group shadow-xl shadow-black/5 dark:shadow-none">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Layout
                                className="text-blue-600 dark:text-blue-400"
                                size={24}
                            />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Room System
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            สร้างห้องส่วนตัวหรือเข้าร่วมห้องสาธารณะเพื่อพบกับเพื่อนใหม่
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all group shadow-xl shadow-black/5 dark:shadow-none">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Monitor
                                className="text-cyan-600 dark:text-cyan-400"
                                size={24}
                            />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            PC Storage
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            จัดการทีมโปเกมอนของคุณ และเก็บสะสมพวกมันไว้ในระบบ PC
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Credit */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800/50 backdrop-blur-sm transition-colors shadow-lg shadow-black/5 dark:shadow-none">
                Developed by {user?.name || 'Trainer'}
            </div>
        </div>
    );
}
