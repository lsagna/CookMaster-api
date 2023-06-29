import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { UsersModule } from '../users/users.module';

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const JWT_CONFIG = {
  secret: JWT_SECRET,
  signOptions: { expiresIn: JWT_EXPIRATION },
};

@Module({
  imports: [
    JwtModule.register(JWT_CONFIG),
    forwardRef(() => UsersModule),
    PassportModule,
  ],
  providers: [AuthenticationService, JwtStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
