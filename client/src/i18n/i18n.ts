// -Path: "PokeRotom/client/src/i18n/i18n.ts"
'use client';
import i18n from 'i18next';
import thLocale from './locales/th.json';
import enLocale from './locales/en.json';
import jaLocale from './locales/ja.json';
import { Language } from '$/types/language';
import { initReactI18next } from 'react-i18next';

const resources = {
    th: { translation: thLocale },
    en: { translation: enLocale },
    ja: { translation: jaLocale },
};

const getInitialLanguage = () => {
    if (typeof window === 'undefined') return Language.EN;
    try {
        const saved = localStorage.getItem('language');
        if (saved) {
            // Jotai's atomWithStorage stores strings with extra quotes like ""en""
            const cleaned = saved.replace(/^"|"$/g, '');
            if (Object.values(Language).includes(cleaned as Language))
                return cleaned;
        }

        // Default to browser language if available
        const browserLang = navigator.language.split('-')[0];
        if (Object.values(Language).includes(browserLang as Language)) {
            return browserLang;
        }
    } catch (error) {
        console.error('Failed to get initial language:', error);
    }
    return Language.EN;
};

i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: Language.EN,
    interpolation: {
        escapeValue: false,
    },
    detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'language',
    },
});

export default i18n;
