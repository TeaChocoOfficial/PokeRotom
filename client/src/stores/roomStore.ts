//-Path: "PokeRotom/client/src/stores/roomStore.ts"
import { create } from 'zustand';

export interface Room {
    id: string;
    name: string;
    isPublic: boolean;
    createdAt: number;
    playerCount: number;
}

interface RoomState {
    room: Room | null;
    setRoom: (room: Room | null) => void;
    isInRoom: () => boolean;
}

export const useRoomStore = create<RoomState>((set, get) => ({
    room: null,
    setRoom: (room) => set({ room }),
    isInRoom: () => !!get().room,
}));
