// -Path: "PokeRotom/client/src/components/Setup.tsx"
import { useEffect } from 'react';
import { useThemeStore } from '$/stores/themeStore';
import { useSocketStore } from '$/stores/socketStore';

export default function Setup({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();
    const { connect } = useSocketStore();

    useEffect(() => {
        const html = document.documentElement;
        if (theme === 'dark') html.classList.add('dark');
        else html.classList.remove('dark');
    }, [theme]);

    useEffect(() => {
        connect();
    }, [connect]);

    return <>{children}</>;
}
