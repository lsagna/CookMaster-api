import { IsNotEmpty, IsEmail, IsString, IsObject } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  readonly street: string;

  @IsString()
  @IsNotEmpty()
  readonly apartment: string;

  @IsString()
  @IsNotEmpty()
  readonly zip: number;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  readonly country: string;
}
