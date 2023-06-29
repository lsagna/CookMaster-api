import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column({ nullable: true })
  apartment: string;

  @Column()
  zip: number;

  @Column()
  city: string;

  @Column()
  country: string;
}
