import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Roles } from 'src/modules/authentication/enum/roles.enum';
import { RefreshToken } from './refresh-token.entity';
import { MessagingRoom } from 'src/modules/messaging/entities/messaging-room.entity';

export class Preferences {
  lang: string;
  darkMode: boolean;
  notifications: boolean;
  updates: boolean;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  firstname: string;

  @Column('text')
  lastname: string;

  @Column('text', { nullable: true })
  avatar: string;

  @Column({ nullable: true })
  code?: number;

  @OneToOne(() => RefreshToken)
  @JoinColumn()
  refreshToken?: RefreshToken;

  @Column('json', { nullable: true })
  address: Address;

  @Column('json')
  preferences: Preferences;

  @Column()
  role: Roles;

  @Column()
  shoppingCart: number[];

  @Column()
  interactions: MessagingRoom[];

  @CreateDateColumn()
  createDate: Date;

  @Column({ nullable: true })
  closeDate?: Date;
}
