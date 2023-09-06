import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('timeslots')
export class Timeslot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn()
  rent: User;

  @Column()
  date: Date;

  @CreateDateColumn()
  createDate: Date;
}
