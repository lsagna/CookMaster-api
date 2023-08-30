import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Course } from './entities/course.entity';
import { Address } from '../users/entities/address.entity';
import { RefreshToken } from '../users/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Course, User, Address, RefreshToken]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, UsersService],
  exports: [CoursesService],
})
export class CoursesModule {}
