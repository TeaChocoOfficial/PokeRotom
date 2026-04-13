// -Path: "PokeRotom/client/src/screen/hud/settings/SettingButton.tsx"
import { useTranslation } from 'react-i18next';
import { useGameStore } from '$/stores/gameStore';

/** @description ปุ่มเปิด/ปิดหน้าจอตั้งค่า */
export default function SettingButton() {
    const { t } = useTranslation();
    const { isSettingsOpen, toggleSettingsOpen } = useGameStore();

    return (
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
    );
}
