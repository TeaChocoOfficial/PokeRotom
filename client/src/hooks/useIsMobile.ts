// -Path: "PokeRotom/client/src/hooks/useIsMobile.ts"
import { useMemo } from 'react';
import { useControls } from 'leva';

export function useIsMobile(): boolean {
    const { mobile } = useControls('game', {
        mobile: false,
    });
    return useMemo(() => {
        const isMobile = window.matchMedia('(pointer: coarse)').matches;
        return mobile || isMobile;
    }, [mobile]);
}
