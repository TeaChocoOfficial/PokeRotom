// -Path: "PokeRotom/client/src/stores/socketStore.ts"
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

export interface RemotePlayer {
    socketId: string;
    username: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    movementState: string;
}

export interface ChatMessage {
    sender: string;
    message: string;
    senderUid?: number;
    timestamp: string;
    system?: boolean;
}

export interface WildPokemonState {
    id: number;
    name: string;
    position: { x: number; y: number; z: number };
}

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    remotePlayers: Map<string, RemotePlayer>;
    chatMessages: ChatMessage[];
    wildPokemon: WildPokemonState | null;
    playerCount: number;
    connect: () => void;
    disconnect: () => void;
    emitPlayerMove: (data: {
        position: { x: number; y: number; z: number };
        rotation: { x: number; y: number; z: number };
        movementState: string;
    }) => void;
    sendChatMessage: (message: string, sender: string) => void;
}

export const useSocketStore = create<SocketState>()((set, get) => ({
    socket: null,
    isConnected: false,
    remotePlayers: new Map(),
    chatMessages: [],
    wildPokemon: null,
    playerCount: 0,

    connect: () => {
        const existingSocket = get().socket;
        if (existingSocket?.connected) return;
        console.log('Bearer ' + process.env.NEXT_PUBLIC_API_TOKEN_KEY);
        const socket = io(SERVER_URL, {
            auth: {
                tokenKey: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_KEY}`,
            },
            transports: ['websocket'],
            autoConnect: true,
        });

        socket.on('connect', () => {
            console.log('🌐 Socket connected:', socket.id);
            set({ isConnected: true });
        });

        socket.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
            set({ isConnected: false, remotePlayers: new Map() });
        });

        // รับรายชื่อผู้เล่นทุกคนเมื่อเริ่มเชื่อมต่อ
        socket.on('playersInit', (players: RemotePlayer[]) => {
            const newPlayers = new Map();
            players.forEach((p) => {
                if (p.socketId !== socket.id) newPlayers.set(p.socketId, p);
            });
            set({ remotePlayers: newPlayers });
        });

        socket.on(
            'playerMoved',
            (data: RemotePlayer & { socketId: string }) => {
                if (data.socketId === socket.id) return;

                set((state) => {
                    const newPlayers = new Map(state.remotePlayers);
                    newPlayers.set(data.socketId, data);
                    return { remotePlayers: newPlayers };
                });
            },
        );

        socket.on('updateWildPokemon', (data: any) => {
            // ในที่นี้เรายังไม่ได้แก้ RoomService ให้ส่ง Position มา
            // จะสุ่ม Position ใน Client ไปก่อน แต่ใช้ ID/Name จาก Server
            set({
                wildPokemon: {
                    id: data.id,
                    name: data.name || 'Pikachu',
                    position: { x: 10, y: 1, z: 10 }, // Placeholder position
                },
            });
        });

        socket.on('playerLeft', (data: { socketId: string }) => {
            set((state) => {
                const newPlayers = new Map(state.remotePlayers);
                newPlayers.delete(data.socketId);
                return { remotePlayers: newPlayers };
            });
        });

        socket.on('playersSync', (data: { count: number }) => {
            set({ playerCount: data.count });
        });

        socket.on('messageGlobal', (data: ChatMessage) => {
            set((state) => ({
                chatMessages: [...state.chatMessages.slice(-99), data],
            }));
        });

        set({ socket });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },

    emitPlayerMove: (data) => {
        const { socket } = get();
        if (socket?.connected) socket.emit('playerMove', data);
    },

    sendChatMessage: (message, sender) => {
        const { socket } = get();
        if (socket?.connected)
            socket.emit('sendMessageGlobal', { message, sender });
    },
}));
