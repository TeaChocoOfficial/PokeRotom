// -Path: "PokeRotom/client/src/screen/hud/settings/SettingsPanel.tsx"
import Select from '../../../components/custom/Select';
import Switch from '../../../components/custom/Switch';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '$/stores/gameStore';
import { useThemeStore } from '$/stores/themeStore';
import { type LanguageType } from '$/types/language';
import { useLanguageStore } from '$/stores/languageStore';
import { BaseQuality, Quality, useSettingStore } from '$/stores/settingStore';

const LANGUAGES = [
    { value: 'th' as LanguageType, label: '🇹🇭 ไทย' },
    { value: 'en' as LanguageType, label: '🇺🇸 English' },
    { value: 'ja' as LanguageType, label: '🇯🇵 日本語' },
];

const QUALITY_OPTIONS = [
    { value: BaseQuality.CUSTOM, label: '' },
    { value: BaseQuality.LOW, label: '' },
    { value: BaseQuality.MEDIUM, label: '' },
    { value: BaseQuality.HIGH, label: '' },
];

const OPTIONS = [
    { value: Quality.NONE, label: '' },
    { value: Quality.LOW, label: '' },
    { value: Quality.MEDIUM, label: '' },
    { value: Quality.HIGH, label: '' },
];

/** @description หน้าจอตั้งค่าเกมที่ออกแบบใหม่ด้วย Tailwind + reusable Select/Switch components */
export default function SettingsPanel() {
    const {
        quality,
        bloomQuality,
        mirrorQuality,
        setQuality,
        setBloomQuality,
        setMirrorQuality,
    } = useSettingStore();
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

    const qualityOptions = QUALITY_OPTIONS.map((option) => ({
        ...option,
        label: t(`settings.${option.value}`),
    }));

    const options = OPTIONS.map((option) => ({
        ...option,
        label: t(`settings.${option.value}`),
    }));

    const languageOptions = LANGUAGES.map((lang) => ({ ...lang }));

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setSettingsOpen(false)}
            />

            {/* Panel */}
            <div
                className={`relative z-10 w-md max-h-[85vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden backdrop-blur-xl ${
                    theme === 'dark'
                        ? 'bg-[rgba(15,15,22,0.92)] border-white/10 text-white'
                        : 'bg-[rgba(255,255,255,0.92)] border-black/10 text-neutral-900'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-white/5">
                    <h2 className="text-xl font-extrabold tracking-tight">
                        ⚙️ {t('settings.title')}
                    </h2>
                    <button
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 ${
                            theme === 'dark'
                                ? 'bg-white/10 hover:bg-red-500/20 hover:text-red-400'
                                : 'bg-black/5 hover:bg-red-500/10 hover:text-red-500'
                        }`}
                        onClick={() => setSettingsOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7 scrollbar-hide">
                    {/* Language */}
                    <section className="space-y-3">
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.15em] opacity-50">
                            🌐 {t('settings.language')}
                        </p>
                        <Select
                            value={i18n.language}
                            options={languageOptions}
                            onChange={(event) =>
                                handleLanguageChange(event.target.value)
                            }
                        />
                    </section>

                    {/* Graphics */}
                    <section className="space-y-5">
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.15em] opacity-50">
                            🖥️ {t('settings.graphics')}
                        </p>

                        <Select
                            label={t('settings.quality')}
                            value={quality}
                            options={qualityOptions}
                            onChange={(event) => setQuality(event.target.value)}
                        />

                        <Select
                            label={t('settings.bloom')}
                            value={bloomQuality}
                            options={options}
                            onChange={(event) =>
                                setBloomQuality(event.target.value)
                            }
                        />

                        <Select
                            label={t('settings.mirror')}
                            value={mirrorQuality}
                            options={options}
                            onChange={(event) =>
                                setMirrorQuality(event.target.value)
                            }
                        />
                    </section>

                    {/* Theme */}
                    <section className="space-y-3">
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.15em] opacity-50">
                            🎨 {t('settings.theme')}
                        </p>
                        <div
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                                theme === 'dark'
                                    ? 'bg-white/5 border-white/5'
                                    : 'bg-black/3 border-black/5'
                            }`}
                        >
                            <span className="text-sm font-bold">
                                {theme === 'dark' ? '🌙' : '☀️'}{' '}
                                {t(`settings.${theme}`)}
                            </span>
                            <Switch
                                checked={theme === 'dark'}
                                onCheckedChange={toggleTheme}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
