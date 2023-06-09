import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class JwtResponseDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  token: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  refreshKey: string;
}
