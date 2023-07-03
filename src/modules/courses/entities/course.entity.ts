import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { CourseType } from '../enum/course-type.enum';


@Entity('users')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column()
  type: CourseType;

  @Column()
  title: string;

  @Column()
  content: string[];

  @CreateDateColumn()
  createDate: Date;
}
