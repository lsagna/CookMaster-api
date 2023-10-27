import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductType } from '../enum/product-type.enum';
import { Address } from 'src/modules/users/entities/address.entity';

export class UpdateProductDto {
  @IsEnum(ProductType)
  @IsOptional()
  type: ProductType;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  images: string[];

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
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
