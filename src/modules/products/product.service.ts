import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UsersService } from '../users/users.service';
import { Product } from './entities/product.entity';
import { ProductType } from './enum/product-type.enum';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAll(relations: string[] = []): Promise<Product[]> {
    return await this.productRepository.find({
      relations: relations,
    });
  }

  async getById(id: number, relations: string[] = []): Promise<Product> {
    const product: Product = await this.productRepository.findOne({
      where: { id: id },
      relations: relations,
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);
    return product;
  }

  async create(
    productDto: CreateProductDto,
    creatorId: number,
  ): Promise<Product> {
    const newProduct = new Product();
    const creator = await this.userService.getById(creatorId);
    newProduct.creator = creator;
    newProduct.name = productDto.name;
    newProduct.description = productDto.description;
    newProduct.type = productDto.type;
    newProduct.price = productDto.price;
    newProduct.stock = productDto.stock;
    newProduct.images = productDto.images;

    if (productDto.type == ProductType.EVENT) {
      newProduct.startTime = productDto.startTime;
      newProduct.duration = productDto.duration;
      newProduct.adress = productDto.adress;
    }

    return this.productRepository.save(newProduct);
  }

  async update(id: number, productDto: UpdateProductDto): Promise<Product> {
    const product: Product = await this.getById(id);

    product.name = productDto.name ?? product.name;
    product.description = productDto.description ?? product.description;
    product.images = productDto.images ?? product.images;
    product.type = productDto.type ?? product.type;
    product.price = productDto.price ?? product.price;
    product.stock = productDto.stock ?? product.stock;
    product.startTime = productDto.startTime ?? product.startTime;
    product.duration = productDto.duration ?? product.duration;
    product.adress = productDto.adress ?? product.adress;

    return this.productRepository.save(product);
  }

  async delete(creatorId: number, productId: number) {
    const user: User = await this.userService.getById(creatorId);
    const product: Product = await this.getById(productId);

    if (user.id !== product.creator.id) {
      throw new ForbiddenException("Can't delete the product of someone else!");
    }

    await this.productRepository.delete(productId);
  }
}
