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
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { Roles } from './enum/roles.enum';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async createAccount(
    @Body() userDto: CreateUserDto,
    @Query('role') role: Roles
  ): Promise<User> {
    return this.authService.register(userDto, role);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() login: LoginDto): Promise<JwtResponseDto> {
    return this.authService.login(login);
  }

  @Get('token/:id/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Param('id') id: string,
    @Query('key') key: string,
  ): Promise<JwtResponseDto> {
    return this.authService.refreshToken(parseInt(id), key);
  }

}
