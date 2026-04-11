//-Path: "rod-ban-boontip/projects/client/src/components/providers/Providers.tsx"
import '$/i18n/i18n';
import Setup from './Setup';

export default function Providers({ children }: { children: React.ReactNode }) {
    return <Setup>{children}</Setup>;
}
