//-Path: "rod-ban-boontip/projects/client/src/components/providers/Providers.tsx"
import '$/i18n/i18n';
import Setup from './Setup';
import { Leva } from 'leva';
import { isDev } from '$/secure/env';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Setup>
            <Leva hidden={!isDev} />
            {children}
        </Setup>
    );
}
