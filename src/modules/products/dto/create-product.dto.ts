import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductType } from '../enum/product-type.enum';
import { Address } from 'src/modules/users/entities/address.entity';

export class CreateProductDto {
  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsDate()
  @IsOptional()
  startTime: Date;

  @IsDate()
  @IsOptional()
  duration: Date;

  @IsObject()
  @IsOptional()
  adress: Address;
}
