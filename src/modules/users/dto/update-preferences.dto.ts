import { IsNotEmpty, IsString, IsObject, IsBoolean } from 'class-validator';

export class UpdatePreferencesDto {
  @IsString()
  @IsNotEmpty()
  lang: string;

  @IsBoolean()
  @IsNotEmpty()
  darkMode: boolean;

  @IsBoolean()
  @IsNotEmpty()
  notifications: boolean;

  @IsBoolean()
  @IsNotEmpty()
  updates: boolean;
}
