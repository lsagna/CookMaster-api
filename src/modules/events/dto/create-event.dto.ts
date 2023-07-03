import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Address } from 'src/modules/users/entities/address.entity';

export class CreateEventDto {
  @IsDate()
  @IsNotEmpty()
  readonly startTime: Date;

  @IsString()
  @IsNotEmpty()
  readonly duration: number;

  @IsNotEmpty()
  readonly address: Address;

  @IsNumber()
  @IsNotEmpty()
  readonly maxAttendees: number;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
