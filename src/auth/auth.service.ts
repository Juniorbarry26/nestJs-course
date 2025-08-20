import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/users/entities/user.entity';
import { HashingService } from './hashing/hashing.service';
import { RequestUser } from './interface/request-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async validateLocal(email: string, password: string) {
    const user = await this.userRespository.findOne({
      select: {
        id: true,
        password: true,
      },
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isMatch = await this.hashingService.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password is invalid');
    }

    const requestUser: RequestUser = {
      id: user.id,
      user: undefined,
    };
    return requestUser;
  }
}
