//-Path: "TeaChoco-Hospital/server/src/api/socket/socket.module.ts"
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
    exports: [SocketGateway, SocketService],
    providers: [SocketGateway, SocketService],
})
export class SocketModule {}
