import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';

import { HashingService } from '../../auth/hashing/hashing.service';
import { PaginationDto } from '../../querying/dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../../querying/util/querying.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashPassword = await this.hashPassword(password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
    });
    return this.userRepository.save(user);
  }

  findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.userRepository.find({
      skip: page,
      take: limit ?? DEFAULT_PAGE_SIZE.USERS,
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
    });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { password } = updateUserDto;
    const hashPassword = password && (await this.hashPassword(password));

    const user = await this.userRepository.preload({
      ...updateUserDto,
      password: hashPassword,
    });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number, soft: boolean) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found.');

    return soft
      ? this.userRepository.softRemove(user)
      : this.userRepository.remove(user);
  }

  async recovery(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        orders: {
          items: true,
          payment: true,
        },
      },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isDeleted) {
      throw new ConflictException('User not deleted');
    }

    return this.userRepository.recover(user);
  }

  private async hashPassword(password: string) {
    const salt = await genSalt();
    return hash(password, salt);
  }
}
