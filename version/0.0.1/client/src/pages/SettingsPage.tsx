//-Path: "PokeRotom/client/src/pages/SettingsPage.tsx"
import {
    Moon,
    Bell,
    User,
    Info,
    Music,
    Volume2,
    Settings,
    Sparkles,
    Smartphone,
    ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useSettingStore, type SettingKeys } from '../stores/settingStore';

interface SettingToggle {
    id: SettingKeys;
    label: string;
    icon: any;
    desc: string;
    defaultValue: boolean;
}

const settingsToggles: SettingToggle[] = [
    {
        id: 'sound',
        label: 'Sound Effects',
        icon: Volume2,
        desc: 'เปิด/ปิดเสียงเอฟเฟกต์',
        defaultValue: true,
    },
    {
        id: 'music',
        label: 'Background Music',
        icon: Music,
        desc: 'เปิด/ปิดเพลงพื้นหลัง',
        defaultValue: true,
    },
    {
        id: 'vibration',
        label: 'Vibration',
        icon: Smartphone,
        desc: 'เปิด/ปิดการสั่น',
        defaultValue: false,
    },
    {
        id: 'animation',
        label: 'Animations',
        icon: Sparkles,
        desc: 'เปิด/ปิดอนิเมชัน',
        defaultValue: true,
    },
    {
        id: 'darkMode',
        label: 'Dark Mode',
        icon: Moon,
        desc: 'โหมดมืด',
        defaultValue: true,
    },
    {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        desc: 'การแจ้งเตือน',
        defaultValue: true,
    },
];

export default function SettingsPage() {
    const { user } = useAuthStore();
    const settings = useSettingStore();
    const { toggleSetting } = useSettingStore();

    const handleToggleSetting = (settingId: SettingKeys) =>
        toggleSetting(settingId);

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <div className="inline-block p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6 backdrop-blur-sm">
                    <Settings
                        className="text-slate-500 dark:text-slate-400"
                        size={40}
                    />
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    ปรับแต่งประสบการณ์การเป็นเทรนเนอร์ของคุณ
                </p>
            </div>

            <div className="space-y-6">
                {/* Trainer Profile Section */}
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                    <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-800/50 flex items-center gap-3">
                        <User
                            className="text-slate-400 dark:text-slate-500"
                            size={20}
                        />
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                            Trainer Profile
                        </h2>
                    </div>
                    <div className="p-8 flex items-center gap-6">
                        <div className="w-20 h-20 bg-linear-to-br from-yellow-400 to-red-500 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-red-900/20 relative group">
                            <span className="group-hover:scale-110 transition-transform">
                                🧢
                            </span>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-slate-900 rounded-full" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-1">
                                {user?.name || 'Trainer Red'}
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 text-sm font-mono uppercase tracking-tighter">
                                    {(user as any)?.uid
                                        ? `ID: ${(user as any).uid}`
                                        : 'New Trainer'}
                                </span>
                                <div className="w-1 h-1 rounded-full bg-slate-700" />
                                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">
                                    Kanto Region
                                </span>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all active:scale-95 border border-slate-700">
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                    <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-800/50 flex items-center gap-3">
                        <Sparkles
                            className="text-slate-400 dark:text-slate-500"
                            size={20}
                        />
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                            Preferences
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {settingsToggles.map((setting) => (
                            <div
                                key={setting.id}
                                className="flex items-center justify-between p-8 hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-900 dark:group-hover:text-white transition-all">
                                        <setting.icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-0.5">
                                            {setting.label}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-500 text-xs">
                                            {setting.desc}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        handleToggleSetting(setting.id)
                                    }
                                    className={`w-14 h-8 rounded-full transition-all relative p-1 ${
                                        settings[setting.id]
                                            ? 'bg-green-500 shadow-lg shadow-green-900/30'
                                            : 'bg-slate-700'
                                    }`}
                                >
                                    <div
                                        className={`w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${
                                            settings[setting.id]
                                                ? 'translate-x-6'
                                                : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                    <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-800/50 flex items-center gap-3">
                        <Info
                            className="text-slate-400 dark:text-slate-500"
                            size={20}
                        />
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                            About
                        </h2>
                    </div>
                    <div className="p-8 space-y-4">
                        {[
                            { label: 'Version', value: '0.0.1' },
                            { label: 'Framework', value: 'React + TypeScript' },
                            { label: 'Style', value: 'Tailwind CSS v4' },
                            { label: 'Icons', value: 'Lucide React' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center group"
                            >
                                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                                    {item.label}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-900 dark:text-white text-sm font-bold">
                                        {item.value}
                                    </span>
                                    <ChevronRight
                                        size={14}
                                        className="text-slate-700 group-hover:text-slate-400 transition-colors"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
