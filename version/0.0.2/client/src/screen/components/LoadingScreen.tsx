// -Path: "PokeRotom/client/src/screen/components/LoadingScreen.tsx"
'use client';

export default function LoadingScreen() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    {/* Pokeball spinner */}
                    <div
                        className="w-16 h-16 rounded-full border-4 animate-spin"
                        style={{
                            borderColor: '#e85d3a transparent #fff transparent',
                            animationDuration: '1s',
                        }}
                    />
                    <div
                        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2"
                        style={{
                            background: '#fff',
                            border: '2px solid #333',
                        }}
                    />
                </div>
                <span
                    className="text-lg font-bold animate-pulse"
                    style={{ color: '#fb923c' }}
                >
                    PokeRotom World
                </span>
            </div>
        </div>
    );
}
