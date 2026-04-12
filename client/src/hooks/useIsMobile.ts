// -Path: "PokeRotom/client/src/hooks/useIsMobile.ts"

export function useIsMobile(): boolean {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    return true;
    return isMobile;
}
