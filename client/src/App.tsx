//-Path: "PokeRotom/client/src/App.tsx"
import HomePage from './pages/HomePage';
import { authAPI } from './api/authApi';
import Layout from './components/Layout';
import { useEffect, useState } from 'react';
import AuthPage from './pages/auth/AuthPage';
import SettingsPage from './pages/SettingsPage';
import PCPage from './pages/game/stores/PCPage';
import GameLayout from './components/GameLayout';
import BagPage from './pages/game/stores/BagPage';
import { useAuthStore } from './stores/authStore';
import ShopPage from './pages/game/stores/ShopPage';
import WildPage from './pages/game/global/WildPage';
import MenuPage from './pages/game/layouts/MenuPage';
import TradePage from './pages/game/global/TradePage';
import LobbyPage from './pages/game/layouts/LobbyPage';
import BattlePage from './pages/game/global/BattlePage';
import { useSettingStore } from './stores/settingStore';
import PokedexPage from './pages/game/stores/PokedexPage';
import PokemonPage from './pages/game/stores/PokemonPage';
import { Route, Routes, Navigate } from 'react-router-dom';
import PokemonDetailPage from './pages/game/stores/PokemonDetailPage';
import PokedexDetailPage from './pages/game/stores/PokedexDetailPage';

export default function App() {
    const { isAuth, setUser } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await authAPI.getAuth();
                if (data) setUser(data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [setUser]);

    const darkMode = useSettingStore((state) => state.darkMode);
    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/auth"
                element={!isAuth() ? <AuthPage /> : <Navigate to="/" />}
            />
            <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* Game Flow */}
                <Route
                    path="game"
                    element={
                        isAuth() ? <GameLayout /> : <Navigate to="/auth" />
                    }
                >
                    <Route index element={<MenuPage />} />
                    <Route path="lobby" element={<LobbyPage />} />

                    {/* ไม่ต้องเข้าห้อง — เข้าได้เลยเมื่อ login */}
                    <Route path="pc" element={<PCPage />} />
                    <Route path="bag" element={<BagPage />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="pokedex" element={<PokedexPage />} />
                    <Route path="pokedex/:id" element={<PokedexDetailPage />} />
                    <Route path="pokemon" element={<PokemonPage />} />
                    <Route path="pokemon/:id" element={<PokemonDetailPage />} />

                    {/* ต้องเข้าห้องก่อน */}
                    <Route path="wild" element={<WildPage />} />
                    <Route path="trade" element={<TradePage />} />
                    <Route path="battle" element={<BattlePage />} />
                </Route>
            </Route>
        </Routes>
    );
}
