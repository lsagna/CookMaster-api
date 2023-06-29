import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Roles } from './enum/roles.enum';
import { LoginDto } from './dto/login.dto';
import { JwtResponseDto } from './dto/jwt-response.dto';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configS: ConfigService,
  ) {}

  async register(
    registrationData: CreateUserDto,
    role: Roles = Roles.STANDARD,
  ): Promise<User> {
    console.log('in register');
    const emailExist: boolean = await this.usersService.isEmailExist(
      registrationData.email,
    );

    if (emailExist) throw new ConflictException('This email already exists');

    const user: User = await this.usersService.create(registrationData, role);

    return user;
  }

  async login(login: LoginDto): Promise<JwtResponseDto> {
    const user: User = await this.usersService.getWithPassword(login.email);

    if (!user || user.closeDate)
      throw new UnauthorizedException('Account blocked');

    const isPasswordEquals: boolean = await compare(
      login.password,
      user.password,
    );

    console.log(login.password);
    console.log(user.password);
    console.log(isPasswordEquals);
    if (!isPasswordEquals)
      throw new UnauthorizedException('Invalid credentials');

    console.log('i');
    const tokenInfo: RefreshToken = await this.usersService.updateRefreshToken(
      user.id,
    );
    console.log('ii');

    return this.getJwtPayload(user, tokenInfo.refreshKey);
  }

  async refreshToken(id: number, refreshKey: string): Promise<JwtResponseDto> {
    const user: User = await this.usersService.getById(id, ['refreshToken']);
    if (!user.refreshToken)
      throw new ConflictException(`No refresh key for user id: ${id}`);

    if (refreshKey !== user.refreshToken.refreshKey)
      throw new UnauthorizedException('Invalid refresh token');

    return this.getJwtPayload(user, user.refreshToken.refreshKey);
  }

  private getJwtPayload(user: User, refreshToken: string): JwtResponseDto {
    const jwtPayload: JwtPayloadDto = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(jwtPayload, {
        secret: this.configS.get<string>('JWT_SECRET'),
        expiresIn: this.configS.get<number>('JWT_EXPIRATION'),
      }),
      refreshKey: refreshToken,
    };
  }
}
