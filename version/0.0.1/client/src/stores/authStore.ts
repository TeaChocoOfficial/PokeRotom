//-Path: "PokeRotom/client/src/stores/authStore.ts"
import { create } from 'zustand';
import type { User } from '../types/auth';

interface AuthState {
    user: User | null | undefined;
    setUser: (user: User | null | undefined) => void;
    isAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: undefined,
    setUser: (user) => set({ user }),
    isAuth: () => !!get().user,
}));
