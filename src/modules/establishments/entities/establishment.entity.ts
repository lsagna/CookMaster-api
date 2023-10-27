import { Address } from 'src/modules/users/entities/address.entity';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Establishment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  adress: Address;

  @Column()
  information: string;

  @Column()
  rooms: Room[];
}

export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column()
  remainingWorkbench: number[];
}
