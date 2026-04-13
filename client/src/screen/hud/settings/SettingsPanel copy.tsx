// -Path: "PokeRotom/client/src/screen/hud/settings/SettingsPanel.tsx"
import Select from '../../components/Select';
import Switch from '../../components/Switch';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '$/stores/gameStore';
import { useThemeStore } from '$/stores/themeStore';
import { type LanguageType } from '$/types/language';
import { useLanguageStore } from '$/stores/languageStore';
import { Quality, MirrorQuality, useSettingStore } from '$/stores/settingStore';

const LANGUAGES: { value: LanguageType; label: string; icon: string }[] = [
    { value: 'th', label: 'ไทย', icon: '🇹🇭' },
    { value: 'en', label: 'English', icon: '🇺🇸' },
    { value: 'ja', label: '日本語', icon: '🇯🇵' },
];

/** @description หน้าจอตั้งค่าหลักที่ถูก refactor ใหม่โดยใช้ Tailwind CSS และ reusable components */
export default function SettingsPanel() {
    const { t, i18n } = useTranslation();
    const { setLanguage } = useLanguageStore();
    const { setSettingsOpen } = useGameStore();
    const { theme, toggleTheme } = useThemeStore();
    const { quality, mirrorQuality, setQuality, setMirrorQuality } =
        useSettingStore();

    const handleLanguageChange = (langCode: LanguageType) => {
        setLanguage(langCode);
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        document.documentElement.lang = langCode;
    };

    return (
        <div
            className="fixed inset-0 z-1000 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 pointer-events-auto"
            onClick={() => setSettingsOpen(false)}
        >
            <div
                className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-[2rem] border shadow-2xl animate-in fade-in zoom-in duration-300 transform-gpu"
                style={{
                    backgroundColor:
                        theme === 'dark'
                            ? 'rgba(15, 15, 20, 0.9)'
                            : 'rgba(255, 255, 255, 0.9)',
                    borderColor:
                        theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                    color: theme === 'dark' ? '#fff' : '#1a1a1a',
                }}
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <header className="flex items-center justify-between px-8 py-6 border-b border-white/10">
                    <h2 className="text-2xl font-black tracking-tighter">
                        {t('settings.title')}
                    </h2>
                    <button
                        onClick={() => setSettingsOpen(false)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all duration-300"
                    >
                        ✕
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 scrollbar-hide">
                    {/* General Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary">
                            <span>🌐</span> {t('settings.language')}
                        </div>
                        <Select
                            value={i18n.language}
                            options={LANGUAGES}
                            onChange={(event) =>
                                handleLanguageChange(event.target.value)
                            }
                            placeholder={t('settings.language')}
                        />
                    </section>

                    {/* Graphics Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary">
                            <span>🖥️</span> {t('settings.graphics')}
                        </div>

                        <div className="space-y-4">
                            <Select
                                label={t('settings.quality')}
                                value={quality}
                                options={[
                                    {
                                        value: Quality.LOW,
                                        label: t('settings.low'),
                                    },
                                    {
                                        value: Quality.MEDIUM,
                                        label: t('settings.medium'),
                                    },
                                    {
                                        value: Quality.HIGH,
                                        label: t('settings.high'),
                                    },
                                ]}
                                onChange={(event) =>
                                    setQuality(event.target.value)
                                }
                            />

                            <Select
                                label={t('settings.mirror')}
                                value={mirrorQuality}
                                options={[
                                    {
                                        value: MirrorQuality.NONE,
                                        label: t('settings.none'),
                                    },
                                    {
                                        value: MirrorQuality.LOW,
                                        label: t('settings.low'),
                                    },
                                    {
                                        value: MirrorQuality.MEDIUM,
                                        label: t('settings.medium'),
                                    },
                                    {
                                        value: MirrorQuality.HIGH,
                                        label: t('settings.high'),
                                    },
                                ]}
                                onChange={(event) =>
                                    setMirrorQuality(event.target.value)
                                }
                            />
                        </div>
                    </section>

                    {/* Theme Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary">
                            <span>🎨</span> {t('settings.theme')}
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <Switch
                                label={t(`settings.${theme}`)}
                                checked={theme === 'dark'}
                                onCheckedChange={toggleTheme}
                                className="w-full justify-between flex-row-reverse"
                            />
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="px-8 py-6 bg-black/10 border-t border-white/5">
                    <button
                        onClick={() => setSettingsOpen(false)}
                        className="w-full py-4 rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                    >
                        {t('settings.close')}
                    </button>
                </footer>
            </div>
        </div>
    );
}
