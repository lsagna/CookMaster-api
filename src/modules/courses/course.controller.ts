import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CoursesService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCourses(
    @Query('relations') relations: string[] = [],
    @Query('relation') relation: string,
  ): Promise<Course[]> {
    if (relation) relations.push(relation);
    return await this.coursesService.getAll(relations);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCourse(
    @Param() req,
    @Query('relations') relations: string[] = [],
    @Query('relation') relation: string,
  ): Promise<Course> {
    if (relation) relations.push(relation);
    return await this.coursesService.getById(req.id, relations);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async createCourse(@Body() courseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(courseDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateCourse(
    @Param('id') id: number,
    @Body() courseDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.update(id, courseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Req() req, @Param('id') id: number): Promise<void> {
    return this.coursesService.delete(req.user.id, id);
  }
}
