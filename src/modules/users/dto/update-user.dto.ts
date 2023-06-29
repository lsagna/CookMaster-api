import { AddressDto } from './address.dto';
import { IsOptional } from 'class-validator';
import { UpdatePreferencesDto } from './update-preferences.dto';

export class UpdateUserDto {
  @IsOptional()
  readonly firstname: string;

  @IsOptional()
  readonly lastname: string;

  @IsOptional()
  readonly address: AddressDto;

  @IsOptional()
  readonly preferences: UpdatePreferencesDto;
}
