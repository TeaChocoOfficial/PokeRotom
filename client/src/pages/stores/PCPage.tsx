//-Path: "PokeRotom/client/src/pages/PCPage.tsx"
import { useEffect, useState } from 'react';
import { pokemonAPI } from '../../api/pokemonApi';
import type { Pokemon } from '../../types/pokemon';
import { usePokemonStore } from '../../stores/pokemonStore';

export default function PCPage() {
    const [loading, setLoading] = useState(true);
    const { pc, setPc, party, setParty } = usePokemonStore();

    const loadData = async () => {
        setLoading(true);
        try {
            const [pcData, partyData] = await Promise.all([
                pokemonAPI.getPC(),
                pokemonAPI.getPokemons(),
            ]);
            setPc(pcData);
            setParty(partyData);
        } catch (fetchError) {
            console.error('Failed to fetch PC data:', fetchError);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddToParty = async (pokemon: Pokemon) => {
        if (party.length >= 6) return alert('ทีมเต็มแล้ว! (สูงสุด 6 ตัว)');
        await pokemonAPI.updatePokemonsStatus(pokemon._id, true);
        loadData();
    };

    const handleRelease = async (pokemon: Pokemon) => {
        if (!confirm(`ปล่อย ${pokemon.nickname || pokemon.name} จริงหรือ?`))
            return;
        await pokemonAPI.release(pokemon._id);
        loadData();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 mb-2">
                    💻 PC Storage
                </h1>
                <p className="text-slate-400 mb-4">โปเกมอนที่จับมาได้ทั้งหมด</p>
                <div className="inline-flex items-center gap-4 flex-wrap justify-center">
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-5 py-3">
                        <span className="text-sm text-slate-400">ใน PC:</span>
                        <span className="text-cyan-400 font-bold">
                            {pc.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-5 py-3">
                        <span className="text-sm text-slate-400">ในทีม:</span>
                        <span className="text-yellow-400 font-bold">
                            {party.length}/6
                        </span>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cyan-500" />
                </div>
            )}

            {!loading && pc.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <span className="text-6xl block mb-4">📦</span>
                    <p className="text-lg mb-2">PC ว่างเปล่า!</p>
                    <p className="text-sm">ไปจับโปเกมอนจากหน้า Wild ได้เลย</p>
                </div>
            )}

            {!loading && pc.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {pc.map((pokemon) => (
                        <div
                            key={pokemon._id}
                            className="bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/30 transition-all group"
                        >
                            <div className="relative h-24 flex justify-center items-center mb-2">
                                <div className="absolute inset-0 bg-cyan-400/5 rounded-full blur-xl group-hover:bg-cyan-400/15 transition-all" />
                                <img
                                    src={pokemon.spriteUrl}
                                    alt={pokemon.name}
                                    className="w-20 h-20 relative z-10 drop-shadow-lg"
                                />
                            </div>

                            <div className="text-center">
                                <span className="text-slate-600 text-xs font-mono">
                                    #{String(pokemon.pkmId).padStart(3, '0')}
                                </span>
                                <h3 className="text-sm font-bold capitalize group-hover:text-cyan-400 transition-colors truncate">
                                    {pokemon.nickname || pokemon.name}
                                </h3>
                                <div className="text-xs text-slate-600 mt-0.5">
                                    {new Date(
                                        pokemon.createdAt,
                                    ).toLocaleDateString('th-TH')}
                                </div>

                                <div className="flex gap-1 mt-3">
                                    <button
                                        onClick={() =>
                                            handleAddToParty(pokemon)
                                        }
                                        disabled={party.length >= 6}
                                        className="flex-1 px-2 py-1.5 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition-all"
                                    >
                                        ⚔️ Party
                                    </button>
                                    <button
                                        onClick={() => handleRelease(pokemon)}
                                        className="px-2 py-1.5 bg-slate-800 hover:bg-red-600 rounded-lg text-xs transition-all"
                                    >
                                        👋
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
