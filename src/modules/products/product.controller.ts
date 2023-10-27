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
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCourses(
    @Query('relations') relations: string[] = [],
    @Query('relation') relation: string,
  ): Promise<Product[]> {
    if (relation) relations.push(relation);
    return await this.productsService.getAll(relations);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCourse(
    @Param() req,
    @Query('relations') relations: string[] = [],
    @Query('relation') relation: string,
  ): Promise<Product> {
    if (relation) relations.push(relation);
    return await this.productsService.getById(req.id, relations);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async createProduct(
    @Param() req,
    @Body() productDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(productDto, req.id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: number,
    @Body() productDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, productDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Req() req, @Param('id') id: number): Promise<void> {
    return this.productsService.delete(req.user.id, id);
  }
}
