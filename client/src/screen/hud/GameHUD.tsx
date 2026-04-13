// -Path: "PokeRotom/client/src/screen/hud/GameHUD.tsx"
import ChatOverlay from './ChatOverlay';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '$/stores/gameStore';
import SettingButton from './settings/SettingButton';
import SettingDialog from './settings/SettingDialog';
import { useSocketStore } from '$/stores/socketStore';

export default function GameHUD() {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const { isConnected, playerCount } = useSocketStore();
    const { fps, time, player } = useGameStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Top-left: Game info */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <SettingButton />
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
                    Time:{' '}
                    {Math.floor(time / 100)
                        .toString()
                        .padStart(2, '0')}
                    :
                    {Math.floor(((time % 100) / 100) * 60)
                        .toString()
                        .padStart(2, '0')}
                    :
                    {Math.floor(((((time % 100) / 100) * 60) % 1) * 60)
                        .toString()
                        .padStart(2, '0')}
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

            {/* Settings dialog */}
            {<SettingDialog />}
        </div>
    );
}
