import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/users/entities/user.entity';
import { UsersService } from '../domain/users/users.service';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './hashing/hashing.service';
import { JwtPayload } from './interface/jwt-payload.interface';
import { RequestUser } from './interface/request-user.interface';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateLocal(email: string, password: string): Promise<User> {
    const user = await this.userRespository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        password: true,
        first_name: true,
        last_name: true,
        role: true,
        status: true, // ✅ include password for validation
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isMatch = await this.hashingService.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password is invalid');
    }

    return user; // ✅ full User entity
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

  async login(loginDto: LoginDto) {
    let user;

    // Email/Username + password login
    if ((loginDto.email || loginDto.name) && loginDto.password) {
      if (loginDto.email) {
        user = await this.usersService.findByEmail(loginDto.email);
      }

      if (loginDto.name) {
        user = await this.usersService.findByUsername(loginDto.name);
      }

      if (!user) {
        throw new BadRequestException('Email or Username not found');
      }

      // validateLocal must return full User entity or DTO
      user = await this.validateLocal(user.email, loginDto.password);

      // generate JWT
      const payload: JwtPayload = {
        sub: user.id,
      };
      const access_token = this.jwtService.sign(payload);

      // strip sensitive fields
      const { password: pwd, ...safeUser } = user;

      return {
        accessToken: access_token,
        access_token,
        expiresIn: 3600,
        expires_in: 3600,
        token_type: 'Bearer',
        user: {
          id: user.id,
          name: user.name,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role,
          status: user.status,
        },
      };
    }
  }

  
}
