//-Path: "PokeRotom/server/src/room/room.gateway.ts"
import {
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { UserService } from '../user/user.service';
import { PokemonService } from '../pokemon/pokemon.service';
import { InventoryService } from '../inventory/inventory.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly roomService: RoomService,
        private readonly userService: UserService,
        private readonly pokemonService: PokemonService,
        private readonly inventoryService: InventoryService,
    ) {}

    private logger: Logger = new Logger('RoomGateway');
    private clientRooms: Map<string, string> = new Map();
    private userSockets: Map<number, string> = new Map(); // uid -> socketId
    private globalRoom = 'global_channel';

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        client.join(this.globalRoom);
        client.emit('roomList', this.roomService.getAllPublicRooms());
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);

        // Remove from userSockets
        for (const [uid, socketId] of this.userSockets.entries()) {
            if (socketId === client.id) {
                this.userSockets.delete(uid);
                break;
            }
        }

        const roomId = this.clientRooms.get(client.id);
        if (roomId) {
            this.leaveRoomLogic(client, roomId);
        }
    }

    @SubscribeMessage('getRooms')
    handleGetRooms(@ConnectedSocket() client: Socket) {
        client.emit('roomList', this.roomService.getAllPublicRooms());
    }

    @SubscribeMessage('createRoom')
    async handleCreateRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { name: string; isPublic: boolean },
    ) {
        try {
            const room = await this.roomService.createRoom(
                data.name,
                data.isPublic,
            );
            client.join(room.id);
            this.clientRooms.set(client.id, room.id);
            this.roomService.updatePlayerCount(room.id, 1);

            this.logger.log(
                `Client ${client.id} created and joined room: ${room.id}`,
            );
            client.emit('joinedRoom', room);
            this.server.to(room.id).emit('updateRoom', room);

            // Send initial wild pokemon
            const wildPokemon = this.roomService.getWildPokemon(room.id);
            if (wildPokemon) {
                client.emit('updateWildPokemon', wildPokemon);
            }

            if (room.isPublic) {
                this.server.emit(
                    'roomList',
                    this.roomService.getAllPublicRooms(),
                );
            }
        } catch (error) {
            client.emit('error', error.message);
        }
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string,
    ) {
        const room = this.roomService.getRoom(roomId);
        if (!room) {
            client.emit('error', 'Room not found');
            return;
        }

        const currentRoomId = this.clientRooms.get(client.id);
        if (currentRoomId) {
            this.leaveRoomLogic(client, currentRoomId);
        }

        client.join(room.id);
        this.clientRooms.set(client.id, room.id);
        this.roomService.updatePlayerCount(room.id, 1);
        this.logger.log(`Client ${client.id} joined room: ${room.id}`);
        client.emit('joinedRoom', room);
        this.server.to(room.id).emit('updateRoom', room);

        // Send wild pokemon state on join
        const wildPokemon = this.roomService.getWildPokemon(room.id);
        if (wildPokemon) {
            client.emit('updateWildPokemon', wildPokemon);
        }

        if (room.isPublic) {
            this.server.emit('roomList', this.roomService.getAllPublicRooms());
        }
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string,
    ) {
        this.leaveRoomLogic(client, roomId);
    }

    private leaveRoomLogic(client: Socket, roomId: string) {
        client.leave(roomId);
        this.clientRooms.delete(client.id);
        this.roomService.updatePlayerCount(roomId, -1);
        this.logger.log(`Client ${client.id} left room: ${roomId}`);
        client.emit('leftRoom', roomId);

        const room = this.roomService.getRoom(roomId);
        if (room) this.server.to(roomId).emit('updateRoom', room);
        this.server.emit('roomList', this.roomService.getAllPublicRooms());
    }

    @SubscribeMessage('registerSocket')
    handleRegisterSocket(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { uid: number },
    ) {
        this.userSockets.set(data.uid, client.id);
        this.logger.log(`Registered UID ${data.uid} to socket ${client.id}`);
    }

    @SubscribeMessage('sendMessageGlobal')
    handleGlobalMessage(
        @MessageBody()
        data: {
            message: string;
            sender: string;
            senderUid: number;
        },
    ) {
        this.server.to(this.globalRoom).emit('messageGlobal', {
            ...data,
            timestamp: new Date().toISOString(),
        });
    }

    @SubscribeMessage('sendMessageRoom')
    handleRoomMessage(
        @MessageBody()
        data: {
            roomId: string;
            message: string;
            sender: string;
            senderUid: number;
        },
    ) {
        this.server.to(data.roomId).emit('messageRoom', {
            ...data,
            timestamp: new Date().toISOString(),
        });
    }

    @SubscribeMessage('sendMessagePrivate')
    handlePrivateMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody()
        data: {
            targetUid: number;
            message: string;
            sender: string;
            senderUid: number;
        },
    ) {
        const targetSocketId = this.userSockets.get(data.targetUid);
        const payload = {
            ...data,
            timestamp: new Date().toISOString(),
        };

        if (targetSocketId) {
            this.server.to(targetSocketId).emit('messagePrivate', payload);
        }
        // Also send back to sender so they see it in their chat
        client.emit('messagePrivate', payload);
    }

    // Keep legacy support for Wild guesses but route to 'Wild' channel
    @SubscribeMessage('sendMessage')
    handleMessage(
        @MessageBody()
        data: {
            room: string;
            message: string;
            sender: string;
            senderUid: number;
        },
    ) {
        this.server.to(data.room).emit('messageRoom', {
            ...data,
            timestamp: new Date().toISOString(),
        });
    }

    @SubscribeMessage('getWildPokemon')
    handleGetWildPokemon(
        @ConnectedSocket() client: Socket,
        @MessageBody() roomId: string,
    ) {
        const wildPokemon = this.roomService.getWildPokemon(roomId);
        if (wildPokemon) {
            client.emit('updateWildPokemon', wildPokemon);
        }
    }

    @SubscribeMessage('submitGuess')
    async handleSubmitGuess(
        @ConnectedSocket() client: Socket,
        @MessageBody()
        data: {
            roomId: string;
            guess: string;
            username: string;
            ballId: number;
        },
    ) {
        // Rotom Ball (ID 0) only works if guessed correctly
        if (data.ballId !== 0) return;

        // Check if user has Rotom Ball
        const inventory = await this.inventoryService.getInventory(
            data.username,
        );
        const ball = inventory.inventory.find((i) => i.id === 0);
        if (!ball || ball.quantity <= 0)
            return client.emit('error', 'คุณรอบอล Rotom Ball ไม่พอ!');

        const result = this.roomService.submitGuess(data.roomId, data.guess);

        if (result.correct && result.pokemon) {
            // Deduct Ball
            const newInv = await this.inventoryService.useItem(
                data.username,
                0,
                1,
            );
            client.emit('inventoryUpdate', newInv);

            await this.handleRoomCatch(
                data.roomId,
                data.username,
                result.pokemon,
            );

            this.server.to(data.roomId).emit('pokemonCaught', {
                winner: data.username,
                pokemon: result.pokemon,
            });

            this.spawnNewPokemonAfterDelay(data.roomId);
        } else {
            this.server.to(data.roomId).emit('messageWild', {
                room: data.roomId,
                message: data.guess,
                sender: data.username,
                system: false,
                timestamp: new Date().toISOString(),
            });

            this.server
                .to(data.roomId)
                .emit('updateAttempts', { attempts: result.attempts });

            if (result.spawnNew) {
                this.server.to(data.roomId).emit('pokemonEscaped');
                this.spawnNewPokemonAfterDelay(data.roomId);
            }
        }
    }

    @SubscribeMessage('throwBall')
    async handleThrowBall(
        @ConnectedSocket() client: Socket,
        @MessageBody()
        data: { roomId: string; ballId: number; username: string },
    ) {
        // Rotom Ball cannot be thrown directly
        if (data.ballId === 0) return;

        const inventory = await this.inventoryService.getInventory(
            data.username,
        );
        const ballItem = inventory.inventory.find((i) => i.id === data.ballId);
        if (!ballItem || ballItem.quantity <= 0) {
            client.emit('error', 'คุณมีบอลไม่พอ!');
            return;
        }

        const state = this.roomService.getFullWildPokemon(data.roomId);
        if (!state || state.status !== 'active') return;

        // Deduct Ball
        const newInv = await this.inventoryService.useItem(
            data.username,
            data.ballId,
            1,
        );
        client.emit('inventoryUpdate', newInv);

        // Calculate Chance
        const rates: Record<number, number> = {
            1: 0.15, // Poké Ball
            2: 0.35, // Great Ball
            3: 0.6, // Ultra Ball
            4: 1.0, // Master Ball
        };
        const chance = rates[data.ballId] || 0.1;
        const success = Math.random() < chance;

        if (success) {
            state.status = 'completed';
            await this.handleRoomCatch(data.roomId, data.username, state);
            this.server.to(data.roomId).emit('pokemonCaught', {
                winner: data.username,
                pokemon: state,
            });
            this.spawnNewPokemonAfterDelay(data.roomId);
        } else {
            this.server.to(data.roomId).emit('messageWild', {
                room: data.roomId,
                message: `${data.username} threw a ${ballItem.name}... But missed!`,
                sender: 'System',
                system: true,
                timestamp: new Date().toISOString(),
            });

            state.attempts += 1;
            this.server
                .to(data.roomId)
                .emit('updateAttempts', { attempts: state.attempts });

            if (state.attempts >= 20) {
                state.status = 'completed';
                this.server.to(data.roomId).emit('pokemonEscaped');
                this.spawnNewPokemonAfterDelay(data.roomId);
            }
        }
    }

    private async handleRoomCatch(
        roomId: string,
        username: string,
        pokemon: any,
    ) {
        // Find user by username to get their UID
        const user = await this.userService.findByUsername(username);
        if (!user) return;
        await this.pokemonService.catchPokemon({
            ownerUid: user.uid,
            pkmId: pokemon.id,
            name: pokemon.name,
            img: pokemon.img,
            lv: 1,
        });

        // Reward: 10 Coins
        const updatedUser = await this.userService.addCoins(
            user._id.toString(),
            10,
        );

        // Find socket for this user to update their client state
        const socketId = this.userSockets.get(user.uid);
        if (socketId && updatedUser) {
            // Get full inventory structure to emit
            const newInv = await this.inventoryService.getInventory(username);
            this.server.to(socketId).emit('inventoryUpdate', newInv);
        }

        // Reward: EXP to first party pokemon
        const party = await this.pokemonService.findParty(user.uid);
        if (party.length > 0) {
            // Give 100 EXP to the lead pokemon
            await this.pokemonService.addExp(party[0]._id.toString(), 100);

            // Notify client to update pokemon data
            const userSocketId = this.userSockets.get(user.uid);
            if (userSocketId) {
                this.server.to(userSocketId).emit('pokemonUpdated');
            }
        }

        this.server.to(roomId).emit('messageWild', {
            room: roomId,
            message: `${username} caught ${pokemon.name}! (+10 Coins, +100 EXP)`,
            sender: 'System',
            system: true,
            timestamp: new Date().toISOString(),
        });
    }

    private spawnNewPokemonAfterDelay(roomId: string) {
        setTimeout(async () => {
            const newPokemon = await this.roomService.spawnWildPokemon(roomId);
            this.server.to(roomId).emit('updateWildPokemon', newPokemon);
        }, 3000);
    }
}
