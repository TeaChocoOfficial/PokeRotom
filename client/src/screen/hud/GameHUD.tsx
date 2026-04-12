// -Path: "PokeRotom/client/src/screen/hud/GameHUD.tsx"
'use client';
import ChatOverlay from './ChatOverlay';
import SettingsPanel from './SettingsPanel';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '$/stores/gameStore';
import { useSocketStore } from '$/stores/socketStore';
import { useIsMobile } from '$/hooks/useIsMobile';

export default function GameHUD() {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [mounted, setMounted] = useState(false);
    const { isConnected, playerCount } = useSocketStore();
    const [showControls, setShowControls] = useState(true);
    const { fps, time, player, isSettingsOpen, toggleSettingsOpen } =
        useGameStore();

    useEffect(() => {
        setMounted(true);
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                toggleSettingsOpen();
                event.preventDefault();
            }
            if (event.code === 'F1') {
                setShowControls((prev) => !prev);
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSettingsOpen, toggleSettingsOpen]);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Top-left: Game info */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleSettingsOpen}
                        className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                        style={{
                            background: isSettingsOpen
                                ? 'var(--primary)'
                                : 'rgba(0,0,0,0.5)',
                            color: '#fff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontSize: '1.25rem',
                        }}
                        title={t('controls.settings')}
                    >
                        ⚙️
                    </button>
                    {/* Connection status */}
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                            color: '#fff',
                            backdropFilter: 'blur(8px)',
                            background: 'rgba(0,0,0,0.6)',
                        }}
                    >
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{
                                boxShadow: isConnected
                                    ? '0 0 6px #4ade80'
                                    : '0 0 6px #f87171',
                                background: isConnected ? '#4ade80' : '#f87171',
                            }}
                        />
                        {isConnected
                            ? t('game.connected')
                            : t('game.disconnected')}
                    </div>
                </div>

                {/* Player count */}
                <div
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                        color: '#fff',
                        backdropFilter: 'blur(8px)',
                        background: 'rgba(0,0,0,0.6)',
                    }}
                >
                    🎮 {t('game.players_online', { count: playerCount })}
                </div>
                {showControls && !isMobile && (
                    <div
                        className="px-4 py-3 rounded-xl text-xs leading-6"
                        style={{
                            color: '#e2e8f0',
                            backdropFilter: 'blur(8px)',
                            background: 'rgba(0,0,0,0.5)',
                        }}
                    >
                        <div className="font-bold mb-1 text-primary-400">
                            ⌨️ Controls
                        </div>
                        <div>{t('controls.move')}</div>
                        <div>{t('controls.run')}</div>
                        <div>{t('controls.camera')}</div>
                        <div>{t('controls.chat')}</div>
                        <div>{t('controls.settings')}</div>
                        <div className="text-muted-foreground mt-1 text-[10px]">
                            F1 toggle
                        </div>
                    </div>
                )}
            </div>

            {/* Top-right: FPS, Position */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                <div
                    className="px-3 py-1.5 rounded-lg text-xs font-mono"
                    style={{
                        backdropFilter: 'blur(8px)',
                        background: 'rgba(0,0,0,0.6)',
                        color: fps > 30 ? '#4ade80' : '#fbbf24',
                    }}
                >
                    {t('hud.fps')}: {fps}
                </div>
                <div
                    className="px-3 py-1.5 rounded-lg text-xs font-mono"
                    style={{
                        color: '#94a3b8',
                        backdropFilter: 'blur(8px)',
                        background: 'rgba(0,0,0,0.6)',
                    }}
                >
                    Time: {Math.floor(time)}
                </div>
                <div
                    className="px-3 py-1.5 rounded-lg text-xs font-mono"
                    style={{
                        color: '#94a3b8',
                        backdropFilter: 'blur(8px)',
                        background: 'rgba(0,0,0,0.6)',
                    }}
                >
                    X:{player.position.x.toFixed(1)} Y:
                    {player.position.y.toFixed(1)} Z:
                    {player.position.z.toFixed(1)}
                </div>
            </div>

            {/* Chat overlay */}
            <ChatOverlay />

            {/* Settings panel */}
            {isSettingsOpen && <SettingsPanel />}
        </div>
    );
}
