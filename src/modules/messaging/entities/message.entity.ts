import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MessagingRoom } from './messaging-room.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  created: Date;

  @Column()
  writer: number;

  @ManyToOne(() => MessagingRoom, (room) => room.messages)
  room: MessagingRoom;

  @Column('int', { array: true, default: [] })
  seen: number[];
}
