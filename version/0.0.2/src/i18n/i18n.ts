// -Path: "PokeRotom/client/src/i18n/i18n.ts"
'use client';
import i18n from 'i18next';
import thLocale from './locales/th.json';
import enLocale from './locales/en.json';
import jaLocale from './locales/ja.json';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    th: { translation: thLocale },
    en: { translation: enLocale },
    ja: { translation: jaLocale },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'th',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
