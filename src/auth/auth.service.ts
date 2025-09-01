import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/users/entities/user.entity';
import { HashingService } from './hashing/hashing.service';
import { JwtPayload } from './interface/jwt-payload.interface';
import { RequestUser } from './interface/request-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
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

  async validateJwt(payload: JwtPayload) {
    const user = await this.userRespository.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const requestUser: RequestUser = {
      id: payload.sub,
      user: undefined,
    };
    return requestUser;
  }

  login(user: RequestUser) {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.sign(payload);
  }

   getProfile(id: number) {
    return this.userRespository.findOneBy({id});
  }
}
