//-Path: "TeaChoco-Hospital/server/src/api/socket/socket.gateway.ts"
import {
    MessageBody,
    OnGatewayInit,
    ConnectedSocket,
    WebSocketServer,
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway()
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;
    private readonly logger = new Logger(SocketGateway.name);
    private userSockets: Map<number, string> = new Map(); // uid -> socketId
    private globalRoom = 'global_channel';
    private playerPositions: Map<
        string,
        {
            socketId: string;
            username: string;
            position: { x: number; y: number; z: number };
            rotation: { x: number; y: number; z: number };
            movementState: string;
        }
    > = new Map();

    constructor(private socketService: SocketService) {}

    afterInit(server: Server) {
        this.socketService.setServer(server);
        this.logger.log('Socket.io server initialized');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        client.join(this.globalRoom);

        // ส่งรายชื่อผู้เล่นทุกคนที่มีอยู่แล้วให้ผู้เล่นใหม่
        const currentPlayers = Array.from(this.playerPositions.values());
        client.emit('playersInit', currentPlayers);

        this.broadcastPlayerCount();
    }

    @SubscribeMessage('playerMove')
    handlePlayerMove(
        @ConnectedSocket() client: Socket,
        @MessageBody()
        data: {
            position: { x: number; y: number; z: number };
            rotation: { x: number; y: number; z: number };
            movementState: string;
        },
    ) {
        const playerData = {
            socketId: client.id,
            username: `Player_${client.id.substring(0, 4)}`,
            position: data.position,
            rotation: data.rotation,
            movementState: data.movementState,
        };

        this.playerPositions.set(client.id, playerData);
        client.broadcast.emit('playerMoved', playerData);
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

        // Remove from 3D world positions and notify others
        this.playerPositions.delete(client.id);
        this.server.emit('playerLeft', { socketId: client.id });
        this.broadcastPlayerCount();
    }

    private broadcastPlayerCount() {
        const count =
            this.server?.engine?.clientsCount || this.playerPositions.size;
        this.server.emit('playersSync', { count });
    }

    @SubscribeMessage('sendMessageGlobal')
    handleGlobalMessage(
        @MessageBody()
        data: {
            sender: string;
            message: string;
            senderUid: number;
        },
    ) {
        this.server.to(this.globalRoom).emit('messageGlobal', {
            ...data,
            timestamp: new Date().toISOString(),
        });
    }
}
