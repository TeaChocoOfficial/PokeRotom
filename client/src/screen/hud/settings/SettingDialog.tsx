// -Path: "PokeRotom/client/src/screen/hud/settings/SettingDialog.tsx"
import SettingsPanel from './SettingsPanel';
import { Activity, useEffect } from 'react';
import { useGameStore } from '$/stores/gameStore';

/** @description หน้าจอตั้งค่าเกม */
export default function SettingDialog() {
    const { isSettingsOpen, toggleSettingsOpen } = useGameStore();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                toggleSettingsOpen();
                event.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSettingsOpen, toggleSettingsOpen]);

    return (
        <Activity mode={isSettingsOpen ? 'visible' : 'hidden'}>
            <SettingsPanel />
        </Activity>
    );
}
