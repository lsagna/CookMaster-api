import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Course } from './entities/course.entity';
import { User } from '../users/entities/user.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly configS: ConfigService,
  ) {}

  async getAll(relations: string[] = []): Promise<Course[]> {
    return await this.courseRepository.find({
      relations: relations,
    });
  }

  async getById(id: number, relations: string[] = []): Promise<Course> {
    const course: Course = await this.courseRepository.findOne({
      where: { id: id },
      relations: relations,
    });

    if (!course) throw new NotFoundException(`Course with id: ${id} not found`);
    return course;
  }

  async create(courseDto: CreateCourseDto): Promise<Course> {
    const newCourse = new Course();
    newCourse.title = courseDto.title;
    newCourse.type = courseDto.type;
    newCourse.content = courseDto.content;

    return this.courseRepository.save(newCourse);
  }

  async update(id: number, courseDto: UpdateCourseDto): Promise<Course> {
    const course: Course = await this.getById(id);

    course.title = courseDto.title ?? course.title;
    course.content = courseDto.content ?? course.content;

    return this.courseRepository.save(course);
  }

  async delete(userId: number, courseId: number) {
    const user: User = await this.userService.getById(userId);
    const course: Course = await this.getById(courseId);

    if (user.id !== course.creator.id) {
      throw new ForbiddenException("Can't delete the animal of someone else!");
    }

    await this.courseRepository.delete(courseId);
  }
}
