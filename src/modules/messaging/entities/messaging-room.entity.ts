import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';

@Entity('messaging-rooms')
export class MessagingRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @CreateDateColumn()
  created: Date;

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];

  @ManyToOne(() => User, (user) => user.interactions)
  interlocutor: User;

  getLastMessageDate(): Date | null {
    return this.messages.length === 0
      ? null
      : this.messages.at(this.messages.length - 1).created;
  }
}
