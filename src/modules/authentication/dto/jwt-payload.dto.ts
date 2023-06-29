import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Roles } from '../enum/roles.enum';

export class JwtPayloadDto {
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  role: Roles;
}
