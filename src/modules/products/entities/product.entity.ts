import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { ProductType } from '../enum/product-type.enum';
import { Address } from 'src/modules/users/entities/address.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('json')
  images: string[];

  @Column()
  type: ProductType;

  @Column()
  price: number;

  @Column()
  stock: number;

  @CreateDateColumn()
  createDate: Date;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  duration: Date;

  @Column('json', { nullable: true })
  adress: Address;
}