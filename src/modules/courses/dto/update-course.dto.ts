import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string[];
}
