//-Path: "PokeRotom/client/src/stores/socketStore.ts"
import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface SocketState {
    socket: Socket | null;
    socketId: string | null;
    setSocket: (socket: Socket | null) => void;
    setSocketId: (id: string | null) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
    socket: null,
    socketId: null,
    setSocket: (socket) => set({ socket }),
    setSocketId: (socketId) => set({ socketId }),
}));
