import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../querying/dto/pagination.dto';
import { PaginationService } from '../../querying/pagination.service';
import { DEFAULT_PAGE_SIZE } from '../../querying/util/querying.constant';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly paginationService: PaginationService,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1 } = paginationDto;
    const limit = paginationDto.limit || DEFAULT_PAGE_SIZE.PRODUCTS;

    const offset = this.paginationService.calculateOffset(limit, page);

    // Fetch products with pagination and relations
    const [data, count] = await this.productRepository.findAndCount({
      skip: page,
      take: limit,
    });

    const meta = this.paginationService.createMeta(limit, page, count);

    return { data, meta };
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
