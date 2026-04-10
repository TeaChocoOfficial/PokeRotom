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
    updatePokemonStatus: (
        pokemonId: string,
        isInParty: boolean,
        index?: number,
    ) => void;
    swapPokemonTeamPC: (partyPokemonId: string, pcPokemonId: string) => void;
    movePokemonPC: (pokemonId: string, newIndex: number) => void;
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
    updatePokemonStatus: (pokemonId, isInParty, index) => {
        set((state) => {
            const all = [...state.pc, ...state.party];
            const pokemon = all.find((p) => p._id === pokemonId);
            if (!pokemon) return state;

            const updatedPokemon = {
                ...pokemon,
                isInParty,
                index: index ?? pokemon.index,
            };
            const newPc = isInParty
                ? state.pc.filter((p) => p._id !== pokemonId)
                : [
                      ...state.pc.filter((p) => p._id !== pokemonId),
                      updatedPokemon,
                  ];
            const newParty = isInParty
                ? [
                      ...state.party.filter((p) => p._id !== pokemonId),
                      updatedPokemon,
                  ]
                : state.party.filter((p) => p._id !== pokemonId);

            return {
                ...state,
                party: newParty,
                pc: newPc,
            };
        });
    },
    swapPokemonTeamPC: (partyPokemonId, pcPokemonId) => {
        set((state) => {
            const partyPkm = state.party.find((p) => p._id === partyPokemonId);
            const pcPkm = state.pc.find((p) => p._id === pcPokemonId);

            if (!partyPkm || !pcPkm) return state;

            const newPartyPkm = {
                ...partyPkm,
                isInParty: false,
                index: pcPkm.index,
            };
            const newPcPkm = {
                ...pcPkm,
                isInParty: true,
                index: partyPkm.index,
            };

            return {
                ...state,
                party: [
                    ...state.party.filter((p) => p._id !== partyPokemonId),
                    newPcPkm,
                ],
                pc: [
                    ...state.pc.filter((p) => p._id !== pcPokemonId),
                    newPartyPkm,
                ],
            };
        });
    },
    movePokemonPC: (pokemonId, newIndex) => {
        set((state) => {
            const newPc = state.pc.map((p) =>
                p._id === pokemonId ? { ...p, index: newIndex } : p,
            );
            return { ...state, pc: newPc };
        });
    },
}));
