//-Path: "rod-ban-boontip/projects/client/src/components/providers/Providers.tsx"
'use client';
import '$/i18n/i18n';
import Setup from './Setup';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    return <Setup>{children}</Setup>;
}
