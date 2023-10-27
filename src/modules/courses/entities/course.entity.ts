import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { CourseType } from '../enum/course-type.enum';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column()
  type: CourseType;

  @Column()
  title: string;

  @Column('json')
  content: Section[];

  @CreateDateColumn()
  createDate: Date;
}

export class Section {
  sectionTitle: string;

  sectionText: string;

  sectionImage: string;
}
