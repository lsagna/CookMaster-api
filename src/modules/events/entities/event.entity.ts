import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Address } from 'src/modules/users/entities/address.entity';
import { EventStatus } from '../enum/event-status.enum';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  host: User;

  @Column()
  status: EventStatus;

  @Column()
  startTime: Date;

  @Column()
  duration: number;

  @Column()
  address: Address;

  @Column()
  maxAttendees: number;

  @OneToMany(() => User, (user) => user.id)
  attendees: User[];

  @Column()
  remainingTickets: number;

  @Column()
  description: string;
}
