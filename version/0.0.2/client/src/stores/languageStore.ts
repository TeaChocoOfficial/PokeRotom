// -Path: "PokeRotom/client/src/stores/languageStore.ts"
'use client';
import { create } from 'zustand';
import { Language, LanguageType } from '$/types/language';

function getDefaultLanguage(): LanguageType {
    if (typeof window === 'undefined') return Language.EN;
    try {
        const saved = localStorage.getItem('language');
        if (saved) {
            const cleaned = saved.replace(/^"|"$/g, '');
            if (Object.values(Language).includes(cleaned as Language))
                return cleaned as LanguageType;
        }
        const browserLang = navigator.language.split('-')[0];
        if (Object.values(Language).includes(browserLang as Language))
            return browserLang as LanguageType;
    } catch {}
    return Language.EN;
}

interface LanguageState {
    language: LanguageType;
    setLanguage: (language: LanguageType) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    language: getDefaultLanguage(),
    setLanguage: (language) => set({ language }),
}));
