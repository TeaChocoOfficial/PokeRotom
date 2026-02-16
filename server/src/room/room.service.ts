//-Path: "PokeRotom/server/src/room/room.service.ts"
import { Injectable, BadRequestException } from '@nestjs/common';

export interface Room {
    id: string;
    name: string;
    isPublic: boolean;
    createdAt: number;
    playerCount: number;
}

@Injectable()
export class RoomService {
    private rooms: Map<string, Room> = new Map();
    private readonly MAX_ROOMS = 50;
    private wildPokemonState: Map<
        string,
        {
            id: number;
            name: string;
            height: number;
            weight: number;
            spriteUrl: string;
            attempts: number;
            status: 'active' | 'completed';
        }
    > = new Map();

    async createRoom(name: string, isPublic: boolean): Promise<Room> {
        if (this.rooms.size >= this.MAX_ROOMS) {
            throw new BadRequestException('Reached maximum limit of 50 rooms');
        }

        const id = this.generateId();
        const newRoom: Room = {
            id,
            name,
            isPublic,
            createdAt: Date.now(),
            playerCount: 0,
        };

        this.rooms.set(id, newRoom);
        // Spawn first pokemon
        await this.spawnWildPokemon(id);

        return newRoom;
    }

    async spawnWildPokemon(roomId: string) {
        // Random 1-1025
        const pokemonId = Math.floor(Math.random() * 1025) + 1;
        try {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
            );
            const data = await response.json();

            const pokemonData = {
                id: pokemonId,
                name: data.name,
                height: data.height,
                weight: data.weight,
                spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
                attempts: 0,
                status: 'active' as const,
            };

            this.wildPokemonState.set(roomId, pokemonData);
            return { id: pokemonId, attempts: 0 };
        } catch (error) {
            console.error('Failed to spawn pokemon:', error);
            // Fallback if API fails
            const fallbackData = {
                id: 25,
                name: 'pikachu',
                height: 4,
                weight: 60,
                spriteUrl:
                    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
                attempts: 0,
                status: 'active' as const,
            };
            this.wildPokemonState.set(roomId, fallbackData);
            return { id: 25, attempts: 0 };
        }
    }

    getWildPokemon(roomId: string) {
        const state = this.wildPokemonState.get(roomId);
        if (!state) return null;
        return { id: state.id, attempts: state.attempts };
    }

    getFullWildPokemon(roomId: string) {
        return this.wildPokemonState.get(roomId);
    }

    submitGuess(roomId: string, guess: string) {
        const state = this.wildPokemonState.get(roomId);
        if (!state || state.status !== 'active')
            return { correct: false, attempts: 0, spawnNew: false };

        if (guess.toLowerCase().trim() === state.name.toLowerCase()) {
            state.status = 'completed';
            return {
                correct: true,
                attempts: state.attempts + 1,
                spawnNew: true,
                pokemon: state,
            };
        }

        state.attempts += 1;
        const spawnNew = state.attempts >= 20;

        if (spawnNew) {
            state.status = 'completed';
        }

        return { correct: false, attempts: state.attempts, spawnNew };
    }

    getRoom(id: string): Room | undefined {
        return this.rooms.get(id);
    }

    getAllPublicRooms(): Room[] {
        return Array.from(this.rooms.values()).filter((room) => room.isPublic);
    }

    removeRoom(id: string) {
        this.rooms.delete(id);
        this.wildPokemonState.delete(id);
    }

    updatePlayerCount(id: string, delta: number) {
        const room = this.rooms.get(id);
        if (room) {
            room.playerCount = Math.max(0, room.playerCount + delta);
            if (room.playerCount === 0) {
                this.removeRoom(id);
            }
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 7).toUpperCase();
    }
}
