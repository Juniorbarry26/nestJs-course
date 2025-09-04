import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/util/common.constants';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    const [data, count] = await this.productRepository.findAndCount({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.PRODUCTS,
      relations: { categories: true },
    });

    return { data, count };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { categories: true },
    });
    if (!product) throw new NotFoundException('Product not found.');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }
}
