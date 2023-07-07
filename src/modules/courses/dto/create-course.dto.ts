import { IsNotEmpty, IsString } from 'class-validator';
import { CourseType } from '../enum/course-type.enum';
import { Section } from '../entities/course.entity';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  readonly type: CourseType;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: Section[];
}
