// -Path: "PokeRotom/client/src/screen/hud/SettingsPanel.tsx"
'use client';
import { useTranslation } from 'react-i18next';
import { LanguageType } from '$/types/language';
import { useGameStore } from '$/stores/gameStore';
import { useThemeStore } from '$/stores/themeStore';
import { useLanguageStore } from '$/stores/languageStore';

const LANGUAGES: { code: LanguageType; label: string; flag: string }[] = [
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export default function SettingsPanel() {
    const { t, i18n } = useTranslation();
    const { setLanguage } = useLanguageStore();
    const { setSettingsOpen } = useGameStore();
    const { theme, toggleTheme } = useThemeStore();

    const handleLanguageChange = (langCode: LanguageType) => {
        setLanguage(langCode);
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        document.documentElement.lang = langCode;
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{ background: 'rgba(0,0,0,0.5)' }}
                onClick={() => setSettingsOpen(false)}
            />

            {/* Panel */}
            <div
                className="relative z-10 w-96 rounded-2xl p-6 shadow-2xl"
                style={{
                    background:
                        theme === 'dark'
                            ? 'rgba(20,20,30,0.95)'
                            : 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border:
                        theme === 'dark'
                            ? '1px solid rgba(255,255,255,0.1)'
                            : '1px solid rgba(0,0,0,0.1)',
                    color: theme === 'dark' ? '#fafafa' : '#171717',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">
                        ⚙️ {t('settings.title')}
                    </h2>
                    <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors cursor-pointer"
                        style={{
                            background:
                                theme === 'dark'
                                    ? 'rgba(255,255,255,0.1)'
                                    : 'rgba(0,0,0,0.1)',
                        }}
                        onClick={() => setSettingsOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Language */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-3 opacity-70">
                        🌐 {t('settings.language')}
                    </label>
                    <div className="flex gap-2">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                className="flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
                                style={{
                                    background:
                                        i18n.language === lang.code
                                            ? 'var(--primary)'
                                            : theme === 'dark'
                                              ? 'rgba(255,255,255,0.08)'
                                              : 'rgba(0,0,0,0.06)',
                                    color:
                                        i18n.language === lang.code
                                            ? '#fff'
                                            : 'inherit',
                                    boxShadow:
                                        i18n.language === lang.code
                                            ? '0 4px 12px rgba(245,122,61,0.3)'
                                            : 'none',
                                }}
                                onClick={() => handleLanguageChange(lang.code)}
                            >
                                {lang.flag} {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme Toggle */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-3 opacity-70">
                        🎨 {t('settings.theme')}
                    </label>
                    <button
                        className="w-full py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
                        style={{
                            background:
                                theme === 'dark'
                                    ? 'linear-gradient(135deg, #1a1a3e, #2d1b4e)'
                                    : 'linear-gradient(135deg, #ffecd2, #fcb69f)',
                            color: theme === 'dark' ? '#e0e0ff' : '#5a3a1a',
                            boxShadow:
                                theme === 'dark'
                                    ? '0 4px 12px rgba(45,27,78,0.5)'
                                    : '0 4px 12px rgba(252,182,159,0.5)',
                        }}
                        onClick={toggleTheme}
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}{' '}
                        {theme === 'dark'
                            ? t('settings.dark')
                            : t('settings.light')}
                    </button>
                </div>
            </div>
        </div>
    );
}
