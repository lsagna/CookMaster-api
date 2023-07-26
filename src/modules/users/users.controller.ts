import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../authentication/enum/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Param() req,
    @Query('relations') relations: string[] = [],
    @Query('relation') relation: string,
  ): Promise<User> {
    if (relation) relations.push(relation);
    return await this.usersService.getById(req.id, relations);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async createUser(
    @Param('id') id: number,
    @Body() userDto: CreateUserDto,
    @Body() role: Roles,
  ): Promise<User> {
    return this.usersService.create(userDto, role);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() userDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, userDto);
  }
}
