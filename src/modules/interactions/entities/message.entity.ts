import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InteractionRoom } from './interaction-room.entity';

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

  @ManyToOne(() => InteractionRoom, (room) => room.messages)
  room: InteractionRoom;

  @Column('int', { array: true, default: [] })
  seen: number[];
}
