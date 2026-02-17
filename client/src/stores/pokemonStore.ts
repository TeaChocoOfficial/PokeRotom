//-Path: "PokeRotom/client/src/stores/pokemonStore.ts"
import { create } from 'zustand';
import type { PokemonDB } from '../types/pokemon';

interface PokemonState {
    pc: PokemonDB[];
    totalCount: number;
    pcFetched: boolean;
    partyFetched: boolean;
    party: PokemonDB[];
    clear: () => void;
    fetchPokemons: () => Promise<void>;
    setPc: (pc: PokemonDB[]) => void;
    setParty: (party: PokemonDB[]) => void;
    setTotalCount: (count: number) => void;
    reorderParty: (startIndex: number, endIndex: number) => void;
    updatePokemonStatus: (pokemonId: string, isInParty: boolean) => void;
}

export const usePokemonStore = create<PokemonState>((set) => ({
    pc: [],
    party: [],
    totalCount: 0,
    pcFetched: false,
    partyFetched: false,
    clear: () =>
        set({
            pc: [],
            party: [],
            totalCount: 0,
            pcFetched: false,
            partyFetched: false,
        }),
    setPc: (pc) => set({ pc, pcFetched: true }),
    setParty: (party) => set({ party, partyFetched: true }),
    setTotalCount: (totalCount) => set({ totalCount }),
    reorderParty: (startIndex, endIndex) => {
        set((state) => {
            const newParty = [...state.party];
            const [removed] = newParty.splice(startIndex, 1);
            newParty.splice(endIndex, 0, removed);
            return { ...state, party: newParty };
        });
    },
    fetchPokemons: async () => {
        const { getPC, getPokemons } = (await import('../api/pokemonApi'))
            .pokemonAPI;
        try {
            const [pcData, partyData] = await Promise.all([
                getPC(),
                getPokemons(),
            ]);
            set({
                pc: pcData,
                party: partyData,
                pcFetched: true,
                partyFetched: true,
            });
        } catch (error) {
            console.error('Failed to fetch pokemons:', error);
        }
    },
    updatePokemonStatus: (pokemonId: string, isInParty: boolean) => {
        set((state) => {
            const all = [...state.party, ...state.pc];
            const pokemon = all.find((p) => p._id === pokemonId);
            if (!pokemon) return state;

            const updatedPokemon = { ...pokemon, isInParty };
            const newParty = isInParty
                ? [...state.party, updatedPokemon]
                : state.party.filter((p) => p._id !== pokemonId);

            const newPc = isInParty
                ? state.pc.filter((p) => p._id !== pokemonId)
                : [...state.pc, updatedPokemon];

            return {
                ...state,
                party: newParty,
                pc: newPc,
            };
        });
    },
}));
