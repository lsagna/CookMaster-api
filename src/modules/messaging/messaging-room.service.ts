import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, In, Not, Repository } from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/entities/user.entity';
import { Message, MessageType } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { MsgToRoom, RoomGateway } from './room.gateway';
import { AnimalsService } from '../animals/animals.service';
import { FavoritesService } from '../favorites/favorites.service';
import { ServiceType } from '../services/enums/service-type.enum';
import { MessageService } from './message.service';
import { RoomStatus } from './enums/room-status.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationDTO } from '../notifications/dto/notification.dto';
import { NotificationType } from '../notifications/entities/notification-type.enum';

@Injectable()
export class RoomService {
  constructor(
    @Inject(forwardRef(() => RoomGateway))
    private messageGateway: RoomGateway,
    @Inject(forwardRef(() => AnimalsService))
    private animalsService: AnimalsService,
    private messageService: MessageService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    @InjectRepository(Room) private readonly repository: Repository<Room>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(user: User, animal: Animal): Promise<Room> {
    const room = new Room();
    room.status = RoomStatus.OPENED;
    room.requestGive = false;
    room.adoptant = user;
    room.animal = animal;
    room.messages = [];
    room.code = room.getCode();

    const roomDB = await this.repository.save(room);

    const message = new Message();
    message.type = MessageType.init;
    message.room = roomDB;
    message.created = new Date();
    message.writer = user.id;
    message.text = 'Conversation start';

    await this.messageService.create(message);

    return await this.getBy({ id: roomDB.id });
  }

  async findByUserAndAnimal(user: User, animal: Animal): Promise<Room> {
    const room = await this.repository.findOne({
      where: {
        animal: {
          id: animal.id,
        },
        adoptant: {
          id: user.id,
        },
        status: Not(RoomStatus.ARCHIVED),
      },
      relations: ['adoptant', 'animal', 'animal.owner', 'animal.race'],
    });
    if (room) {
      room.messages = await this.messageService.get(room.id);
      room.adoptant.removeSensitiveData();
      room.animal.owner.removeSensitiveData();
    }
    return room;
  }

  async getBy(where: FindConditions<Room>): Promise<Room> {
    where.status = Not(RoomStatus.ARCHIVED);
    const room: Room = await this.repository.findOne({
      where: where,
      relations: ['adoptant', 'animal', 'animal.owner', 'animal.race'],
    });
    if (!room) throw new NotFoundException(`Room with not found`);
    room.messages = await this.messageService.get(room.id);
    room.adoptant.removeSensitiveData();
    room.animal.owner.removeSensitiveData();
    return room;
  }

  async writeMessage(
    roomId: number,
    text: string,
    userId: number,
    type: MessageType = MessageType.text,
  ): Promise<Message> {
    const message = new Message();
    message.created = new Date();
    message.text = text;
    message.writer = userId;
    message.room = new Room();
    message.room.id = roomId;
    message.seen = [];

    return await this.messageService.create(message);
  }

  async findByUserId(id: number): Promise<Room[]> {
    const rooms = await this.repository.find({
      where: [
        {
          animal: {
            owner: {
              id: id,
            },
          },
          status: Not(RoomStatus.ARCHIVED),
        },
        {
          adoptant: {
            id: id,
          },
          status: Not(RoomStatus.ARCHIVED),
        },
      ],
      relations: ['adoptant', 'animal', 'animal.owner', 'animal.race'],
    });

    return Promise.all(
      rooms.map(async (room) => {
        room.messages = await this.messageService.get(room.id);
        room.adoptant.removeSensitiveData();
        room.animal.owner.removeSensitiveData();
        return room;
      }),
    );
  }
}
