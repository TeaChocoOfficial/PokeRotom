//-Path: "PokeRotom/client/src/App.tsx"
import HomePage from './pages/HomePage';
import { authAPI } from './api/authApi';
import Layout from './components/Layout';
import { useEffect, useState } from 'react';
import AuthPage from './pages/auth/AuthPage';
import SettingsPage from './pages/SettingsPage';
import GameLayout from './components/GameLayout';
import { useAuthStore } from './stores/authStore';
import WildPage from './pages/game/global/WildPage';
import MenuPage from './pages/game/layouts/MenuPage';
import TradePage from './pages/game/global/TradePage';
import LobbyPage from './pages/game/layouts/LobbyPage';
import PCPage from './pages/game/stores/pokemon/PCPage';
import BattlePage from './pages/game/global/BattlePage';
import { useSettingStore } from './stores/settingStore';
import { Route, Routes, Navigate } from 'react-router-dom';
import BagPage from './pages/game/stores/inventory/BagPage';
import ShopPage from './pages/game/stores/inventory/ShopPage';
import PokedexPage from './pages/game/stores/pokedex/PokedexPage';
import PokemonPage from './pages/game/stores/pokemon/PokemonPage';
import PokemonDetailPage from './pages/game/stores/pokemon/PokemonDetailPage';
import PokedexPkmDetailPage from './pages/game/stores/pokedex/details/PokedexPkmDetailPage';
import PokedexItemDetailPage from './pages/game/stores/pokedex/details/PokedexItemDetailPage';
import PokedexMoveDetailPage from './pages/game/stores/pokedex/details/PokedexMoveDetailPage';
import PokedexAbilityDetailPage from './pages/game/stores/pokedex/details/PokedexAbilityDetailPage';

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
                    <Route
                        path="pokedex/pokemon/:id"
                        element={<PokedexPkmDetailPage />}
                    />
                    <Route
                        path="pokedex/item/:id"
                        element={<PokedexItemDetailPage />}
                    />
                    <Route
                        path="pokedex/move/:id"
                        element={<PokedexMoveDetailPage />}
                    />
                    <Route
                        path="pokedex/ability/:id"
                        element={<PokedexAbilityDetailPage />}
                    />
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
