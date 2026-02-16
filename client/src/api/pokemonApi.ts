//-Path: "PokeRotom/client/src/api/.ts"
import serverRest from './api';
import type { Pokemon } from '../types/pokemon';

export const pokemonAPI = {
    /** จับโปเกมอนแล้วบันทึกลง DB */
    async catch(pokemonData: {
        name: string;
        height: number;
        weight: number;
        spriteUrl: string;
        pokemonId: number;
    }): Promise<Pokemon> {
        const response = await serverRest.post(`pokemon/catch`, pokemonData);
        return response.data;
    },
    /** ดึงโปเกมอนทั้งหมด */
    async getAll(): Promise<Pokemon[]> {
        const response = await serverRest.get(`pokemon`);
        return response.data;
    },

    /** ดึงโปเกมอนในทีม (Party) */
    async getPokemons(): Promise<Pokemon[]> {
        const response = await serverRest.get(`pokemon/party`);
        return response.data;
    },
    /** ดึงโปเกมอนใน PC */
    async getPC(): Promise<Pokemon[]> {
        const response = await serverRest.get(`pokemon/pc`);
        return response.data;
    },

    /** อัปเดตสถานะ Party */
    async updatePokemonsStatus(
        pokemonDocId: string,
        isInParty: boolean,
    ): Promise<Pokemon | null> {
        const response = await serverRest.patch(
            `pokemon/${pokemonDocId}/party`,
            {
                isInParty,
            },
        );
        return response.data;
    },
    /** เปลี่ยนชื่อเล่น */
    async updateNickname(
        pokemonDocId: string,
        nickname: string,
    ): Promise<Pokemon | null> {
        const response = await serverRest.patch(
            `pokemon/${pokemonDocId}/nickname`,
            {
                nickname,
            },
        );
        return response.data;
    },
    /** ปล่อยโปเกมอน */
    async release(pokemonDocId: string): Promise<Pokemon | null> {
        const response = await serverRest.delete(`pokemon/${pokemonDocId}`);
        return response.data;
    },
    /** นับจำนวนโปเกมอนที่จับได้ */
    async getPokemonCount(): Promise<number> {
        const response = await serverRest.get(`pokemon/count`);
        return response.data;
    },
};
