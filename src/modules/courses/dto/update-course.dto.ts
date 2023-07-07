import { IsNotEmpty, IsString } from 'class-validator';
import { Section } from '../entities/course.entity';

export class UpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: Section[];
}
