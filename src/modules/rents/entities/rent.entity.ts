import { Timeslot } from 'src/modules/timeslots/entities/timeslot.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rents')
export class Rent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  status: string;

  @Column()
  date: Date;

  @OneToMany(() => Timeslot, (timeslots) => timeslots.rent)
  timeslots: Timeslot[];

  @CreateDateColumn()
  createDate: Date;
}
