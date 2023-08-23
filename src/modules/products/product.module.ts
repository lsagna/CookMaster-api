import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Product } from './entities/product.entity';
import { Address } from '../users/entities/address.entity';
import { RefreshToken } from '../users/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Product, User, Address, RefreshToken]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, UsersService],
  exports: [ProductsService],
})
export class ProductsModule {}
