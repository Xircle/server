import { RoomModule } from './../room/room.module';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';

@Module({
  imports: [AuthModule, RoomModule],
  providers: [ChatsGateway],
  exports: [ChatsGateway],
})
export class ChatsModule {}
