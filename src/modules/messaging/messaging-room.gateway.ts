import { forwardRef, Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Roles } from '../authentication/enum/roles.emum';
import { NotificationType } from '../notifications/entities/notification-type.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';
import { MessagingRoomService } from './messaging-room.service.ts';

const { MESSAGE_PORT } = process.env;

@WebSocketGateway(parseInt(MESSAGE_PORT), {
  cors: {
    origin: '*',
  },
})
export class MessagingRoomGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => MessagingRoomService))
    private readonly roomService: MessagingRoomService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMsgToRoom')
  async sendMessage(client: Socket, body: MsgToRoom): Promise<void> {
    const room = await this.roomService.getBy({ id: body.roomId });
    const msgMaxLength = 10000;
    if (true || (await this.server.to(body.roomCode).allSockets()).size < 2) {
      this.notificationsService.sendToUserIds(
        [
          parseInt(body.userId) === room.animal.owner.id
            ? room.adoptant.id
            : room.animal.owner.id,
        ],
        {
          type: NotificationType.MESSAGE,
          title:
            parseInt(body.userId) === room.animal.owner.id
              ? room.animal.owner.role !== Roles.PRO
                ? room.animal.owner.firstname
                : room.animal.owner.shelter.name
              : room.adoptant.firstname,
          body:
            body.msg.length <= msgMaxLength
              ? body.msg
              : body.msg.substring(0, msgMaxLength),
          icon: '',
        },
      );
    }

    const message = await this.roomService.writeMessage(
      body.roomId,
      body.msg,
      parseInt(body.userId),
    );
    this.server.to(body.roomCode).emit('receiveMsgToRoom', message);
  }

  @SubscribeMessage('seenMessages')
  async seenMessages(
    client: Socket,
    body: { messageIds: number[]; userIds: number[]; roomId: number },
  ): Promise<void> {
    const room = await this.roomService.getBy({ id: body.roomId });
    await this.messageService.addSeenMessage(
      body.userIds,
      body.messageIds,
      room.code,
    );
  }

  public async sendSeenMessages(messages: Message[], roomCode: string) {
    this.server.to(roomCode).emit('receiveSeenMessages', messages);
  }

  @SubscribeMessage('join')
  async handleJoinRoom(client: Socket, room: string): Promise<void> {
    await client.join(room);
    client.emit('joined', room);
  }

  @SubscribeMessage('message')
  async handleMsg(client: Socket, room: string) {
    client.emit('message', room);
  }

  @SubscribeMessage('leave')
  async handleLeaveRoom(client: Socket, room: string): Promise<void> {
    await client.leave(room);
    client.emit('left', room);
  }
}

export type MsgToRoom = {
  roomCode: string;
  roomId: number;
  userId: string;
  msg: string;
};
