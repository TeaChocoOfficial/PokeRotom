//-Path: "TeaChoco-Hospital/server/src/api/socket/socket.service.ts"
import { Socket, Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SocketService {
    server: Server;
    logger = new Logger(SocketService.name);

    constructor() {}

    setServer(server: Server) {
        this.server = server;
    }

    getUser(client: Socket) {
        return client.handshake.auth.user;
    }
}
