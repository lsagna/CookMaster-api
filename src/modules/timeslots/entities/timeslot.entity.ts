import { Room } from 'src/modules/establishments/entities/establishment.entity';
import { Rent } from 'src/modules/rents/entities/rent.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('timeslots')
export class Timeslot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room)
  @JoinColumn()
  room: Room;

  @ManyToOne(() => Rent)
  @JoinColumn()
  rent: Rent;

  @Column()
  date: Date;
}
