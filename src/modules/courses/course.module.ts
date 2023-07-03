import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
