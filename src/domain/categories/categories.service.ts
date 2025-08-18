import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../common/util/common.constants';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
@Injectable()
export class categoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  create(createcategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createcategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    return this.categoryRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.CATEGORIES,
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { products: true },
    });
    if (!category) throw new NotFoundException('category not found.');
    return category;
  }

  async update(id: number, updatecategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updatecategoryDto,
    });
    if (!category) throw new NotFoundException('category not found');
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category.products.length) {
      throw new ConflictException('Category has some related products');
    }
    return this.categoryRepository.remove(category);
  }
}
